import { Pressable, Text } from 'react-native';

import { BookOpen } from '@/components/icons';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

/** "How we calculate this · Sources" — shown next to every health number. */
export function SourcesLink({
  topic,
  label = 'How we calculate this · Sources',
  className = '',
}: {
  topic?: string;
  label?: string;
  className?: string;
}) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="link"
      hitSlop={8}
      onPress={() => go(topic ? `/sources?topic=${topic}` : '/sources')}
      className={`flex-row items-center self-start py-1 ${className}`}
    >
      <BookOpen size={14} color={c.accent} />
      <Text className="ml-1.5 font-uiMedium text-[13px] text-molten underline">
        {label}
      </Text>
    </Pressable>
  );
}
