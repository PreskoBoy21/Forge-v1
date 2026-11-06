import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { X } from '@/components/icons';
import { Eyebrow } from '@/components/ui';
import { howTo } from '@/features/train/howto';
import { useColors } from '@/theme/theme';

/** Form guide for one exercise: what it works, 3 cues, 1 mistake to avoid. */
export default function HowToScreen() {
  const c = useColors();
  const { name } = useLocalSearchParams<{ name: string }>();
  const h = name ? howTo(name) : undefined;

  return (
    <SafeAreaView className="flex-1 bg-graphite-950" edges={['top', 'bottom']}>
      <ScrollView contentContainerClassName="px-4 pb-8 pt-2">
        <View className="flex-row justify-end">
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Close"
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-graphite-900"
          >
            <X size={20} color={c.muted} />
          </Pressable>
        </View>
        <Eyebrow>How to do it</Eyebrow>
        <Text className="mt-1 font-display text-[28px] uppercase leading-8 text-bone">
          {name}
        </Text>
        {h ? (
          <>
            <Text className="mt-2 font-uiMedium text-[15px] text-molten">
              Works: {h.works}
            </Text>
            <Card className="mt-5 gap-4">
              {h.steps.map((s, i) => (
                <View key={i} className="flex-row">
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-molten">
                    <Text className="font-uiSemi text-[14px] text-graphite-950">
                      {i + 1}
                    </Text>
                  </View>
                  <Text className="ml-3 flex-1 font-ui text-[16px] leading-[23px] text-bone">
                    {s}
                  </Text>
                </View>
              ))}
            </Card>
            <Card className="mt-3">
              <Text className="font-uiSemi text-[14px] text-gold">Avoid</Text>
              <Text className="mt-1 font-ui text-[15px] leading-[22px] text-bone">
                {h.avoid}
              </Text>
            </Card>
            <Text className="mt-4 font-ui text-[12px] leading-[18px] text-steel">
              Start light and own the movement before adding weight. Stop if
              something hurts (not just burns).
            </Text>
          </>
        ) : (
          <Text className="mt-3 font-ui text-[15px] text-steel">
            No guide for this exercise yet.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
