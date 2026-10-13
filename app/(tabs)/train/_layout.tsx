import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';

export default function TrainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: 'Oswald_600SemiBold' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="session" options={{ title: 'Session' }} />
      <Stack.Screen name="history" options={{ title: 'History' }} />
    </Stack>
  );
}
