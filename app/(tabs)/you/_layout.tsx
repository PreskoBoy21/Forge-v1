import { Stack } from 'expo-router';

import { stackHeader } from '@/theme/navigation';

export default function YouLayout() {
  return (
    <Stack screenOptions={stackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="verdict" options={{ headerShown: false }} />
      <Stack.Screen name="card" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ title: 'Forge Pro' }} />
    </Stack>
  );
}
