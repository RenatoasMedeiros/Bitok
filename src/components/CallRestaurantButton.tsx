import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, GestureResponderEvent, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import  Account  from '@/components/Account';
import  Auth  from '@/app/(tabs)/authRoute';
import { Link, Redirect, router } from 'expo-router';
import restaurants from '@assets/data/restaurants';

type CallRestaurantButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  text?: string; // Optional prop to customize the button text
  phoneNumber: string; // The restaurant's phone number to call
};

const CallRestaurantButton: React.FC<CallRestaurantButtonProps> = ({ onPress, text = 'Call the Restaurant', phoneNumber }) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);

  const handleCallPress = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'No phone number provided.');
      return;
    }
    
    const url = `tel:${phoneNumber}`;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      if (!session || !session.user) {
        router.push("/(tabs)/authRoute")
        return;
      }
      await Linking.openURL(url); // Open the phone dialer with the given number
    } else {
      Alert.alert('Error', 'Unable to make a call from this device.');
    }
  };

  return (
    <Pressable onPress={handleCallPress} style={styles.buttonContainer}>
        <Ionicons name="call" size={52} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // vertical
    justifyContent: 'center', // horizontal
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
    fontWeight: 'light',
    textAlign: 'center',
    marginLeft: 10, // Add spacing between the icon and text
  },
  icon: {
    marginRight: 15,
  },
});

export default CallRestaurantButton;
