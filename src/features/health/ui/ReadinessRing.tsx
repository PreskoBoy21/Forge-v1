import { Text, View } from 'react-native';

import type { Readiness } from '../insights';

const COLOR = { high: '#C6F24E', normal: '#47D7E8', low: '#FFC542' } as const;
const LABEL = {
  push: 'Go hard',
  normal: 'Steady',
  easy: 'Go easy',
} as const;

/** Segmented ring (40 ticks) — pure Views, no SVG dependency. */
export function ReadinessRing({
  r,
  size = 132,
}: {
  r: Readiness;
  size?: number;
}) {
  const ticks = 40;
  const on = Math.round((r.score / 100) * ticks);
  const radius = size / 2 - 6;
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      {Array.from({ length: ticks }, (_, i) => {
        const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 10,
              borderRadius: 2,
              left: size / 2 - 2 + Math.cos(a) * radius,
              top: size / 2 - 5 + Math.sin(a) * radius,
              transform: [{ rotate: `${(a * 180) / Math.PI + 90}deg` }],
              backgroundColor: i < on ? COLOR[r.level] : '#282D38',
            }}
          />
        );
      })}
      <Text
        className="font-display text-[40px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {r.score}
      </Text>
      <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
        {LABEL[r.training]}
      </Text>
    </View>
  );
}
