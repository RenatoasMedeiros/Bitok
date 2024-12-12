// src/app/(tabs)/reservations/_layout.tsx

import React from 'react';
import { Stack } from "expo-router";

export default function ReservationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Reservations' }} />
      <Stack.Screen name="[id]" options={{ title: 'Reservation Details' }} />
    </Stack>
  );
}
