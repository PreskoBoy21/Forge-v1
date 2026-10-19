import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { replaceTo } from '@/lib/nav';

export default function YouPaywallScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Forge Pro
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Unlimited snaps, adaptive verdicts, Health sync. €9.99 / mo or €59.99 /
        yr with a 7-day trial.
      </Text>
      <View className="mt-6 gap-3">
        {[
          'Unlimited meal snaps + voice fix',
          'Weekly Verdict that actually changes the plan',
          'Crews up to 8',
          'All Forged Card templates',
        ].map((perk) => (
          <Card key={perk}>
            <Text className="font-uiMedium text-[17px] text-bone">{perk}</Text>
          </Card>
        ))}
      </View>
      <View className="mt-8">
        <Button
          label="Continue free"
          variant="secondary"
          onPress={() => replaceTo('/(tabs)/you')}
        />
      </View>
    </Screen>
  );
}
