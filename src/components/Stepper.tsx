import { Pressable, Text, View } from 'react-native';

type StepperProps = {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export function Stepper({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
}: StepperProps) {
  return (
    <View>
      <Text className="mb-2 font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        {label}
      </Text>
      <View className="flex-row items-center justify-between rounded-card bg-graphite-900 px-3 py-2">
        <Pressable
          className="h-12 w-12 items-center justify-center rounded-btn bg-graphite-800"
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Text className="font-display text-[24px] text-bone">−</Text>
        </Pressable>
        <Text
          className="font-display text-[34px] text-bone"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {value}
          {unit ? (
            <Text className="font-ui text-[17px] text-steel"> {unit}</Text>
          ) : null}
        </Text>
        <Pressable
          className="h-12 w-12 items-center justify-center rounded-btn bg-graphite-800"
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Text className="font-display text-[24px] text-bone">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
