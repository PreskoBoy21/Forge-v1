import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { go } from '@/lib/nav';

export default function YouScreen() {
  return (
    <Screen scroll>
      <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        You · Sergeant · Free
      </Text>
      <Text className="mt-1 font-display text-[34px] uppercase tracking-wide text-bone">
        Sam
      </Text>

      <Pressable
        onPress={() => go('/(tabs)/you/verdict')}
        className="mt-6 rounded-card border border-molten/40 bg-graphite-900 p-4"
      >
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-molten">
          Sunday · week 3
        </Text>
        <Text className="mt-2 font-display text-[24px] uppercase text-bone">
          Weekly Verdict
        </Text>
        <Text className="mt-1 font-ui text-[15px] text-steel">
          The coach made a call. Open it.
        </Text>
      </Pressable>

      <Pressable
        onPress={() => go('/(tabs)/you/card')}
        className="mt-3 rounded-card bg-graphite-900 p-4"
      >
        <Text className="font-display text-[20px] uppercase text-bone">
          Forged Card
        </Text>
        <Text className="mt-1 font-ui text-[15px] text-steel">
          5 days forged · ready to share
        </Text>
      </Pressable>

      <View className="mt-3 rounded-card bg-graphite-900 p-4">
        <Text className="font-ui text-[13px] uppercase text-steel">PR</Text>
        <Text className="mt-1 font-display text-[24px] uppercase text-gold">
          Bench 62.5 × 8
        </Text>
      </View>

      <Pressable
        onPress={() => go('/(tabs)/you/paywall')}
        className="mt-3 rounded-card bg-graphite-900 p-4"
      >
        <Text className="font-uiSemi text-[15px] text-ember">Forge Pro</Text>
        <Text className="mt-1 font-ui text-[13px] text-steel">
          Adaptive verdicts · unlimited snaps
        </Text>
      </Pressable>

      <Text className="mt-8 font-ui text-[13px] text-steel">
        Not medical advice — talk to a doctor for health conditions.
      </Text>
    </Screen>
  );
}
