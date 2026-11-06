import * as Apple from 'expo-apple-authentication';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import {
  restoreProfile,
  saveOnboarding,
} from '@/features/auth/save-onboarding';
import { signIn, signInWithApple, signUp } from '@/features/auth/session';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { syncPendingWorkouts, useTrain } from '@/features/train/store';
import { pullWorkouts } from '@/features/train/sync';
import { go, replaceTo } from '@/lib/nav';
import { useColors, useScheme } from '@/theme/theme';

type Mode = 'signup' | 'signin';

function useAppleAvailable() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    void Apple.isAvailableAsync()
      .then(setOk)
      .catch(() => setOk(false));
  }, []);
  return ok;
}

function AppleButton({
  mode,
  scheme,
  onPress,
}: {
  mode: Mode;
  scheme: 'light' | 'dark';
  onPress: () => void;
}) {
  return (
    <Apple.AppleAuthenticationButton
      buttonType={
        mode === 'signup'
          ? Apple.AppleAuthenticationButtonType.SIGN_UP
          : Apple.AppleAuthenticationButtonType.SIGN_IN
      }
      buttonStyle={
        scheme === 'dark'
          ? Apple.AppleAuthenticationButtonStyle.WHITE
          : Apple.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={16}
      style={{ height: 52, width: '100%' }}
      onPress={onPress}
    />
  );
}

export default function SignInScreen() {
  const c = useColors();
  const scheme = useScheme();
  const appleAvailable = useAppleAvailable();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(
    params.mode === 'signin' ? 'signin' : 'signup',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 8;

  const afterSignIn = async () => {
    if (await restoreProfile()) {
      // Returning user: bring back their workouts and go straight in.
      const remote = await pullWorkouts().catch(() => null);
      if (remote?.length && useTrain.getState().history.length === 0)
        useTrain.getState().setHistory(remote);
      void syncPendingWorkouts();
      replaceTo('/(tabs)/today');
      return;
    }
    if (useOnboardingDraft.getState().goal === null) {
      // Account first, plan second (came from "I already have an account").
      replaceTo('/(onboarding)/goal');
      return;
    }
    await saveOnboarding();
    go('/(onboarding)/notify');
  };

  const apple = async () => {
    setBusy(true);
    setError(null);
    try {
      if ((await signInWithApple()) === 'ok') await afterSignIn();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Apple sign-in failed. Try again.',
      );
    } finally {
      setBusy(false);
    }
  };

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
      await afterSignIn();
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
        {appleAvailable ? (
          <>
            <AppleButton
              mode={mode}
              scheme={scheme}
              onPress={() => void apple()}
            />
            <View className="my-1 flex-row items-center">
              <View className="h-px flex-1 bg-graphite-700" />
              <Text className="mx-3 font-ui text-[13px] text-steel">
                or with email
              </Text>
              <View className="h-px flex-1 bg-graphite-700" />
            </View>
          </>
        ) : null}
        <TextInput
          className={input}
          placeholder="Email"
          placeholderTextColor={c.muted}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className={input}
          placeholder="Password (8+ characters)"
          placeholderTextColor={c.muted}
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
        By continuing you confirm you are 18+ and agree to the Terms. Not
        medical advice.
      </Text>
    </Screen>
  );
}
