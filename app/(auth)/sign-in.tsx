import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { saveOnboarding } from '@/features/auth/save-onboarding';
import { signIn, signUp } from '@/features/auth/session';
import { go } from '@/lib/nav';
import { colors } from '@/theme/tokens';

type Mode = 'signup' | 'signin';

export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 8;

  const submit = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === 'signup') {
        const { needsConfirmation } = await signUp(email.trim(), password);
        if (needsConfirmation) {
          setNotice(
            'Check your inbox and tap the confirmation link, then log in here.',
          );
          setMode('signin');
          return;
        }
      } else {
        await signIn(email.trim(), password);
      }
      await saveOnboarding();
      go('/(onboarding)/notify');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Something went wrong. Try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const input =
    'min-h-[52px] rounded-btn bg-graphite-900 px-4 font-ui text-[17px] text-bone';

  return (
    <Screen>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        {mode === 'signup' ? 'Save your plan' : 'Welcome back'}
      </Text>
      <Text className="mt-2 font-ui text-[17px] text-steel">
        {mode === 'signup'
          ? 'Create an account so your plan, workouts and progress are saved.'
          : 'Log in to pick up where you left off.'}
      </Text>

      <View className="mt-8 gap-3">
        <TextInput
          className={input}
          placeholder="Email"
          placeholderTextColor={colors.steel[400]}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className={input}
          placeholder="Password (8+ characters)"
          placeholderTextColor={colors.steel[400]}
          secureTextEntry
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChangeText={setPassword}
        />
        {error ? (
          <Text className="font-ui text-[15px] text-rose">{error}</Text>
        ) : null}
        {notice ? (
          <Text className="font-ui text-[15px] text-mint">{notice}</Text>
        ) : null}
        <View className="mt-2">
          <Button
            label={
              busy
                ? 'One sec…'
                : mode === 'signup'
                  ? 'Create account'
                  : 'Log in'
            }
            disabled={!valid || busy}
            onPress={() => void submit()}
          />
        </View>
        <Pressable
          className="py-3"
          onPress={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setError(null);
          }}
        >
          <Text className="text-center font-uiMedium text-[15px] text-steel">
            {mode === 'signup'
              ? 'Already have an account? Log in'
              : 'New here? Create an account'}
          </Text>
        </Pressable>
      </View>

      <Text className="mt-auto pb-6 font-ui text-[12px] text-steel">
        Sign in with Apple and Google come before launch. By continuing you
        confirm you are 18+. Not medical advice.
      </Text>
    </Screen>
  );
}
