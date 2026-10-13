import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';

export default function ScanScreen() {
  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Scan</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Point at the plate. Free accounts get 3 scans a day.
      </Text>
      <View className="mt-8 flex-1 items-center justify-center rounded-3xl bg-surface">
        <View className="h-40 w-40 rounded-full border-2 border-orange/60" />
        <Text className="mt-6 font-body text-muted">Camera preview</Text>
      </View>
      <View className="mt-6 gap-3 pb-6">
        <Button
          label="Use sample photo"
          variant="orange"
          onPress={() => router.push('/(tabs)/food/review')}
        />
        <Button
          label="Pick from library"
          variant="secondary"
          onPress={() => router.push('/(tabs)/food/review')}
        />
      </View>
    </Screen>
  );
}
