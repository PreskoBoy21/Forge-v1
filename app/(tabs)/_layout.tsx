import { Tabs } from 'expo-router';

import { ForgeTabBar } from '@/components/ForgeTabBar';
import { colors } from '@/theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <ForgeTabBar state={props.state} navigateToTab={props.navigateToTab} />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.graphite[950] },
      }}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="train" />
      <Tabs.Screen name="snap" />
      <Tabs.Screen name="body" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}
