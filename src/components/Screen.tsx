import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = false }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView
        className="flex-1 bg-background"
        edges={['top', 'left', 'right']}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8 pt-2"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
      <View className="flex-1 px-5 pt-2">{children}</View>
    </SafeAreaView>
  );
}
