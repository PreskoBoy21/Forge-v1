import { Redirect, router } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { FLAGS } from '@/lib/flags';
import { Paywall } from '@/features/paywall/Paywall';
import { usePlanPrompt } from '@/features/paywall/planPrompt';

export default function YouPaywallScreen() {
  if (!FLAGS.SUBSCRIPTIONS) return <Redirect href="/(tabs)/you" />;
  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Choose your plan
      </Text>
      <Paywall
        onDone={() => {
          usePlanPrompt.getState().markSeen();
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/today');
        }}
      />
    </Screen>
  );
}
