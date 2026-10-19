import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { go } from '@/lib/nav';

export default function PlanScreen() {
  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Your plan
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Estimate only. Real math lands in code, not the model.
      </Text>
      <View className="mt-8 gap-4">
        <Card molten>
          <Text className="font-display text-[13px] uppercase tracking-widest text-molten">
            Calories
          </Text>
          <Text
            className="mt-2 font-display text-[56px] text-bone"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            2140
          </Text>
          <Text className="font-ui text-[15px] text-steel">kcal / day</Text>
          <Text className="mt-4 font-uiMedium text-[17px] text-bone">
            Protein 160g · Carbs 220g · Fat 70g
          </Text>
        </Card>
        <Card>
          <Text className="font-display text-[24px] uppercase text-bone">
            Upper / Lower
          </Text>
          <Text className="mt-2 font-ui text-[15px] text-steel">
            4 days · Basic-Fit equipment
          </Text>
        </Card>
        <Card>
          <Text className="font-uiMedium text-[13px] uppercase tracking-wide text-steel">
            Estimated range
          </Text>
          <Text className="mt-2 font-ui text-[17px] text-bone">
            About −0.4 to −0.7 kg / week if you follow the plan. Estimate, not a
            promise.
          </Text>
        </Card>
      </View>
      <View className="mt-10">
        <Button label="Save my plan" onPress={() => go('/(auth)/sign-in')} />
      </View>
    </Screen>
  );
}
