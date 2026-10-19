import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { previewCatalog } from '@/features/preview/catalog';
import { go } from '@/lib/nav';

export default function PreviewScreen() {
  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-molten">
        Walkthrough
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Sample data only. Tap a screen to see the product idea.
      </Text>
      {previewCatalog.map((group) => (
        <View key={group.title} className="mt-8">
          <Text className="mb-3 font-display text-[17px] uppercase tracking-wide text-bone">
            {group.title}
          </Text>
          <View className="gap-2">
            {group.links.map((link) => (
              <Pressable
                key={link.title}
                accessibilityRole="button"
                onPress={() => go(link.href)}
                className="min-h-[56px] flex-row items-center justify-between rounded-card bg-graphite-900 px-4"
              >
                <View className="flex-1 pr-3">
                  <Text className="font-uiSemi text-[17px] text-bone">
                    {link.title}
                  </Text>
                  <Text className="font-ui text-[13px] text-steel">
                    {link.hint}
                  </Text>
                </View>
                <Text className="font-display text-[13px] text-molten">GO</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
