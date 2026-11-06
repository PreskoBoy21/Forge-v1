import { Pressable, Text, View } from 'react-native';

import type { LucideIcon } from '@/components/icons';
import { useColors } from '@/theme/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'gym';
  disabled?: boolean;
  icon?: LucideIcon;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  icon: Icon,
}: ButtonProps) {
  const c = useColors();
  const background =
    variant === 'primary'
      ? 'bg-molten'
      : variant === 'secondary'
        ? 'bg-graphite-800'
        : 'bg-transparent';
  const textColor = variant === 'primary' ? 'text-graphite-950' : 'text-bone';
  const height = size === 'gym' ? 'min-h-[64px]' : 'min-h-[48px]';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`${height} items-center justify-center rounded-btn px-5 ${background} ${disabled ? 'opacity-40' : 'active:opacity-80'}`}
    >
      <View className="flex-row items-center">
        {Icon ? (
          <Icon
            size={20}
            color={variant === 'primary' ? c.bg : c.text}
            strokeWidth={2.2}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <Text
          className={`font-uiSemi text-[17px] ${variant === 'primary' ? 'uppercase' : ''} ${textColor}`}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
