import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ForgedStamp } from '@/components/ForgedStamp';
import { Screen } from '@/components/Screen';
import { mockForgeDay } from '@/features/preview/mock-data';
import { go, replaceTo } from '@/lib/nav';
import { colors } from '@/theme/tokens';

export default function ForgeDayScreen() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const ticks = setInterval(() => {
      setScore((value) => {
        if (value >= mockForgeDay.score) {
          clearInterval(ticks);
          return mockForgeDay.score;
        }
        return value + 3;
      });
    }, 30);
    return () => clearInterval(ticks);
  }, []);

  return (
    <Screen>
      <Text className="text-center font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        {mockForgeDay.when}
      </Text>

      <View className="mt-8 items-center">
        <LinearGradient
          colors={[...colors.gradient.forge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 168,
            width: 168,
            alignItems: 'center',
            borderRadius: 84,
            justifyContent: 'center',
          }}
        >
          <View className="h-[148px] w-[148px] items-center justify-center rounded-full bg-graphite-950">
            <Text
              className="font-display text-[56px] text-bone"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {score}
            </Text>
            <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
              Forge score
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View className="mt-8">
        <ForgedStamp />
      </View>
      <Text className="mt-4 text-center font-uiSemi text-[15px] text-ember">
        🔥 {mockForgeDay.streak}-day streak
      </Text>

      <View className="mt-8 gap-3">
        {mockForgeDay.rows.map((row) => (
          <View key={row.label} className="flex-row justify-between">
            <Text className="font-ui text-[15px] text-steel">{row.label}</Text>
            <Text
              className="font-uiSemi text-[15px] text-mint"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
      <Text className="mt-6 font-ui text-[13px] text-steel">
        {mockForgeDay.footer}
      </Text>

      <View className="mt-auto flex-row gap-3 pb-4">
        <View className="flex-1">
          <Button
            label="Share card"
            variant="secondary"
            onPress={() => go('/(tabs)/you/card')}
          />
        </View>
        <View className="flex-1">
          <Button label="Done" onPress={() => replaceTo('/(tabs)/today')} />
        </View>
      </View>
    </Screen>
  );
}
