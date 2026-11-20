import { type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { X } from '@/components/icons';
import { THEME_VARS, useColors, useScheme } from '@/theme/theme';

/** Bottom sheet that explains one recommendation with the data behind it. */
export function CoachSheet({
  open,
  onClose,
  kicker,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const scheme = useScheme();
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* a Modal renders outside the themed root, so re-apply the theme */}
      <View style={[{ flex: 1 }, THEME_VARS[scheme]]}>
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
        />
        <View
          className="rounded-t-[28px] border-t border-graphite-700 bg-graphite-900 px-5 pt-3"
          style={{
            maxHeight: '78%',
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <View className="mb-3 h-1.5 w-10 self-center rounded-full bg-graphite-700" />
          <View className="flex-row items-start">
            <View className="flex-1 pr-3">
              <Text className="font-uiSemi text-[12px] uppercase tracking-widest text-steel">
                {kicker}
              </Text>
              <Text className="mt-1 font-uiSemi text-[22px] leading-7 text-bone">
                {title}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityLabel="Close"
              className="h-9 w-9 items-center justify-center rounded-full bg-graphite-800"
            >
              <X size={18} color={c.muted} />
            </Pressable>
          </View>
          <ScrollView className="mt-3" contentContainerClassName="pb-2">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function SheetText({ title, text }: { title?: string; text: string }) {
  return (
    <View className="mt-4 rounded-card border border-graphite-700/60 bg-graphite-950 p-4">
      {title ? (
        <Text className="mb-1 font-uiSemi text-[15px] text-bone">{title}</Text>
      ) : null}
      <Text className="font-ui text-[15px] leading-[22px] text-steel">
        {text}
      </Text>
    </View>
  );
}
