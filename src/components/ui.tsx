import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ChevronRight, type LucideIcon } from '@/components/icons';
import { useColors } from '@/theme/theme';

/** Small shared building blocks for the redesigned screens. */

export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={`font-uiMedium text-[12px] uppercase tracking-widest text-steel ${className}`}
    >
      {children}
    </Text>
  );
}

export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View className="mb-3 mt-7 flex-row items-center justify-between">
      <Text className="font-display text-[19px] uppercase tracking-wide text-bone">
        {title}
      </Text>
      {action && onPress ? (
        <Pressable
          onPress={onPress}
          hitSlop={10}
          className="flex-row items-center"
        >
          <Text className="font-uiSemi text-[14px] text-molten">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Rounded square with a tinted background behind an icon. */
export function IconBadge({
  Icon,
  color,
  size = 34,
}: {
  Icon: LucideIcon;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: `${color}22`,
      }}
      className="items-center justify-center"
    >
      <Icon size={size * 0.55} color={color} strokeWidth={2.2} />
    </View>
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-3.5 py-1.5 ${active ? 'bg-bone' : 'bg-graphite-800'}`}
    >
      <Text
        className={`font-uiSemi text-[13px] ${active ? 'text-graphite-950' : 'text-steel'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Settings-style row with icon, label, optional value and chevron. */
export function ListRow({
  Icon,
  label,
  value,
  onPress,
  danger,
  last,
}: {
  Icon: LucideIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center py-3.5 ${last ? '' : 'border-b border-graphite-700/60'}`}
    >
      <Icon size={20} color={danger ? c.bad : c.muted} strokeWidth={2} />
      <Text
        className={`ml-3 flex-1 font-uiMedium text-[16px] ${danger ? 'text-rose' : 'text-bone'}`}
      >
        {label}
      </Text>
      {value ? (
        <Text className="mr-1 font-ui text-[15px] text-steel">{value}</Text>
      ) : null}
      {onPress && !danger ? <ChevronRight size={18} color={c.muted} /> : null}
    </Pressable>
  );
}

/** AI explanation box shown under a chart. */
export function Explain({ text, Icon }: { text?: string; Icon: LucideIcon }) {
  const c = useColors();
  if (!text) return null;
  return (
    <View className="mt-4 flex-row rounded-2xl bg-graphite-800 p-3">
      <Icon size={16} color={c.accent} strokeWidth={2.2} />
      <Text className="ml-2 flex-1 font-ui text-[14px] leading-[20px] text-bone">
        {text}
      </Text>
    </View>
  );
}
