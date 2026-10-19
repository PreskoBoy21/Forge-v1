import { Stack } from 'expo-router';

import { stackHeader } from '@/theme/navigation';

export default function TrainLayout() {
  return (
    <Stack screenOptions={stackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="gym"
        options={{ title: 'Gym Mode', headerShown: false }}
      />
      <Stack.Screen name="history" options={{ title: 'History' }} />
    </Stack>
  );
}
