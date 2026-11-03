import { router } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { Paywall } from '@/features/paywall/Paywall';

export default function YouPaywallScreen() {
  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Forge Pro
      </Text>
      <Paywall onDone={() => router.back()} />
    </Screen>
  );
}
