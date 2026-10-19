import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { mockVerdict } from '@/features/preview/mock-data';
import { go, replaceTo } from '@/lib/nav';

export default function VerdictScreen() {
  const max = Math.max(...mockVerdict.bars);

  return (
    <Screen>
      <View className="flex-row items-start justify-between">
        <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
          {mockVerdict.header}
        </Text>
        <Text className="font-uiSemi text-[13px] text-ember">
          {mockVerdict.coach}
        </Text>
      </View>

      <Text className="mt-6 font-uiMedium text-[12px] uppercase tracking-widest text-molten">
        The call
      </Text>
      <Text className="mt-2 font-display text-[56px] uppercase leading-[56px] tracking-wide text-molten">
        {mockVerdict.call}
      </Text>
      <Text className="mt-4 font-ui text-[17px] leading-6 text-bone">
        {mockVerdict.reason}
      </Text>

      <Text className="mt-8 font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        Forge score this week
      </Text>
      <View className="mt-4 h-28 flex-row items-end gap-2">
        {mockVerdict.bars.map((value, index) => (
          <View
            key={index}
            className={`flex-1 rounded-t-md ${index === 6 ? 'bg-molten' : 'bg-graphite-700'}`}
            style={{ height: 24 + (value / max) * 88 }}
          />
        ))}
      </View>

      <View className="mt-6 flex-row">
        <Stat value={mockVerdict.days} label="Days forged" />
        <Stat value={mockVerdict.avg} label="Avg score" />
        <Stat value={mockVerdict.strength} label="Est. strength" />
      </View>

      <View className="mt-auto gap-3 pb-4">
        <Button
          label="Got it, coach"
          onPress={() => replaceTo('/(tabs)/today')}
        />
        <Button
          label="Share your week"
          variant="ghost"
          onPress={() => go('/(tabs)/you/card')}
        />
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1">
      <Text
        className="font-display text-[24px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
      <Text className="mt-1 font-ui text-[12px] text-steel">{label}</Text>
    </View>
  );
}
