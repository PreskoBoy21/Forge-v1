import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';

export default function FoodLayout() {
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
      <Stack.Screen name="scan" options={{ title: 'Scan' }} />
      <Stack.Screen name="review" options={{ title: 'Review' }} />
      <Stack.Screen name="add-manual" options={{ title: 'Add meal' }} />
    </Stack>
  );
}
