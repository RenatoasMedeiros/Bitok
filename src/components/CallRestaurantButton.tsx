import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Alert,
  Linking,
  Modal,
  View,
  TextInput,
  Button,
  AppState,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

type CallRestaurantButtonProps = {
  text?: string; // Optional prop to customize the button text
  phoneNumber: string; // The restaurant's phone number to call
  restaurantId: string; // The restaurant's ID for reservation
};

const CallRestaurantButton: React.FC<CallRestaurantButtonProps> = ({
  text = 'Call the Restaurant',
  phoneNumber,
  restaurantId,
  }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservationTime, setReservationTime] = useState(''); // Changed to string
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [isCallInitiated, setIsCallInitiated] = useState(false);

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Listen for app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (isCallInitiated && nextAppState === 'active') {
        setModalVisible(true);
        setIsCallInitiated(false);
      }
    };

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Cleanup listeners on unmount
    return () => {
      authListener?.subscription.unsubscribe();
      appStateListener.remove();
    };
  }, [isCallInitiated]);

  const handleCallPress = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'No phone number provided.');
      return;
    }

    if (!session || !session.user) {
      router.push('/(tabs)/authRoute');
      return;
    }

    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      setIsCallInitiated(true); // Set the flag before making the call
      await Linking.openURL(url); // Initiate the call
    } else {
      Alert.alert('Error', 'Unable to make a call from this device.');
    }
  };

  const handleReservation = async () => {
    // Validate reservation time
    if (!reservationTime) {
      Alert.alert('Error', 'Please enter a reservation time.');
      return;
    }

    // Parse the reservation time
    const parsedDate = new Date(reservationTime);
    const now = new Date();

    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Error', 'Invalid date and time format. Please use YYYY-MM-DD HH:MM.');
      return;
    }

    if (parsedDate <= now) {
      Alert.alert('Error', 'Reservation time must be in the future.');
      return;
    }

    // Validate number of guests
    const guests = parseInt(numberOfGuests, 10);
    if (isNaN(guests) || guests < 1 || guests > 20) {
      Alert.alert('Error', 'Please enter a valid number of guests (1-20).');
      return;
    }

    const userId = session?.user?.id;

    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    // Insert the reservation into the supabase
    const { data, error } = await supabase.from('reservations').insert([
      {
        user_id: userId,
        restaurant_id: restaurantId,
        reservation_time: parsedDate.toISOString(),
        number_of_guests: guests,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your reservation has been made.');
      setModalVisible(false);
    }
  };

  return (
    <>
      <Pressable onPress={handleCallPress} style={styles.buttonContainer}>
        <Ionicons name="call" size={52} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>

      {/* Reservation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save the Reservation! 🙂‍↔️</Text>

            {/* Number of Guests Input */}
            <Text style={styles.label}>Someone coming with you? 😋</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={numberOfGuests}
              onChangeText={setNumberOfGuests}
              keyboardType="number-pad"
            />

            {/* Reservation Time Input */}
            <Text style={styles.label}>What time is it? 🕒</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD HH:MM"
              value={reservationTime}
              onChangeText={setReservationTime}
              keyboardType="default"
            />

            {/* Confirm and Cancel Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Confirm" onPress={handleReservation} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertical alignment
    justifyContent: 'center', // Horizontal alignment
    borderRadius: 50,
    backgroundColor: '#34c759',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 85,
    marginVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    marginLeft: 10, // Spacing between icon and text
  },
  icon: {
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default CallRestaurantButton;
