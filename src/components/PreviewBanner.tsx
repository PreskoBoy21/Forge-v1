import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

export function PreviewBanner() {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/preview')}
      className="mb-4 self-start rounded-full bg-surface px-3 py-2"
    >
      <Text className="font-bodyMedium text-xs uppercase tracking-wide text-muted">
        Preview · all screens
      </Text>
    </Pressable>
  );
}
