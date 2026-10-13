import { Link, Stack } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Missing', headerShown: true }} />
      <Screen>
        <Text className="font-heading text-3xl uppercase text-ink">
          Lost the set
        </Text>
        <Text className="mt-2 font-body text-base text-muted">
          This screen does not exist.
        </Text>
        <Link href="/(auth)/welcome" className="mt-6">
          <Text className="font-bodySemi text-lime">Back to start</Text>
        </Link>
      </Screen>
    </>
  );
}
