import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { CompactScore } from '@/components/CompactScore';
import { MacroBar } from '@/components/MacroBar';
import { Screen } from '@/components/Screen';
import { mockCall } from '@/features/preview/mock-data';
import { go } from '@/lib/nav';

export default function TodayScreen() {
  return (
    <Screen scroll>
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
            {mockCall.weekday}
          </Text>
          <Text className="mt-1 font-display text-[24px] uppercase tracking-wide text-bone">
            {mockCall.greeting}
          </Text>
        </View>
        <View className="rounded-full bg-graphite-800 px-3 py-2">
          <Text className="font-uiSemi text-[13px] text-ember">
            {mockCall.streak} day streak
          </Text>
        </View>
      </View>

      <View className="mt-6">
        <CompactScore
          score={mockCall.score}
          label={mockCall.scoreLabel}
          hint={mockCall.hint}
        />
      </View>

      <View className="mt-6 rounded-card border border-molten/40 bg-graphite-900 p-4">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-molten">
          Today’s call
        </Text>
        <View className="mt-3 flex-row items-end justify-between">
          <Text className="font-display text-[34px] uppercase leading-9 tracking-wide text-bone">
            {mockCall.workout}
          </Text>
          <Text className="mb-1 font-ui text-[13px] text-steel">
            {mockCall.minutes} min · {mockCall.moves} moves
          </Text>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="font-ui text-[15px] text-steel">
            {mockCall.exercise}
          </Text>
          <Text className="font-uiSemi text-[15px] text-mint">
            {mockCall.weight} ↑ {mockCall.overload}
          </Text>
        </View>
        <View className="mt-5">
          <Button
            label="Start Gym Mode"
            onPress={() => go('/(tabs)/train/gym')}
          />
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <MacroBar
          label="Protein"
          current={mockCall.protein.current}
          target={mockCall.protein.target}
          color="protein"
        />
        <MacroBar
          label="Carbs"
          current={mockCall.carbs.current}
          target={mockCall.carbs.target}
          color="carbs"
        />
        <MacroBar
          label="Fat"
          current={mockCall.fat.current}
          target={mockCall.fat.target}
          color="fat"
        />
      </View>

      <View className="mt-5 rounded-card bg-graphite-900 p-4">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
          Next meal · {mockCall.nextMeal.protein}g protein
        </Text>
        <Text className="mt-2 font-display text-[20px] uppercase tracking-wide text-bone">
          {mockCall.nextMeal.title}
        </Text>
      </View>

      <Pressable
        className="mt-6 py-3"
        onPress={() => go('/(tabs)/today/forge-day')}
      >
        <Text className="text-center font-uiMedium text-[13px] text-steel">
          Evening · Forge the day
        </Text>
      </Pressable>
    </Screen>
  );
}
