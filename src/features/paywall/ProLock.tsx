import { Pressable, Text, View } from 'react-native';

import { Lock } from '@/components/icons';
import { go } from '@/lib/nav';
import { track } from '@/lib/telemetry';
import { useColors } from '@/theme/theme';

/** Locked feature on the free web plan → opens the plan choice. */
export function ProLock({
  title,
  body,
  where,
}: {
  title: string;
  body: string;
  where: string;
}) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens Forge Pro"
      onPress={() => {
        track('screen', { path: `upsell_${where}` });
        go('/(tabs)/you/paywall');
      }}
      className="rounded-card border border-molten/40 bg-graphite-900 p-4 active:opacity-80"
    >
      <View className="flex-row items-center">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-molten/15">
          <Lock size={17} color={c.accent} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-uiSemi text-[16px] text-bone">{title}</Text>
          <Text className="mt-0.5 font-ui text-[13px] leading-[18px] text-steel">
            {body}
          </Text>
        </View>
      </View>
      <Text className="mt-3 font-uiSemi text-[14px] text-molten">
        Unlock with Pro →
      </Text>
    </Pressable>
  );
}

/** Small "PRO" tag next to locked labels. */
export function ProTag() {
  return (
    <View className="ml-1.5 rounded bg-molten px-1.5 py-0.5">
      <Text className="font-uiSemi text-[10px]" style={{ color: '#000' }}>
        PRO
      </Text>
    </View>
  );
}
