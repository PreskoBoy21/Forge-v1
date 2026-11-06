import { Text } from 'react-native';

import { Ring } from '@/components/charts';
import { useColors } from '@/theme/theme';

import type { Readiness } from '../insights';

const LABEL = {
  push: 'Go hard',
  normal: 'Steady',
  easy: 'Go easy',
} as const;

export function useReadinessColor(level: Readiness['level']) {
  const c = useColors();
  return level === 'high' ? c.accent : level === 'normal' ? c.aqua : c.warn;
}

export function ReadinessRing({
  r,
  size = 132,
}: {
  r: Readiness;
  size?: number;
}) {
  const color = useReadinessColor(r.level);
  return (
    <Ring value={r.score} size={size} stroke={size / 11} color={color}>
      <Text
        className="font-display text-bone"
        style={{ fontSize: size * 0.3, fontVariant: ['tabular-nums'] }}
      >
        {r.score}
      </Text>
      <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
        {LABEL[r.training]}
      </Text>
    </Ring>
  );
}
