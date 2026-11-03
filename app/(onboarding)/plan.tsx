import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { saveOnboarding } from '@/features/auth/save-onboarding';
import { useSession } from '@/features/auth/session';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import {
  calcTargets,
  expectedWeeklyChangeKg,
  pickSplit,
  type PlanGoal,
} from '@/features/plan/engine';
import { go } from '@/lib/nav';

const SPLIT_LABEL = {
  full_body: 'Full body',
  upper_lower: 'Upper / Lower',
  ppl: 'Push / Pull / Legs',
} as const;

const GYM_LABEL = {
  basic_fit: 'Basic-Fit equipment',
  fit_for_free: 'Fit For Free equipment',
  home: 'Home equipment',
  other: 'Full gym',
} as const;

export default function PlanScreen() {
  const draft = useOnboardingDraft();
  const goal: PlanGoal =
    draft.goal === 'both' || !draft.goal ? 'recomp' : draft.goal;
  const age = draft.birthYear ? new Date().getFullYear() - draft.birthYear : 24;
  const targets = calcTargets({
    sex: draft.sex ?? 'male',
    age: Math.max(18, age),
    heightCm: draft.heightCm,
    weightKg: draft.weightKg,
    trainingDays: draft.trainingDays,
    goal,
  });
  const [lo, hi] = expectedWeeklyChangeKg(goal, draft.weightKg);
  const fmt = (n: number) =>
    `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}`;

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Your plan
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Built from your body, your goal and proven formulas. Your coach adjusts
        it every week.
      </Text>
      <View className="mt-8 gap-4">
        <Card molten>
          <Text className="font-display text-[13px] uppercase tracking-widest text-molten">
            Calories
          </Text>
          <Text
            className="mt-2 font-display text-[56px] text-bone"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {targets.kcal}
          </Text>
          <Text className="font-ui text-[15px] text-steel">kcal / day</Text>
          <Text className="mt-4 font-uiMedium text-[17px] text-bone">
            Protein {targets.proteinG}g · Carbs {targets.carbsG}g · Fat{' '}
            {targets.fatG}g
          </Text>
        </Card>
        <Card>
          <Text className="font-display text-[24px] uppercase text-bone">
            {SPLIT_LABEL[pickSplit(draft.trainingDays)]}
          </Text>
          <Text className="mt-2 font-ui text-[15px] text-steel">
            {draft.trainingDays} days · {GYM_LABEL[draft.gym ?? 'other']}
          </Text>
        </Card>
        <Card>
          <Text className="font-uiMedium text-[13px] uppercase tracking-wide text-steel">
            Estimated range
          </Text>
          <Text className="mt-2 font-ui text-[17px] text-bone">
            About {fmt(lo)} to {fmt(hi)} kg / week if you follow the plan.
            Estimate, not a promise.
          </Text>
        </Card>
      </View>
      <View className="mt-10">
        <Button
          label="Save my plan"
          onPress={() => {
            if (!useSession.getState().session) return go('/(auth)/sign-in');
            void saveOnboarding()
              .catch(() => undefined)
              .then(() => go('/(onboarding)/notify'));
          }}
        />
      </View>
    </Screen>
  );
}
