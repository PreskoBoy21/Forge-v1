import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

export default function WelcomeScreen() {
  return (
    <Screen>
      <View className="flex-1 justify-end pb-6">
        <Text className="font-headingBold text-5xl uppercase text-lime">
          Forge
        </Text>
        <Text className="mt-4 font-heading text-3xl uppercase text-ink">
          Knows your body. Tells you what to do today.
        </Text>
        <Text className="mt-4 font-body text-base text-muted">
          An AI coach that combines training, food and progress into one daily
          plan. Not medical advice — consult a doctor for health conditions.
        </Text>
        <View className="mt-10 gap-3">
          <Button
            label="Walk through the app"
            onPress={() => router.push('/preview')}
          />
          <Button
            label="Start onboarding"
            variant="secondary"
            onPress={() => router.push('/(onboarding)/age')}
          />
          <Button
            label="Jump to Today"
            variant="secondary"
            onPress={() => router.replace('/(tabs)/today')}
          />
        </View>
      </View>
    </Screen>
  );
}
