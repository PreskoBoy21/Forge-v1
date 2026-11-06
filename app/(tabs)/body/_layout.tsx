import { Stack } from 'expo-router';

import { useStackHeader } from '@/theme/navigation';

export default function BodyLayout() {
  const header = useStackHeader();
  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
