import { Pressable, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'orange';
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const background =
    variant === 'primary'
      ? 'bg-lime'
      : variant === 'orange'
        ? 'bg-orange'
        : 'bg-surface';
  const textColor = variant === 'secondary' ? 'text-ink' : 'text-background';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[48px] items-center justify-center rounded-2xl px-5 ${background} ${disabled ? 'opacity-40' : 'active:opacity-80'}`}
    >
      <Text className={`font-bodySemi text-base ${textColor}`}>{label}</Text>
    </Pressable>
  );
}
