import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { go } from '@/lib/nav';

export default function WelcomeScreen() {
  return (
    <Screen>
      <View className="flex-1 justify-end pb-6">
        <Text className="font-uiMedium text-[13px] uppercase tracking-widest text-ember">
          Forge
        </Text>
        <Text className="mt-3 font-display text-[34px] uppercase leading-10 tracking-wide text-bone">
          Stop guessing at the gym.
        </Text>
        <Text className="mt-4 font-ui text-[17px] text-steel">
          Know what to do today. One call. Then go forge it.
        </Text>
        <View className="mt-8">
          <Card molten>
            <Text className="font-display text-[13px] uppercase tracking-widest text-molten">
              Daily Call
            </Text>
            <Text className="mt-2 font-display text-[24px] uppercase text-bone">
              Push day · 55 min
            </Text>
            <Text className="mt-1 font-ui text-[15px] text-steel">
              160g protein · Bench 4×8
            </Text>
          </Card>
        </View>
        <View className="mt-8 gap-3">
          <Button
            label="See the daily loop"
            onPress={() => go('/(tabs)/today')}
          />
          <Button
            label="Start onboarding"
            variant="secondary"
            onPress={() => go('/(onboarding)/goal')}
          />
        </View>
      </View>
    </Screen>
  );
}
