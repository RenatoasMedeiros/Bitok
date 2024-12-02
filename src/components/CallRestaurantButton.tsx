import React from 'react';
import { Pressable, StyleSheet, Text, View, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CallRestaurantButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  text?: string; // Optional prop to customize the button text
};

const CallRestaurantButton: React.FC<CallRestaurantButtonProps> = ({ onPress, text = 'Call the Restaurant' }) => {
  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
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
