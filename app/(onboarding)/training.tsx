import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionChip } from '@/components/OptionChip';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import type { Equipment, Experience } from '@/types/database';

export default function TrainingScreen() {
  const draft = useOnboardingDraft();

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Training</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Days per week, experience and equipment decide your split.
      </Text>

      <Text className="mb-2 mt-8 font-bodyMedium text-ink">Days per week</Text>
      <View className="flex-row flex-wrap gap-2">
        {[2, 3, 4, 5, 6].map((day) => (
          <OptionChip
            key={day}
            label={String(day)}
            selected={draft.trainingDays === day}
            onPress={() => draft.update({ trainingDays: day })}
          />
        ))}
      </View>

      <Text className="mb-2 mt-8 font-bodyMedium text-ink">Experience</Text>
      <View className="gap-3">
        {(['beginner', 'intermediate'] as Experience[]).map((value) => (
          <OptionChip
            key={value}
            label={value === 'beginner' ? 'Beginner' : 'Intermediate'}
            selected={draft.experience === value}
            onPress={() => draft.update({ experience: value })}
          />
        ))}
      </View>

      <Text className="mb-2 mt-8 font-bodyMedium text-ink">Equipment</Text>
      <View className="gap-3">
        {(
          [
            ['full_gym', 'Full gym'],
            ['basic_gym', 'Basic gym'],
            ['home_dumbbells', 'Home dumbbells'],
          ] as [Equipment, string][]
        ).map(([value, label]) => (
          <OptionChip
            key={value}
            label={label}
            selected={draft.equipment === value}
            onPress={() => draft.update({ equipment: value })}
          />
        ))}
      </View>

      <View className="mt-10">
        <Button
          label="Continue"
          disabled={
            !draft.trainingDays || !draft.experience || !draft.equipment
          }
          onPress={() => router.push('/(onboarding)/diet')}
        />
      </View>
    </Screen>
  );
}
