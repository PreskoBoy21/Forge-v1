import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { mockScanItems } from '@/features/preview/mock-data';
import { replaceTo } from '@/lib/nav';

export default function SnapScreen() {
  const [items, setItems] = useState(mockScanItems);

  return (
    <Screen scroll>
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => replaceTo('/(tabs)/today')}>
          <Text className="font-uiSemi text-[17px] text-steel">✕</Text>
        </Pressable>
        <Text className="font-uiMedium text-[13px] text-mint">
          Scanned in 2.1s ✓
        </Text>
      </View>

      <View className="mt-4 h-40 items-center justify-center rounded-card bg-graphite-900">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-graphite-800">
          <View className="absolute left-8 top-10 h-10 w-14 rounded-full bg-bone/80" />
          <View className="absolute right-7 top-12 h-8 w-8 rounded-full bg-mint/80" />
          <View className="absolute bottom-8 h-9 w-12 rounded-full bg-gold/90" />
        </View>
      </View>

      <View className="mt-5 flex-row items-end justify-between">
        <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
          Lunch
        </Text>
        <Text className="mb-1 font-ui text-[13px] text-steel">
          3 items · tap to estimate
        </Text>
      </View>

      <View className="mt-4 gap-2">
        {items.map((item, index) => (
          <View
            key={item.name}
            className="flex-row items-center justify-between rounded-card bg-graphite-900 px-4 py-4"
          >
            <View>
              <Text className="font-uiSemi text-[17px] text-bone">
                {item.name}
              </Text>
              <Text className="mt-1 font-ui text-[13px] text-steel">
                {item.detail}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() =>
                  setItems((current) =>
                    current.map((row, i) =>
                      i === index
                        ? { ...row, grams: Math.max(10, row.grams - 10) }
                        : row,
                    ),
                  )
                }
              >
                <Text className="font-display text-[20px] text-steel">−</Text>
              </Pressable>
              <Text
                className="min-w-[64px] text-right font-display text-[20px] text-bone"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {item.grams} g
              </Text>
              <Pressable
                onPress={() =>
                  setItems((current) =>
                    current.map((row, i) =>
                      i === index ? { ...row, grams: row.grams + 10 } : row,
                    ),
                  )
                }
              >
                <Text className="font-display text-[20px] text-steel">+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-4 rounded-card bg-graphite-800 px-4 py-3">
        <Text className="font-ui text-[15px] text-steel">
          Say it: “it was 200 grams”
        </Text>
      </View>
      <Text className="mt-3 font-ui text-[15px] text-steel">
        Total ~520 kcal · 45g protein
      </Text>

      <View className="mt-6">
        <Button label="Save meal" onPress={() => replaceTo('/(tabs)/today')} />
      </View>
    </Screen>
  );
}
