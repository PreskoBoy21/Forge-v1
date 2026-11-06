import { Text, View } from 'react-native';

import { Card } from '@/components/Card';
import {
  Info,
  TrendingDown,
  TrendingUp,
  Zap,
  type LucideIcon,
} from '@/components/icons';
import { IconBadge } from '@/components/ui';
import { useColors } from '@/theme/theme';

import type { Insight } from '../insights';

const ICON: Record<Insight['tone'], LucideIcon> = {
  good: TrendingUp,
  warn: Zap,
  bad: TrendingDown,
  info: Info,
};

export function InsightCard({ insight }: { insight: Insight }) {
  const c = useColors();
  const color = {
    good: c.good,
    warn: c.warn,
    bad: c.bad,
    info: c.aqua,
  }[insight.tone];
  return (
    <Card>
      <View className="flex-row">
        <IconBadge Icon={ICON[insight.tone]} color={color} />
        <View className="ml-3 flex-1">
          <Text className="font-uiSemi text-[16px] text-bone">
            {insight.title}
          </Text>
          <Text className="mt-1 font-ui text-[14px] leading-[20px] text-steel">
            {insight.body}
          </Text>
          {insight.action ? (
            <Text className="mt-2 font-uiMedium text-[13px] text-molten">
              → {insight.action}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
