import { Stack } from 'expo-router';

import { stackHeader } from '@/theme/navigation';

export default function BodyLayout() {
  return (
    <Stack screenOptions={stackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
