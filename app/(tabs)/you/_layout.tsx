import { Stack } from 'expo-router';

import { useStackHeader } from '@/theme/navigation';

export default function YouLayout() {
  const header = useStackHeader();
  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="verdict" options={{ headerShown: false }} />
      <Stack.Screen name="card" options={{ headerShown: false }} />
      <Stack.Screen name="crew" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ title: 'Forge Pro' }} />
    </Stack>
  );
}
