import * as Apple from 'expo-apple-authentication';
import type { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import { telemetryInstallId } from '@/lib/telemetry';

type SessionState = {
  session: Session | null;
  ready: boolean;
};

export const useSession = create<SessionState>(() => ({
  session: null,
  ready: false,
}));

/** Mount once at the root: keeps the session store in sync with Supabase Auth. */
export function useSessionListener() {
  useEffect(() => {
    if (!supabase) {
      useSession.setState({ ready: true });
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      useSession.setState({ session: data.session, ready: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      useSession.setState({ session, ready: true });
    });
    return () => data.subscription.unsubscribe();
  }, []);
}

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Backend not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://preskoboy21.github.io/Forge-v1/confirmed.html',
    },
  });
  if (error) throw error;
  return { needsConfirmation: !data.session };
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Backend not configured');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase?.auth.signOut();
}

/** App Store requirement: permanently delete the account and its data. */
export async function deleteAccount() {
  if (!supabase) throw new Error('Backend not configured');
  const installId = await telemetryInstallId();
  const { error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
    body: { installId },
  });
  if (error) throw new Error('Could not delete your account. Try again.');
  await supabase.auth.signOut();
}

/** Sign in with Apple (iOS). Supabase must have the Apple provider enabled. */
export async function signInWithApple(): Promise<'ok' | 'cancelled'> {
  if (!supabase) throw new Error('Backend not configured');

  try {
    const cred = await Apple.signInAsync({
      requestedScopes: [
        Apple.AppleAuthenticationScope.FULL_NAME,
        Apple.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!cred.identityToken) throw new Error('No identity token from Apple');
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: cred.identityToken,
    });
    if (error) throw error;
    return 'ok';
  } catch (e) {
    if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED')
      return 'cancelled';
    throw e;
  }
}
