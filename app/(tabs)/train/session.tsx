import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { mockExercises } from '@/features/preview/mock-data';

const ALTERNATIVES = ['Machine chest press', 'Dumbbell bench press', 'Push-up'];

export default function SessionScreen() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [logged, setLogged] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [name, setName] = useState(mockExercises[0]?.name ?? 'Bench');
  const exercise = mockExercises[exerciseIndex] ?? mockExercises[0];

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  if (!exercise) {
    return null;
  }

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">{name}</Text>
      <Text className="mt-2 font-body text-muted">
        Set {Math.min(logged + 1, exercise.sets)} / {exercise.sets} ·{' '}
        {exercise.repMin}–{exercise.repMax} @ {exercise.weight} kg
      </Text>

      {seconds > 0 ? (
        <View className="mt-6 items-center rounded-3xl bg-surface py-8">
          <Text className="font-heading text-sm uppercase text-lime">Rest</Text>
          <Text className="mt-2 font-headingBold text-6xl text-ink">
            {seconds}s
          </Text>
        </View>
      ) : null}

      <View className="mt-6 flex-row gap-2">
        {Array.from({ length: exercise.sets }).map((_, index) => (
          <View
            key={index}
            className={`h-3 flex-1 rounded-full ${index < logged ? 'bg-lime' : 'bg-surface'}`}
          />
        ))}
      </View>

      <View className="mt-8 gap-3">
        <Button
          label={`Log ${exercise.repMax} reps @ ${exercise.weight} kg`}
          onPress={() => {
            const next = logged + 1;
            setLogged(next);
            if (next >= exercise.sets) {
              if (exerciseIndex < mockExercises.length - 1) {
                const nextIndex = exerciseIndex + 1;
                setExerciseIndex(nextIndex);
                setName(mockExercises[nextIndex]?.name ?? name);
                setLogged(0);
                setSeconds(90);
              }
            } else {
              setSeconds(90);
            }
          }}
        />
        <Button
          label="Machine taken"
          variant="secondary"
          onPress={() => setSwapping(true)}
        />
      </View>

      {swapping ? (
        <View className="mt-6 gap-2">
          <Text className="font-heading text-lg uppercase text-ink">Swap</Text>
          {ALTERNATIVES.map((option) => (
            <Pressable
              key={option}
              className="min-h-[48px] justify-center rounded-2xl bg-surface px-4"
              onPress={() => {
                setName(option);
                setSwapping(false);
              }}
            >
              <Text className="font-bodyMedium text-ink">{option}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View className="mt-6">
        <Card>
          <Text className="font-body text-sm text-muted">
            Preview only. Overload rules will bump weight next time if you hit
            the top of the range.
          </Text>
        </Card>
      </View>

      <View className="mt-4">
        <Button
          label="Finish workout"
          variant="orange"
          onPress={() => router.replace('/(tabs)/train')}
        />
      </View>
    </Screen>
  );
}
