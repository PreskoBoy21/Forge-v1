import { Redirect, router } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { FLAGS } from '@/lib/flags';
import { Paywall } from '@/features/paywall/Paywall';

export default function YouPaywallScreen() {
  if (!FLAGS.SUBSCRIPTIONS) return <Redirect href="/(tabs)/you" />;
  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Forge Pro
      </Text>
      <Paywall onDone={() => router.back()} />
    </Screen>
  );
}
