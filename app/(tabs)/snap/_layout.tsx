import { Stack } from 'expo-router';

import { stackHeader } from '@/theme/navigation';

export default function SnapLayout() {
  return (
    <Stack screenOptions={stackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="fix" options={{ title: 'Fix' }} />
    </Stack>
  );
}
