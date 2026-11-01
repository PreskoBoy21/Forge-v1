import { Text, View } from 'react-native';

import type { Insight } from '../insights';

const DOT = {
  good: 'bg-mint',
  warn: 'bg-gold',
  bad: 'bg-rose',
  info: 'bg-ember',
} as const;

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <View className="flex-row rounded-card bg-graphite-900 p-4">
      <View
        className={`mt-1.5 h-2.5 w-2.5 rounded-full ${DOT[insight.tone]}`}
      />
      <View className="ml-3 flex-1">
        <Text className="font-uiSemi text-[17px] text-bone">
          {insight.title}
        </Text>
        <Text className="mt-1 font-ui text-[15px] leading-[21px] text-steel">
          {insight.body}
        </Text>
        {insight.action ? (
          <Text className="mt-2 font-uiMedium text-[13px] text-molten">
            → {insight.action}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
