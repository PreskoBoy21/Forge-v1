import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { colors } from '@/theme/tokens';
import { go } from '@/lib/nav';

export default function FoodScreen() {
  const draft = useOnboardingDraft();

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Food
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Preferences help meal ideas. We never push extreme diets.
      </Text>
      <Text className="mb-2 mt-8 font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        How do you eat?
      </Text>
      <TextInput
        value={draft.dietNotes}
        onChangeText={(dietNotes) => draft.update({ dietNotes })}
        placeholder="None / vegetarian / no pork / allergies…"
        placeholderTextColor={colors.steel[400]}
        className="min-h-[56px] rounded-card bg-graphite-800 px-4 font-ui text-[17px] text-bone"
      />
      <Text className="mb-2 mt-8 font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        What do you hate eating?
      </Text>
      <TextInput
        value={draft.hateEating}
        onChangeText={(hateEating) => draft.update({ hateEating })}
        placeholder="Cottage cheese, tuna, dry chicken…"
        placeholderTextColor={colors.steel[400]}
        className="min-h-[56px] rounded-card bg-graphite-800 px-4 font-ui text-[17px] text-bone"
      />
      <View className="mt-10">
        <Button label="Continue" onPress={() => go('/(onboarding)/coach')} />
      </View>
    </Screen>
  );
}
