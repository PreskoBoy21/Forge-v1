import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';

type LockedScreenProps = {
  title: string;
  body: string;
};

/** Shown for features that are designed but not part of the first release. */
export function LockedScreen({ title, body }: LockedScreenProps) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-6">
        <View className="h-16 w-16 items-center justify-center rounded-full border border-graphite-700 bg-graphite-900">
          <Text className="text-[28px]">🔒</Text>
        </View>
        <Text className="mt-6 font-uiMedium text-[12px] uppercase tracking-widest text-molten">
          Coming soon
        </Text>
        <Text className="mt-2 text-center font-display text-[34px] uppercase tracking-wide text-bone">
          {title}
        </Text>
        <Text className="mt-3 text-center font-ui text-[15px] text-steel">
          {body}
        </Text>
      </View>
    </Screen>
  );
}
