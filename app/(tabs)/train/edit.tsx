import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ArrowLeftRight, Minus, Plus, RotateCcw } from '@/components/icons';
import { Screen } from '@/components/Screen';
import { Eyebrow, Pill } from '@/components/ui';
import { saveOnboarding } from '@/features/auth/save-onboarding';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { pickSplit } from '@/features/plan/engine';
import {
  adaptToEquipment,
  applyOverrides,
  swapsFor,
  TEMPLATES,
  type EquipmentAccess,
} from '@/features/train/program';
import { useTrain } from '@/features/train/store';
import { useColors } from '@/theme/theme';

const SPLIT_LABEL = {
  full_body: 'Full body',
  upper_lower: 'Upper / lower',
  ppl: 'Push / pull / legs',
} as const;

/** Edit plan: training days per week + swap any exercise for good. */
export default function EditPlanScreen() {
  const c = useColors();
  const draft = useOnboardingDraft();
  const overrides = useTrain((s) => s.overrides);
  const setOverride = useTrain((s) => s.setOverride);
  const [open, setOpen] = useState<string | null>(null);

  const split = pickSplit(draft.trainingDays);
  const access: EquipmentAccess =
    draft.gym === 'home' ? 'home_dumbbells' : 'full_gym';
  const days = TEMPLATES[split].map((d) => ({
    base: adaptToEquipment(d, access),
    shown: applyOverrides(adaptToEquipment(d, access), overrides),
  }));

  const setDays = (n: number) => {
    const v = Math.max(2, Math.min(6, n));
    if (v === draft.trainingDays) return;
    draft.update({ trainingDays: v });
    void saveOnboarding().catch(() => undefined);
  };

  return (
    <Screen scroll>
      <Eyebrow>Your plan</Eyebrow>
      <Text className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone">
        Edit plan
      </Text>

      <Card className="mt-5">
        <Text className="font-uiSemi text-[16px] text-bone">
          Training days per week
        </Text>
        <View className="mt-3 flex-row items-center">
          <Pressable
            onPress={() => setDays(draft.trainingDays - 1)}
            accessibilityLabel="Fewer days"
            className="h-11 w-11 items-center justify-center rounded-full bg-graphite-800"
          >
            <Minus size={20} color={c.text} />
          </Pressable>
          <Text className="mx-6 font-display text-[32px] text-bone">
            {draft.trainingDays}
          </Text>
          <Pressable
            onPress={() => setDays(draft.trainingDays + 1)}
            accessibilityLabel="More days"
            className="h-11 w-11 items-center justify-center rounded-full bg-graphite-800"
          >
            <Plus size={20} color={c.text} />
          </Pressable>
          <Text className="ml-4 flex-1 font-ui text-[14px] text-steel">
            {SPLIT_LABEL[split]}
          </Text>
        </View>
      </Card>

      <Text className="mb-1 mt-7 font-ui text-[14px] leading-[20px] text-steel">
        Tap an exercise to swap it. Your choice sticks for every future workout.
        Weights carry on from your history for that exercise.
      </Text>

      {days.map(({ base, shown }) => (
        <Card key={base.name} className="mt-3">
          <Text className="font-display text-[20px] uppercase text-bone">
            {base.name}
          </Text>
          {shown.moves.map((mv, i) => {
            const key = `${base.name}:${i}`;
            const original = base.moves[i]!.name;
            const changed = mv.name !== original;
            const isOpen = open === key;
            const options = [
              original,
              ...swapsFor(original, access, 6).map((e) => e.name),
            ];
            return (
              <View
                key={key}
                className={i ? 'border-t border-graphite-700/60' : ''}
              >
                <Pressable
                  onPress={() => setOpen(isOpen ? null : key)}
                  className="flex-row items-center py-3"
                >
                  <View className="flex-1">
                    <Text className="font-uiMedium text-[15px] text-bone">
                      {mv.name}
                    </Text>
                    <Text className="font-ui text-[12px] text-steel">
                      {mv.sets} × {mv.repMin}–{mv.repMax}
                      {changed ? ' · swapped' : ''}
                    </Text>
                  </View>
                  <ArrowLeftRight
                    size={18}
                    color={isOpen ? c.accent : c.muted}
                  />
                </Pressable>
                {isOpen ? (
                  <View className="mb-3 flex-row flex-wrap gap-2">
                    {options.map((name) => (
                      <Pill
                        key={name}
                        label={name}
                        active={name === mv.name}
                        onPress={() => {
                          setOverride(
                            base.name,
                            i,
                            name === original ? null : name,
                          );
                          setOpen(null);
                        }}
                      />
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </Card>
      ))}

      {Object.values(overrides).some((o) => Object.keys(o).length) ? (
        <Pressable
          onPress={() => useTrain.setState({ overrides: {} })}
          className="mb-6 mt-5 flex-row items-center justify-center py-3"
        >
          <RotateCcw size={16} color={c.muted} />
          <Text className="ml-2 font-uiMedium text-[14px] text-steel">
            Reset all swaps
          </Text>
        </Pressable>
      ) : (
        <View className="h-6" />
      )}
    </Screen>
  );
}
