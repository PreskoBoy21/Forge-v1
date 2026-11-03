import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useSession } from '@/features/auth/session';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';

/** Entry: signed-in and onboarded → Today, otherwise the welcome screen. */
export default function Index() {
  const { session, ready } = useSession();
  const onboarded = useOnboardingDraft((s) => s.goal !== null);
  if (!ready) return <View className="flex-1 bg-graphite-950" />;
  if (session && onboarded) return <Redirect href="/(tabs)/today" />;
  return <Redirect href="/(auth)/welcome" />;
}
