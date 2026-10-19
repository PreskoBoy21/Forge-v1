import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { go } from '@/lib/nav';

export default function BodyScreen() {
  const draft = useOnboardingDraft();
  const year = new Date().getFullYear();
  const age = draft.birthYear ? year - draft.birthYear : 24;
  const under18 = age < 18;

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Your body
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Metric. No typing. 18+ only.
      </Text>

      <Text className="mb-2 mt-8 font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        Sex
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <OptionChip
            label="Male"
            selected={draft.sex === 'male'}
            onPress={() => draft.update({ sex: 'male' })}
          />
        </View>
        <View className="flex-1">
          <OptionChip
            label="Female"
            selected={draft.sex === 'female'}
            onPress={() => draft.update({ sex: 'female' })}
          />
        </View>
      </View>

      <View className="mt-6">
        <Stepper
          label="Age"
          value={age}
          min={18}
          max={80}
          onChange={(nextAge) =>
            draft.update({
              birthYear: year - nextAge,
              confirmed18Plus: nextAge >= 18,
            })
          }
        />
      </View>
      {under18 ? (
        <Text className="mt-2 font-ui text-[15px] text-rose">
          Under-18 accounts are blocked.
        </Text>
      ) : null}

      <View className="mt-6">
        <Stepper
          label="Height"
          value={draft.heightCm}
          unit="cm"
          min={140}
          max={220}
          onChange={(heightCm) => draft.update({ heightCm })}
        />
      </View>
      <View className="mt-6">
        <Stepper
          label="Weight"
          value={draft.weightKg}
          unit="kg"
          min={40}
          max={180}
          step={0.5}
          onChange={(weightKg) => draft.update({ weightKg })}
        />
      </View>

      <View className="mt-10">
        <Button
          label="Continue"
          disabled={!draft.sex || under18}
          onPress={() => go('/(onboarding)/training')}
        />
      </View>
    </Screen>
  );
}
