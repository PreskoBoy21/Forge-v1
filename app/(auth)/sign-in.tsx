import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { go } from '@/lib/nav';

export default function SignInScreen() {
  return (
    <Screen>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Save your plan
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        Sign-up happens here, after you’ve seen the plan — not on screen one.
      </Text>
      <View className="mt-8 gap-3">
        <Button
          label="Continue with Apple"
          onPress={() => go('/(onboarding)/notify')}
        />
        <Button
          label="Continue with Google"
          variant="secondary"
          onPress={() => go('/(onboarding)/notify')}
        />
        <Button
          label="Email magic link"
          variant="secondary"
          onPress={() => go('/(onboarding)/notify')}
        />
      </View>
    </Screen>
  );
}
