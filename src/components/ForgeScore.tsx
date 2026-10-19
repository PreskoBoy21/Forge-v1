import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { colors, glow } from '@/theme/tokens';

type ForgeScoreProps = {
  score: number;
  label: string;
};

export function ForgeScore({ score, label }: ForgeScoreProps) {
  return (
    <View className="items-center">
      <LinearGradient
        colors={[...colors.gradient.forge]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            height: 148,
            width: 148,
            alignItems: 'center',
            borderRadius: 74,
            justifyContent: 'center',
          },
          glow,
        ]}
      >
        <View className="h-[124px] w-[124px] items-center justify-center rounded-full bg-graphite-950">
          <Text
            className="font-display text-[56px] text-bone"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {score}
          </Text>
        </View>
      </LinearGradient>
      <Text className="mt-3 font-uiMedium text-[13px] uppercase tracking-widest text-steel">
        Forge Score
      </Text>
      <Text className="mt-1 font-uiMedium text-[17px] text-mint">{label}</Text>
    </View>
  );
}
