// src/app/(tabs)/account/_layout.tsx

import React from 'react';
import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Account' }} />
    </Stack>
  );
}