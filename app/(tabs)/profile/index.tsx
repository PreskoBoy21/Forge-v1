import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';

const ROWS = [
  { label: 'Goal', value: 'Lose fat' },
  { label: 'Coach', value: 'Buddy' },
  { label: 'Training days', value: '4 / week' },
  { label: 'Health sync', value: 'Off · Pro' },
];

export default function ProfileScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Profile</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Preslav · Free
      </Text>

      <View className="mt-6 gap-3">
        {ROWS.map((row) => (
          <Card key={row.label}>
            <Text className="font-body text-xs uppercase text-muted">
              {row.label}
            </Text>
            <Text className="mt-1 font-heading text-xl uppercase text-ink">
              {row.value}
            </Text>
          </Card>
        ))}
      </View>

      <View className="mt-6">
        <Card>
          <Text className="font-body text-sm text-muted">
            Not medical advice — consult a doctor for health conditions.
          </Text>
        </Card>
      </View>

      <View className="mt-6 gap-3">
        <Button
          label="Forge Pro"
          onPress={() => router.push('/(tabs)/profile/paywall')}
        />
        <Button
          label="All screens"
          variant="secondary"
          onPress={() => router.push('/preview')}
        />
        <Pressable onPress={() => router.replace('/(auth)/welcome')}>
          <Text className="py-3 text-center font-bodyMedium text-muted">
            Back to welcome
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
