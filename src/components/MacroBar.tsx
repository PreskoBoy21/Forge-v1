import { Text, View } from 'react-native';

type MacroBarProps = {
  label: string;
  current: number;
  target: number;
  color: 'protein' | 'carbs' | 'fat';
};

export function MacroBar({ label, current, target, color }: MacroBarProps) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const bar =
    color === 'protein'
      ? 'bg-protein'
      : color === 'carbs'
        ? 'bg-carbs'
        : 'bg-fat';

  return (
    <View className="flex-1">
      <Text className="font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        {label}
      </Text>
      <Text
        className="mt-1 font-display text-[17px] text-bone"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {current}/{target}g
      </Text>
      <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-graphite-800">
        <View className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </View>
    </View>
  );
}
