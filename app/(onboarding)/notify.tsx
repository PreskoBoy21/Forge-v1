import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Bell } from '@/components/icons';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { IconBadge } from '@/components/ui';
import { enableReminder } from '@/features/notify/reminders';
import { FLAGS } from '@/lib/flags';
import { go, replaceTo } from '@/lib/nav';
import { useColors } from '@/theme/theme';

const next = () =>
  FLAGS.SUBSCRIPTIONS
    ? go('/(onboarding)/paywall')
    : replaceTo('/(tabs)/today');

export default function NotifyScreen() {
  const c = useColors();
  const [busy, setBusy] = useState(false);
  return (
    <Screen>
      <PreviewBanner />
      <IconBadge Icon={Bell} color={c.accent} size={52} />
      <Text className="mt-5 font-display text-[34px] uppercase tracking-wide text-bone">
        Daily reminder at 07:30?
      </Text>
      <Text className="mt-2 font-ui text-[17px] leading-[24px] text-steel">
        One short ping each morning with your plan for the day. You can change
        the time or turn it off in You → Settings.
      </Text>
      <View className="mt-auto gap-3 pb-6">
        <Button
          label={busy ? 'One sec…' : 'Yes, remind me'}
          disabled={busy}
          onPress={async () => {
            setBusy(true);
            await enableReminder(7, 30);
            setBusy(false);
            next();
          }}
        />
        <Button label="Not now" variant="secondary" onPress={next} />
      </View>
    </Screen>
  );
}
