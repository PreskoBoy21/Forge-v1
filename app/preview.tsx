import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { previewCatalog } from '@/features/preview/catalog';

export default function PreviewScreen() {
  return (
    <Screen scroll>
      <Text className="font-headingBold text-4xl uppercase text-lime">
        Walkthrough
      </Text>
      <Text className="mt-2 font-body text-base text-muted">
        Nothing is connected yet. Tap any screen to see the idea with sample
        data.
      </Text>

      {previewCatalog.map((group) => (
        <View key={group.title} className="mt-8">
          <Text className="mb-3 font-heading text-lg uppercase text-ink">
            {group.title}
          </Text>
          <View className="gap-2">
            {group.links.map((link) => (
              <Pressable
                key={link.title}
                accessibilityRole="button"
                onPress={() => router.push(link.href)}
                className="min-h-[56px] flex-row items-center justify-between rounded-2xl bg-surface px-4"
              >
                <View className="flex-1 pr-3">
                  <Text className="font-bodySemi text-base text-ink">
                    {link.title}
                  </Text>
                  <Text className="font-body text-sm text-muted">
                    {link.hint}
                  </Text>
                </View>
                <Text className="font-heading text-lime">GO</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
