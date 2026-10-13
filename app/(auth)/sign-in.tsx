import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';

export default function SignInScreen() {
  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-heading text-3xl uppercase text-ink">Sign in</Text>
      <Text className="mt-2 font-body text-base text-muted">
        Preview mode: any button continues. Real auth comes in Phase 1.
      </Text>
      <View className="mt-8 gap-3">
        <Button
          label="Continue with email"
          onPress={() => router.push('/(onboarding)/age')}
        />
        <Button
          label="Sign in with Apple"
          variant="secondary"
          onPress={() => router.push('/(onboarding)/age')}
        />
        <Button
          label="Sign in with Google"
          variant="secondary"
          onPress={() => router.push('/(onboarding)/age')}
        />
      </View>
    </Screen>
  );
}
