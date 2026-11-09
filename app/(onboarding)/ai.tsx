import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Sparkles } from '@/components/icons';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { IconBadge } from '@/components/ui';
import {
  AI_DATA_NOT_SHARED,
  AI_DATA_SHARED,
  useConsent,
} from '@/features/consent/store';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

/** Onboarding: ask before any data goes to the AI provider (5.1.2(i)). */
export default function AiConsentScreen() {
  const c = useColors();
  const setAi = useConsent((s) => s.setAi);
  const next = (v: 'granted' | 'denied') => {
    setAi(v);
    go('/(onboarding)/forging');
  };

  return (
    <Screen scroll>
      <PreviewBanner />
      <IconBadge Icon={Sparkles} color={c.accent} size={48} />
      <Text className="mt-4 font-display text-[34px] uppercase tracking-wide text-bone">
        Your AI coach
      </Text>
      <Text className="mt-2 font-ui text-[17px] leading-[24px] text-steel">
        To write your daily call and estimate meal photos, Forge sends some of
        your data to its AI provider, Anthropic (Claude).
      </Text>

      <Card className="mt-6">
        <Text className="font-uiSemi text-[15px] text-bone">What is sent</Text>
        <View className="mt-2 gap-2">
          {AI_DATA_SHARED.map((line) => (
            <Text
              key={line}
              className="font-ui text-[14px] leading-[20px] text-steel"
            >
              • {line}
            </Text>
          ))}
        </View>
        <Text className="mt-3 font-ui text-[14px] leading-[20px] text-bone">
          {AI_DATA_NOT_SHARED}
        </Text>
      </Card>

      <Text className="mt-4 font-ui text-[13px] leading-[19px] text-steel">
        You can change this any time in You → AI coaching. Without it, Forge
        still plans your training with built-in rules.
      </Text>

      <View className="mt-8 gap-3 pb-6">
        <Button label="Allow AI coaching" onPress={() => next('granted')} />
        <Button
          label="Not now"
          variant="ghost"
          onPress={() => next('denied')}
        />
      </View>
    </Screen>
  );
}
