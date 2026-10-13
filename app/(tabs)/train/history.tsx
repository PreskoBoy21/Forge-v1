import { Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockHistory } from '@/features/preview/mock-data';

export default function HistoryScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">History</Text>
      <View className="mt-6 gap-3">
        {mockHistory.map((row) => (
          <Card key={row.date}>
            <Text className="font-body text-xs uppercase text-muted">
              {row.date}
            </Text>
            <Text className="mt-1 font-heading text-xl uppercase text-ink">
              {row.name}
            </Text>
            <Text
              className={`mt-1 font-bodyMedium ${row.status === 'Done' ? 'text-lime' : 'text-muted'}`}
            >
              {row.status}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
