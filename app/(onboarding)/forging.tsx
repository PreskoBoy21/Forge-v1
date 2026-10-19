import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { replaceTo } from '@/lib/nav';

const STEPS = [
  'Reading your training days…',
  'Setting calorie floors…',
  'Forging your Daily Call…',
];

export default function ForgingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => current + 1);
    }, 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (index >= STEPS.length) {
      replaceTo('/(onboarding)/plan');
    }
  }, [index]);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="font-display text-[34px] uppercase tracking-wide text-molten">
          Forging your plan
        </Text>
        <Text className="mt-6 font-ui text-[17px] text-steel">
          {STEPS[Math.min(index, STEPS.length - 1)]}
        </Text>
      </View>
    </Screen>
  );
}
