import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { go } from '@/lib/nav';

export default function NotifyScreen() {
  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Daily Call at 07:30?
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Morning: what to do. Night: forge the day. That’s the habit.
      </Text>
      <View className="mt-auto gap-3 pb-6">
        <Button
          label="Yes, ping me"
          onPress={() => go('/(onboarding)/paywall')}
        />
        <Button
          label="Not now"
          variant="secondary"
          onPress={() => go('/(onboarding)/paywall')}
        />
      </View>
    </Screen>
  );
}
