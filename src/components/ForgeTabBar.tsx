import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { glow } from '@/theme/tokens';

type ForgeTabBarProps = {
  state: { index: number; routes: { name: string; state?: unknown }[] };
  navigation: { navigate: (name: string) => void };
};

const TABS = [
  { name: 'today', label: 'Today' },
  { name: 'train', label: 'Train' },
  { name: 'snap', label: 'Snap' },
  { name: 'crew', label: 'Crew' },
  { name: 'you', label: 'You' },
] as const;

function leafName(state: unknown): string {
  if (
    !state ||
    typeof state !== 'object' ||
    !('routes' in state) ||
    !('index' in state)
  ) {
    return '';
  }
  const current = state as {
    index: number;
    routes: { name: string; state?: unknown }[];
  };
  const route = current.routes[current.index];
  if (!route) return '';
  if (route.state) return leafName(route.state);
  return route.name;
}

export function ForgeTabBar({ state, navigation }: ForgeTabBarProps) {
  const insets = useSafeAreaInsets();
  const leaf = leafName(state);
  if (leaf === 'forge-day' || leaf === 'verdict' || leaf === 'card') {
    return null;
  }

  return (
    <View
      className="flex-row items-end border-t border-graphite-700 bg-graphite-950 px-3"
      style={{ paddingBottom: Math.max(insets.bottom, 10), paddingTop: 10 }}
    >
      {TABS.map((tab, index) => {
        const focused = state.index === index;
        const isSnap = tab.name === 'snap';

        return (
          <Pressable
            key={tab.name}
            accessibilityRole="button"
            onPress={() => navigation.navigate(tab.name)}
            className="flex-1 items-center"
          >
            {isSnap ? (
              <View
                className="h-12 w-12 items-center justify-center rounded-full bg-molten"
                style={glow}
              >
                <View className="h-5 w-5 rounded-full border-2 border-graphite-950" />
              </View>
            ) : (
              <>
                <View
                  className={`h-1.5 w-1.5 rounded-full ${focused ? 'bg-molten' : 'bg-graphite-700'}`}
                />
                <Text
                  className={`mt-1 font-uiMedium text-[11px] ${focused ? 'text-bone' : 'text-steel'}`}
                >
                  {tab.label}
                </Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
