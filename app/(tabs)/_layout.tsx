import { Tabs } from 'expo-router';

import { ForgeTabBar } from '@/components/ForgeTabBar';
import { useColors } from '@/theme/theme';

export default function TabLayout() {
  const c = useColors();
  return (
    <Tabs
      tabBar={(props) => (
        <ForgeTabBar state={props.state} navigateToTab={props.navigateToTab} />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: c.bg },
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
