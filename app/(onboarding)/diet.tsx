import { router } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import {
  type DietPref,
  useOnboardingDraft,
} from '@/features/onboarding/draft-store';
import { colors } from '@/theme/colors';

const PREFS: { value: DietPref; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'no_pork', label: 'No pork' },
  { value: 'allergies', label: 'Allergies' },
];

export default function DietScreen() {
  const draft = useOnboardingDraft();

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Diet</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Meal ideas will respect this. No extreme diets or fasting protocols.
      </Text>
      <View className="mt-8 gap-3">
        {PREFS.map((item) => (
          <OptionChip
            key={item.value}
            label={item.label}
            selected={draft.dietPref === item.value}
            onPress={() => draft.update({ dietPref: item.value })}
          />
        ))}
      </View>
      {draft.dietPref === 'allergies' ? (
        <TextInput
          value={draft.allergies}
          onChangeText={(allergies) => draft.update({ allergies })}
          placeholder="List allergies"
          placeholderTextColor={colors.muted}
          className="mt-4 min-h-[48px] rounded-2xl bg-surface px-4 font-body text-base text-ink"
        />
      ) : null}
      <View className="mt-10">
        <Button
          label="Continue"
          onPress={() => router.push('/(onboarding)/coach-style')}
        />
      </View>
    </Screen>
  );
}
