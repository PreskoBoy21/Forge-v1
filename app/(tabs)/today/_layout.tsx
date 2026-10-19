import { Stack } from 'expo-router';

import { stackHeader } from '@/theme/navigation';

export default function TodayLayout() {
  return (
    <Stack screenOptions={stackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="forge-day" options={{ headerShown: false }} />
    </Stack>
  );
}
