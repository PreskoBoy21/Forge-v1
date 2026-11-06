import { Redirect } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { FLAGS } from '@/lib/flags';
import { Paywall } from '@/features/paywall/Paywall';
import { replaceTo } from '@/lib/nav';

export default function OnboardingPaywallScreen() {
  if (!FLAGS.SUBSCRIPTIONS) return <Redirect href="/(tabs)/today" />;
  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Forge Pro
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Your plan is ready and free. Pro adds the parts that need AI.
      </Text>
      <Paywall onDone={() => replaceTo('/(tabs)/today')} />
    </Screen>
  );
}
