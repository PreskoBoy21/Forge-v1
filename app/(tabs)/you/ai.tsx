import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import {
  AI_DATA_NOT_SHARED,
  AI_DATA_SHARED,
  useConsent,
} from '@/features/consent/store';

/** You → AI coaching: see what is shared and switch it on or off. */
export default function AiCoachingScreen() {
  const ai = useConsent((s) => s.ai);
  const setAi = useConsent((s) => s.setAi);
  const on = ai === 'granted';

  return (
    <Screen scroll>
      <Text className="font-ui text-[17px] leading-[24px] text-steel">
        {on
          ? 'AI coaching is on. Your daily call and meal photo estimates are written by Anthropic’s Claude.'
          : 'AI coaching is off. Forge plans your training with built-in rules, and meal photo scan is unavailable.'}
      </Text>

      <Card className="mt-6">
        <Text className="font-uiSemi text-[15px] text-bone">
          What is sent when it’s on
        </Text>
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

      <View className="mt-8 pb-6">
        {on ? (
          <Button
            label="Turn AI coaching off"
            variant="secondary"
            onPress={() => setAi('denied')}
          />
        ) : (
          <Button label="Allow AI coaching" onPress={() => setAi('granted')} />
        )}
      </View>
    </Screen>
  );
}
