import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams } from 'expo-router';
import { type ComponentRef, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ChevronRight, X } from '@/components/icons';
import { SOURCE_GROUPS } from '@/features/sources/sources';
import { goBack } from '@/lib/nav';
import { useColors } from '@/theme/theme';

/** Sources & methods: every formula Forge uses, with links to the research. */
export default function SourcesScreen() {
  const c = useColors();
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  return (
    <SafeAreaView
      className="flex-1 bg-graphite-950"
      edges={['top', 'left', 'right']}
    >
      <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
        <Text className="font-display text-[28px] uppercase tracking-wide text-bone">
          Sources
        </Text>
        <Pressable
          accessibilityLabel="Close"
          hitSlop={12}
          onPress={goBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-graphite-900"
        >
          <X size={18} color={c.text} />
        </Pressable>
      </View>
      <ScrollView
        ref={scroll}
        className="flex-1"
        contentContainerClassName="px-4 pb-10"
      >
        <Text className="font-ui text-[15px] leading-[22px] text-steel">
          How Forge calculates your targets, and the research behind each
          number. Tap a source to read it.
        </Text>
        {SOURCE_GROUPS.map((g) => (
          <View
            key={g.id}
            className="mt-6"
            onLayout={(e) => {
              if (topic === g.id)
                scroll.current?.scrollTo({
                  y: e.nativeEvent.layout.y - 8,
                  animated: false,
                });
            }}
          >
            <Text
              className={`font-display text-[18px] uppercase tracking-wide ${topic === g.id ? 'text-molten' : 'text-bone'}`}
            >
              {g.title}
            </Text>
            <Text className="mt-1.5 font-ui text-[14px] leading-[21px] text-steel">
              {g.what}
            </Text>
            <Card className="mt-3 py-1">
              {g.sources.map((s, i) => (
                <Pressable
                  key={s.url}
                  accessibilityRole="link"
                  onPress={() => void WebBrowser.openBrowserAsync(s.url)}
                  className={`flex-row items-center py-3 ${i < g.sources.length - 1 ? 'border-b border-graphite-700/60' : ''}`}
                >
                  <View className="flex-1 pr-2">
                    <Text className="font-uiMedium text-[15px] leading-[20px] text-bone">
                      {s.title}
                    </Text>
                    <Text className="mt-0.5 font-ui text-[12px] text-steel">
                      {s.by}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={c.muted} />
                </Pressable>
              ))}
            </Card>
          </View>
        ))}
        <Text className="mt-8 font-ui text-[12px] leading-[18px] text-steel">
          Forge gives general fitness and nutrition guidance, not medical
          advice. Talk to a doctor or dietitian before big changes, especially
          if you have a health condition, are pregnant or under 18.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
