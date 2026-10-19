import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import {
  type CoachPersona,
  useOnboardingDraft,
} from '@/features/onboarding/draft-store';
import { go } from '@/lib/nav';

const LINES: Record<CoachPersona, string> = {
  buddy: 'We’ll keep it simple. Push day, then we eat.',
  sergeant: 'Bench went up. Excuses didn’t. Good.',
  scientist: 'Protein at 1.8 g/kg. That’s the number. Here’s why it matters.',
};

export default function CoachScreen() {
  const coach = useOnboardingDraft((s) => s.coach);
  const update = useOnboardingDraft((s) => s.update);

  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Your coach
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Hear a sample. Sergeant never insults. Scientist cites the number.
      </Text>
      <View className="mt-8 gap-3">
        <OptionChip
          label="Buddy"
          hint="Warm, short"
          selected={coach === 'buddy'}
          onPress={() => update({ coach: 'buddy' })}
        />
        <OptionChip
          label="Sergeant"
          hint="Direct. Never cruel."
          selected={coach === 'sergeant'}
          onPress={() => update({ coach: 'sergeant' })}
        />
        <OptionChip
          label="Scientist"
          hint="Numbers + why"
          selected={coach === 'scientist'}
          onPress={() => update({ coach: 'scientist' })}
        />
      </View>
      <View className="mt-6">
        <Card>
          <Text className="font-ui text-[17px] italic text-bone">
            “{LINES[coach]}”
          </Text>
        </Card>
      </View>
      <View className="mt-auto pb-6">
        <Button
          label="Forge my plan"
          onPress={() => go('/(onboarding)/forging')}
        />
      </View>
    </Screen>
  );
}
