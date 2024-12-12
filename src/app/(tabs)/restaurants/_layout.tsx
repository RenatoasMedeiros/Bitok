// src/app/(tabs)/restaurants/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';

export default function RestaurantsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Restaurants' }} />
      <Stack.Screen name="[id]" options={{ title: 'Restaurant Details' }} />
      <Stack.Screen
        name="productDetails/[productId]"
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen
        name="restaurantDetails/[detailId]"
        options={{ title: 'Restaurant Details' }}
      />
    </Stack>
  );
}
