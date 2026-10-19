import { Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';

const ROWS = [
  { date: 'Mon 12 Oct', name: 'Push', detail: 'PR bench +2.5 kg' },
  { date: 'Sun 11 Oct', name: 'Rest', detail: 'Planned rest. Counts.' },
  { date: 'Sat 10 Oct', name: 'Lower', detail: 'Forged' },
];

export default function HistoryScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        History
      </Text>
      <View className="mt-6 gap-3">
        {ROWS.map((row) => (
          <Card key={row.date}>
            <Text className="font-ui text-[13px] uppercase text-steel">
              {row.date}
            </Text>
            <Text className="mt-1 font-display text-[24px] uppercase text-bone">
              {row.name}
            </Text>
            <Text className="mt-1 font-ui text-[15px] text-mint">
              {row.detail}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
