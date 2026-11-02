import type { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

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
  const { data, error } = await supabase.auth.signUp({ email, password });
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
