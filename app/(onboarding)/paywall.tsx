import { Redirect } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { FLAGS } from '@/lib/flags';
import { Paywall } from '@/features/paywall/Paywall';
import { usePlanPrompt } from '@/features/paywall/planPrompt';
import { replaceTo } from '@/lib/nav';

export default function OnboardingPaywallScreen() {
  if (!FLAGS.SUBSCRIPTIONS) return <Redirect href="/(tabs)/today" />;
  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Choose your plan
      </Text>
      <Text className="mt-2 font-ui text-[16px] text-steel">
        Your training plan is ready. Pick how much coaching you want.
      </Text>
      <Paywall
        onDone={() => {
          usePlanPrompt.getState().markSeen();
          replaceTo('/(tabs)/today');
        }}
      />
    </Screen>
  );
}
