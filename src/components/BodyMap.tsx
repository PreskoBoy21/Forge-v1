import { Text, View } from 'react-native';
import Body from 'react-native-body-highlighter';

import { MUSCLE_LABEL, type MuscleSlug } from '@/features/train/muscles';
import { useColors, useScheme } from '@/theme/theme';

type Part = Parameters<typeof Body>[0]['data'][number];

/** Mix the accent with the card colour: t = 0 → card, 1 → accent. */
function mix(a: string, b: string, t: number) {
  const p = (h: string) =>
    [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x
    .map((v, i) =>
      Math.round(v + (y[i]! - v) * t)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/**
 * Front + back anatomy with worked muscles in orange.
 * - `primary` / `secondary`: one exercise (bright / dark orange)
 * - `sets`: weekly heat map (more sets → brighter)
 */
export function BodyMap({
  primary = [],
  secondary = [],
  sets,
  scale = 0.6,
  legend = true,
}: {
  primary?: MuscleSlug[];
  secondary?: MuscleSlug[];
  sets?: Partial<Record<MuscleSlug, number>>;
  scale?: number;
  legend?: boolean;
}) {
  const c = useColors();
  const dark = useScheme() === 'dark';
  const base = dark ? '#2A2A2A' : '#D6D6D6';
  const second = mix(base, c.accent, 0.45);
  const skin = dark ? '#3A3A3A' : '#C4C4C4';

  const data: Part[] = [
    { slug: 'head', color: skin },
    { slug: 'hair', color: skin },
    { slug: 'hands', color: skin },
    { slug: 'feet', color: skin },
  ];
  if (sets) {
    for (const [slug, n] of Object.entries(sets)) {
      if (!n) continue;
      // 1 set ≈ faint, 10+ hard sets = full orange
      data.push({
        slug: slug as Part['slug'],
        color: mix(base, c.accent, Math.min(1, 0.3 + n / 14)),
      });
    }
  } else {
    secondary.forEach((slug) => data.push({ slug, color: second }));
    primary.forEach((slug) => data.push({ slug, color: c.accent }));
  }

  return (
    <View>
      <View
        className="flex-row justify-center"
        accessible
        accessibilityLabel={
          sets
            ? `Muscles trained this week: ${
                Object.keys(sets)
                  .map((s) => MUSCLE_LABEL[s as MuscleSlug] ?? s)
                  .join(', ') || 'none yet'
              }`
            : `Works ${primary.map((s) => MUSCLE_LABEL[s]).join(', ')}`
        }
      >
        <Body
          data={data}
          side="front"
          scale={scale}
          border="none"
          defaultFill={base}
        />
        <Body
          data={data}
          side="back"
          scale={scale}
          border="none"
          defaultFill={base}
        />
      </View>
      {legend && !sets && primary.length ? (
        <View className="mt-3 gap-1.5">
          <View className="flex-row flex-wrap items-center gap-1.5">
            {primary.map((s) => (
              <View key={s} className="rounded-full bg-molten px-3 py-1">
                <Text
                  className="font-uiSemi text-[12px]"
                  style={{ color: '#000' }}
                >
                  {MUSCLE_LABEL[s]}
                </Text>
              </View>
            ))}
            {secondary.map((s) => (
              <View
                key={s}
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: second }}
              >
                <Text
                  className="font-uiSemi text-[12px]"
                  style={{ color: dark ? '#fff' : '#000' }}
                >
                  {MUSCLE_LABEL[s]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}
