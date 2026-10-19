import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

type CompactScoreProps = {
  score: number;
  label: string;
  hint: string;
};

export function CompactScore({ score, label, hint }: CompactScoreProps) {
  return (
    <View className="flex-row items-center">
      <LinearGradient
        colors={[...colors.gradient.forge]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 84,
          width: 84,
          alignItems: 'center',
          borderRadius: 42,
          justifyContent: 'center',
        }}
      >
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-graphite-950">
          <Text
            className="font-display text-[34px] text-bone"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {score}
          </Text>
        </View>
      </LinearGradient>
      <View className="ml-4 flex-1">
        <Text className="font-uiMedium text-[13px] uppercase tracking-widest text-steel">
          Forge score
        </Text>
        <Text className="mt-1 font-uiSemi text-[17px] text-mint">{label}</Text>
        <Text className="mt-1 font-ui text-[13px] leading-[18px] text-steel">
          {hint}
        </Text>
      </View>
    </View>
  );
}
