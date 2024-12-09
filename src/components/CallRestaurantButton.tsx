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
import DatePicker from 'react-native-date-picker';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import RNModal from 'react-native-modal'; // Import react-native-modal

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
  const [reservationTime, setReservationTime] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [isCallInitiated, setIsCallInitiated] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
    const selectedTime = reservationTime;
    const now = new Date();

    if (selectedTime <= now) {
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

    // Insert the reservation into the database
    const { data, error } = await supabase.from('reservations').insert([
      {
        user_id: userId,
        restaurant_id: restaurantId,
        reservation_time: selectedTime.toISOString(),
        number_of_guests: guests,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your reservation has been made.');
      setModalVisible(false);
      // Optionally, navigate or update UI
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
            <Text style={styles.modalTitle}>Make a Reservation</Text>

            {/* Reservation Time Picker */}
            <Text style={styles.label}>Reservation Time:</Text>
            <Pressable
              onPress={() => setIsDatePickerOpen(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                {reservationTime
                  ? reservationTime.toLocaleString()
                  : 'Select Reservation Time'}
              </Text>
            </Pressable>

            {/* Date Picker Modal using react-native-modal */}
            <RNModal
              isVisible={isDatePickerOpen}
              onBackdropPress={() => setIsDatePickerOpen(false)}
              onBackButtonPress={() => setIsDatePickerOpen(false)}
              style={styles.datePickerOverlay}
            >
              <View style={styles.datePickerContainer}>
                <DatePicker
                  date={reservationTime}
                  onDateChange={setReservationTime}
                  mode="datetime"
                  minimumDate={new Date()} // Prevent selecting past dates
                />
                <Button
                  title="Confirm"
                  onPress={() => setIsDatePickerOpen(false)}
                />
              </View>
            </RNModal>

            {/* Number of Guests Input */}
            <Text style={styles.label}>Number of Guests:</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={numberOfGuests}
              onChangeText={setNumberOfGuests}
              keyboardType="number-pad"
            />

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
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerOverlay: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  datePickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default CallRestaurantButton;
