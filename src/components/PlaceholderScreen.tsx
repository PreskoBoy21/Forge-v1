import { Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

type PlaceholderScreenProps = {
  title: string;
  body: string;
};

export function PlaceholderScreen({ title, body }: PlaceholderScreenProps) {
  return (
    <Screen>
      <Text className="font-heading text-3xl uppercase text-ink">{title}</Text>
      <Text className="mt-2 font-body text-base text-muted">{body}</Text>
      <View className="mt-6">
        <Card>
          <Text className="font-body text-sm text-muted">
            This screen is wired in navigation. Feature work lands in a later
            phase.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
