import {
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import 'react-native-reanimated';

import '../global.css';

import { useSession, useSessionListener } from '@/features/auth/session';
import { useHealth } from '@/features/health/store';
import { initPurchases } from '@/features/paywall/purchases';
import { syncPendingWorkouts } from '@/features/train/store';
import { PALETTE, THEME_VARS, useScheme } from '@/theme/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useSessionListener();
  const userId = useSession((s) => s.session?.user.id ?? null);
  useEffect(() => {
    void initPurchases(userId);
    if (userId) void syncPendingWorkouts();
  }, [userId]);
  const scheme = useScheme();
  // Re-read Apple Health / Health Connect on launch and when the app returns.
  useEffect(() => {
    const refresh = () => void useHealth.getState().refresh();
    if (useHealth.persist.hasHydrated()) refresh();
    const unsub = useHealth.persist.onFinishHydration(refresh);
    let last = Date.now();
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active' && Date.now() - last > 10 * 60_000) {
        last = Date.now();
        refresh();
      }
    });
    return () => {
      unsub();
      sub.remove();
    };
  }, []);
  const [queryClient] = useState(() => new QueryClient());
  const [loaded, error] = useFonts({
    Archivo_700Bold,
    Archivo_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1 bg-graphite-950" style={THEME_VARS[scheme]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: PALETTE[scheme].bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="preview" />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
