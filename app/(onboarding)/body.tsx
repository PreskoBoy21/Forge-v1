import { router } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { colors } from '@/theme/colors';

export default function BodyScreen() {
  const draft = useOnboardingDraft();
  const currentYear = new Date().getFullYear();
  const age = draft.birthYear ? currentYear - draft.birthYear : null;
  const under18 = age !== null && age < 18;

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">
        Your body
      </Text>
      <Text className="mt-2 font-body text-base text-muted">
        Used to calculate calories with Mifflin–St Jeor. Never sent to the AI as
        a target to invent.
      </Text>

      <Text className="mb-2 mt-8 font-bodyMedium text-ink">Sex</Text>
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

      <Field
        label="Birth year"
        keyboard="number-pad"
        value={draft.birthYear?.toString() ?? ''}
        onChange={(value) =>
          draft.update({ birthYear: value ? Number(value) : null })
        }
      />
      {under18 ? (
        <Text className="mt-2 font-body text-sm text-orange">
          Under-18 users are blocked.
        </Text>
      ) : null}
      <Field
        label="Height (cm)"
        keyboard="decimal-pad"
        value={draft.heightCm?.toString() ?? ''}
        onChange={(value) =>
          draft.update({ heightCm: value ? Number(value) : null })
        }
      />
      <Field
        label="Weight (kg)"
        keyboard="decimal-pad"
        value={draft.weightKg?.toString() ?? ''}
        onChange={(value) =>
          draft.update({ weightKg: value ? Number(value) : null })
        }
      />

      <View className="mt-10">
        <Button
          label="Continue"
          disabled={
            !draft.sex ||
            !draft.birthYear ||
            !draft.heightCm ||
            !draft.weightKg ||
            under18
          }
          onPress={() => router.push('/(onboarding)/goal')}
        />
      </View>
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboard,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboard: 'number-pad' | 'decimal-pad';
}) {
  return (
    <View className="mt-5">
      <Text className="mb-2 font-bodyMedium text-ink">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        placeholderTextColor={colors.muted}
        className="min-h-[48px] rounded-2xl bg-surface px-4 font-body text-base text-ink"
      />
    </View>
  );
}
