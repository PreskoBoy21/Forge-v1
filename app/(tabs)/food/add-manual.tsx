import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockFoods } from '@/features/preview/mock-data';
import { colors } from '@/theme/colors';

export default function AddManualScreen() {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const results = mockFoods.filter((food) =>
    food.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">
        Manual add
      </Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search foods"
        placeholderTextColor={colors.muted}
        className="mt-6 min-h-[48px] rounded-2xl bg-surface px-4 font-body text-base text-ink"
      />
      <View className="mt-4 gap-2">
        {results.map((food) => (
          <Pressable
            key={food.name}
            onPress={() => setPicked(food.name)}
            className={`min-h-[56px] justify-center rounded-2xl px-4 ${picked === food.name ? 'bg-lime' : 'bg-surface'}`}
          >
            <Text
              className={`font-bodySemi ${picked === food.name ? 'text-background' : 'text-ink'}`}
            >
              {food.name}
            </Text>
            <Text
              className={`font-body text-sm ${picked === food.name ? 'text-background/70' : 'text-muted'}`}
            >
              Per 100g · {food.kcal} kcal · {food.protein}g protein
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="mt-8">
        <Button
          label="Add to today"
          disabled={!picked}
          onPress={() => router.replace('/(tabs)/food')}
        />
      </View>
    </Screen>
  );
}
