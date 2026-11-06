import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  Camera,
  Dumbbell,
  HeartPulse,
  type LucideIcon,
} from '@/components/icons';
import { Screen } from '@/components/Screen';
import { IconBadge } from '@/components/ui';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

const FEATURES: {
  Icon: LucideIcon;
  title: string;
  sub: string;
  tone: 'bad' | 'accent' | 'warn';
}[] = [
  {
    Icon: HeartPulse,
    title: 'Reads your body',
    sub: 'Sleep, heart rate, steps and weight from Apple Health',
    tone: 'bad',
  },
  {
    Icon: Dumbbell,
    title: 'Plans every session',
    sub: 'Exact weights, adjusted to how recovered you are',
    tone: 'accent',
  },
  {
    Icon: Camera,
    title: 'Snap your meals',
    sub: 'AI estimates calories and protein from a photo',
    tone: 'warn',
  },
];

export default function WelcomeScreen() {
  const c = useColors();
  return (
    <Screen>
      <View className="flex-1 justify-end pb-6">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-molten">
          <Text className="font-display text-[30px] italic text-graphite-950">
            F
          </Text>
        </View>
        <Text className="mt-5 font-display text-[34px] uppercase leading-10 tracking-wide text-bone">
          Your AI gym coach.
        </Text>
        <Text className="mt-3 font-ui text-[17px] leading-[24px] text-steel">
          Forge turns your health data into one clear plan for today.
        </Text>
        <Card className="mt-7 gap-4">
          {FEATURES.map((f) => (
            <View key={f.title} className="flex-row items-center">
              <IconBadge Icon={f.Icon} color={c[f.tone]} size={40} />
              <View className="ml-3 flex-1">
                <Text className="font-uiSemi text-[16px] text-bone">
                  {f.title}
                </Text>
                <Text className="font-ui text-[13px] leading-[18px] text-steel">
                  {f.sub}
                </Text>
              </View>
            </View>
          ))}
        </Card>
        <View className="mt-7 gap-3">
          <Button
            label="Get my plan"
            onPress={() => go('/(onboarding)/goal')}
          />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => go('/(auth)/sign-in?mode=signin')}
          />
        </View>
      </View>
    </Screen>
  );
}
