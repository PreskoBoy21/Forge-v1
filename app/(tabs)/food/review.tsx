import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockScanItems } from '@/features/preview/mock-data';

export default function ReviewScreen() {
  const [items, setItems] = useState(mockScanItems);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const factor = item.grams / 100;
        return {
          kcal: acc.kcal + item.kcalPer100g * factor,
          protein: acc.protein + item.proteinPer100g * factor,
        };
      },
      { kcal: 0, protein: 0 },
    );
  }, [items]);

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Review</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Tap + / − to change grams. Macros update from per-100g values.
      </Text>
      <Text className="mt-4 font-heading text-2xl text-ink">
        {Math.round(totals.kcal)} kcal · {Math.round(totals.protein)}g protein
      </Text>

      <View className="mt-6 gap-3">
        {items.map((item, index) => (
          <Card key={item.name}>
            <Text className="font-heading text-lg uppercase text-ink">
              {item.name}
            </Text>
            <Text className="mt-1 font-body text-sm text-muted">
              {Math.round(item.confidence * 100)}% confident
            </Text>
            <View className="mt-4 flex-row items-center justify-between">
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-2xl bg-background"
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
                <Text className="font-heading text-xl text-ink">−</Text>
              </Pressable>
              <Text className="font-heading text-2xl text-ink">
                {item.grams} g
              </Text>
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-2xl bg-background"
                onPress={() =>
                  setItems((current) =>
                    current.map((row, i) =>
                      i === index ? { ...row, grams: row.grams + 10 } : row,
                    ),
                  )
                }
              >
                <Text className="font-heading text-xl text-ink">+</Text>
              </Pressable>
            </View>
          </Card>
        ))}
      </View>

      <View className="mt-8">
        <Button
          label="Save meal"
          onPress={() => router.replace('/(tabs)/food')}
        />
      </View>
    </Screen>
  );
}
