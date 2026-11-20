import { Image } from 'expo-image';
import { View } from 'react-native';

import { Dumbbell } from '@/components/icons';
import { EXERCISE_ANIM } from '@/features/train/exerciseAnim';
import { useColors } from '@/theme/theme';

/**
 * Looping animation of one rep. `thumb` = small square next to the name,
 * `large` = top of the how-to screen. Exercises without an animation yet
 * show a neutral icon (thumb) or nothing (large).
 */
export function ExerciseDemo({
  name,
  size = 'large',
}: {
  name: string;
  size?: 'thumb' | 'large';
}) {
  const c = useColors();
  const anim = EXERCISE_ANIM[name];

  if (size === 'thumb') {
    return (
      <View
        className="h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-graphite-800"
        accessibilityLabel={`${name} animation`}
      >
        {anim ? (
          <Image
            source={anim.thumb}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            autoplay
          />
        ) : (
          <Dumbbell size={22} color={c.muted} />
        )}
      </View>
    );
  }

  if (!anim) return null;
  return (
    <View
      className="overflow-hidden rounded-card"
      accessible
      accessibilityLabel={`${name}: animation of one rep`}
    >
      <Image
        source={anim.full}
        style={{ width: '100%', aspectRatio: 1 }}
        contentFit="cover"
        autoplay
      />
    </View>
  );
}
