// src/app/index.tsx

import { Redirect } from 'expo-router';

export default function AppIndex() {
  return <Redirect href="/(tabs)/restaurants/" />;
}
