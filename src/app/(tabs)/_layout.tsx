// src/app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure Ionicons is installed
import Colors from '@/constants/Colors'; // Adjust the path based on your project structure
import { useColorScheme } from '@/components/useColorScheme'; // Custom hook for color scheme

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'reservations') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'account') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'restaurants') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* Reorder tabs to set 'restaurants' as the first/default tab */}
      <Tabs.Screen
        name="restaurants"
        options={{ title: 'Restaurants' }}
      />
      <Tabs.Screen
        name="reservations"
        options={{ title: 'Reservations' }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account' }}
      />
    </Tabs>
  );
}
