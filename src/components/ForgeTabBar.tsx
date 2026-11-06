import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Activity,
  Camera,
  Dumbbell,
  House,
  User,
  type LucideIcon,
} from '@/components/icons';
import { useColors } from '@/theme/theme';

type ForgeTabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string; state?: unknown }[];
  };
  navigateToTab: (routeKey: string) => void;
};

const TABS: { name: string; label: string; Icon: LucideIcon }[] = [
  { name: 'today', label: 'Today', Icon: House },
  { name: 'train', label: 'Train', Icon: Dumbbell },
  { name: 'snap', label: 'Food', Icon: Camera },
  { name: 'body', label: 'Body', Icon: Activity },
  { name: 'you', label: 'You', Icon: User },
];

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

export function ForgeTabBar({ state, navigateToTab }: ForgeTabBarProps) {
  const insets = useSafeAreaInsets();
  const c = useColors();
  const leaf = leafName(state);
  if (['forge-day', 'verdict', 'card', 'gym'].includes(leaf)) {
    return null;
  }

  return (
    <View
      className="flex-row items-end border-t border-graphite-700 bg-graphite-900 px-2"
      style={{ paddingBottom: Math.max(insets.bottom, 10), paddingTop: 8 }}
    >
      {TABS.map((tab, index) => {
        const focused = state.index === index;
        const isSnap = tab.name === 'snap';
        const { Icon } = tab;

        return (
          <Pressable
            key={tab.name}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: focused }}
            onPress={() => {
              const route = state.routes[index];
              if (route) navigateToTab(route.key);
            }}
            className="flex-1 items-center"
          >
            {isSnap ? (
              <View
                className="-mt-6 h-14 w-14 items-center justify-center rounded-full bg-molten"
                style={{
                  shadowColor: c.accent,
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                }}
              >
                <Icon size={26} color={c.bg} strokeWidth={2.2} />
              </View>
            ) : (
              <Icon
                size={23}
                color={focused ? c.accent : c.muted}
                strokeWidth={focused ? 2.4 : 1.9}
              />
            )}
            <Text
              className={`mt-1 font-uiMedium text-[11px] ${focused ? 'text-bone' : 'text-steel'}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
