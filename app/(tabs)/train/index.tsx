import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { kgLabel } from '@/features/train/program';
import { planToday, useTrain } from '@/features/train/store';
import { go } from '@/lib/nav';

const ARROW = { increase: '↑', deload: '↓', keep: '=', first: '' } as const;

export default function TrainScreen() {
  const history = useTrain((s) => s.history);
  const active = useTrain((s) => s.active);
  const { analysis } = useAnalysis();
  const easy = analysis.readiness?.training === 'easy';
  const plan = useMemo(() => planToday(history, easy), [history, easy]);

  return (
    <Screen scroll>
      <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        Session {history.length + 1}
        {easy ? ' · easy day' : ''}
      </Text>
      <Text className="mt-1 font-display text-[34px] uppercase tracking-wide text-bone">
        {active ? active.dayName : plan.name}
      </Text>
      <Text className="mt-2 font-ui text-[15px] text-steel">
        {easy
          ? 'Under-recovered: same weights, one set less per move.'
          : 'Weights go up when you hit the top of the rep range.'}
      </Text>

      <View className="mt-6 gap-2">
        {plan.moves.map((mv) => (
          <Card key={mv.name}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-uiSemi text-[17px] text-bone">
                  {mv.name}
                </Text>
                <Text className="mt-0.5 font-ui text-[13px] text-steel">
                  {mv.sets} × {mv.repMin}–{mv.repMax}
                </Text>
              </View>
              <Text
                className={`font-uiSemi text-[15px] ${mv.reason === 'increase' ? 'text-mint' : mv.reason === 'deload' ? 'text-gold' : 'text-bone'}`}
              >
                {kgLabel(mv.targetKg)} {ARROW[mv.reason]}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      <View className="mt-6 gap-3 pb-6">
        <Button
          label={active ? 'Resume workout' : 'Start Gym Mode'}
          size="gym"
          onPress={() => {
            if (!active) useTrain.getState().start(easy);
            go('/(tabs)/train/gym');
          }}
        />
        <Pressable className="py-3" onPress={() => go('/(tabs)/train/history')}>
          <Text className="text-center font-uiMedium text-[15px] text-steel">
            History · {history.length}{' '}
            {history.length === 1 ? 'workout' : 'workouts'}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
