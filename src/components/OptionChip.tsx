import { Pressable, Text } from 'react-native';

type OptionChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionChip({ label, selected, onPress }: OptionChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`min-h-[48px] items-center justify-center rounded-2xl px-4 ${selected ? 'bg-lime' : 'bg-surface'}`}
    >
      <Text
        className={`font-bodyMedium text-base ${selected ? 'text-background' : 'text-ink'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
