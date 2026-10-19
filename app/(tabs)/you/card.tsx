import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/tokens';

export default function ForgedCardScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Forged Card
      </Text>
      <View className="mt-6 overflow-hidden rounded-card">
        <LinearGradient
          colors={[...colors.gradient.forge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: 420,
            padding: 24,
            justifyContent: 'space-between',
          }}
        >
          <Text className="font-uiSemi text-[13px] uppercase tracking-widest text-graphite-950">
            Week of 14 Oct
          </Text>
          <View>
            <Text className="font-display text-[56px] uppercase leading-[56px] text-graphite-950">
              5 days
            </Text>
            <Text className="font-display text-[34px] uppercase text-graphite-950">
              Forged
            </Text>
          </View>
          <View>
            <Text className="font-uiSemi text-[17px] text-graphite-950">
              🔥 12 streak · bench +2.5 kg
            </Text>
            <Text className="mt-4 font-ui text-[13px] text-graphite-950/80">
              forged with FORGE · forge.app/u/presko
            </Text>
          </View>
        </LinearGradient>
      </View>
      <View className="mt-8">
        <Button label="Share (preview)" onPress={() => undefined} />
      </View>
    </Screen>
  );
}
