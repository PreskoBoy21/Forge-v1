import { Tabs } from 'expo-router';

import { ForgeTabBar } from '@/components/ForgeTabBar';
import { colors } from '@/theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <ForgeTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.graphite[950] },
      }}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="train" />
      <Tabs.Screen name="snap" />
      <Tabs.Screen name="crew" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}
