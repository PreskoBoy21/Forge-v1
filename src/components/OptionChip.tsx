import { Pressable, Text } from 'react-native';

type OptionChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  hint?: string;
};

export function OptionChip({
  label,
  selected,
  onPress,
  hint,
}: OptionChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`min-h-[56px] justify-center rounded-card px-4 ${selected ? 'bg-molten' : 'bg-graphite-900'}`}
    >
      <Text
        className={`font-uiSemi text-[17px] ${selected ? 'text-graphite-950' : 'text-bone'}`}
      >
        {label}
      </Text>
      {hint ? (
        <Text
          className={`mt-1 font-ui text-[13px] ${selected ? 'text-graphite-950/70' : 'text-steel'}`}
        >
          {hint}
        </Text>
      ) : null}
    </Pressable>
  );
}
