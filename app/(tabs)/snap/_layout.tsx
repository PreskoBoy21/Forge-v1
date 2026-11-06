import { Stack } from 'expo-router';

import { useStackHeader } from '@/theme/navigation';

export default function SnapLayout() {
  const header = useStackHeader();
  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="fix" options={{ title: 'Fix' }} />
      <Stack.Screen
        name="barcode"
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
    </Stack>
  );
}
