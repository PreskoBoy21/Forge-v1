import { Pressable, Text } from 'react-native';
import { go } from '@/lib/nav';

export function PreviewBanner() {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => go('/preview')}
      className="mb-4 self-start rounded-full bg-graphite-800 px-3 py-2"
    >
      <Text className="font-uiMedium text-[13px] uppercase tracking-wide text-steel">
        Preview · all screens
      </Text>
    </Pressable>
  );
}
