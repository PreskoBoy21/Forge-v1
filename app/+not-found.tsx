import { Link, Stack } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Missing', headerShown: true }} />
      <Screen>
        <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
          Lost the set
        </Text>
        <Link href="/(auth)/welcome" className="mt-6">
          <Text className="font-uiSemi text-molten">Back to start</Text>
        </Link>
      </Screen>
    </>
  );
}
