import * as WebBrowser from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { deleteAccount, signOut, useSession } from '@/features/auth/session';
import { useTargets } from '@/features/food/store';
import {
  useOnboardingDraft,
  type CoachPersona,
} from '@/features/onboarding/draft-store';
import { bestWeights, kgLabel } from '@/features/train/program';
import { useTrain } from '@/features/train/store';
import { LINKS } from '@/lib/links';
import { go, replaceTo } from '@/lib/nav';
import { clearLocalData } from '@/lib/reset';
import { supabase } from '@/lib/supabase';

const COACH: Record<CoachPersona, string> = {
  buddy: 'Buddy',
  sergeant: 'Sergeant',
  scientist: 'Scientist',
};

function Row({
  label,
  value,
  onPress,
  danger,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between border-b border-graphite-800 py-4"
    >
      <Text
        className={`font-uiMedium text-[16px] ${danger ? 'text-rose' : 'text-bone'}`}
      >
        {label}
      </Text>
      {value ? (
        <Text className="font-ui text-[15px] text-steel">{value}</Text>
      ) : null}
    </Pressable>
  );
}

export default function YouScreen() {
  const session = useSession((s) => s.session);
  const draft = useOnboardingDraft();
  const targets = useTargets();
  const history = useTrain((s) => s.history);
  const prs = useMemo(
    () =>
      Object.entries(bestWeights(history))
        .filter(([, kg]) => kg > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
    [history],
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const cycleCoach = () => {
    const order: CoachPersona[] = ['buddy', 'sergeant', 'scientist'];
    const next = order[(order.indexOf(draft.coach) + 1) % order.length]!;
    draft.update({ coach: next });
    const uid = session?.user.id;
    if (supabase && uid)
      void supabase
        .from('profiles')
        .update({ coach_style: next })
        .eq('id', uid);
  };

  const onSignOut = async () => {
    await signOut();
    clearLocalData();
    replaceTo('/(auth)/welcome');
  };

  const onDelete = async () => {
    setBusy(true);
    setError('');
    try {
      await deleteAccount();
      clearLocalData();
      replaceTo('/(auth)/welcome');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        You · {COACH[draft.coach]} coach · Free
      </Text>
      <Text
        className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone"
        numberOfLines={1}
      >
        {session?.user.email?.split('@')[0] ?? 'Not signed in'}
      </Text>

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 rounded-card bg-graphite-900 p-4">
          <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
            Daily target
          </Text>
          <Text className="mt-1 font-display text-[24px] text-bone">
            {targets.kcal}
          </Text>
          <Text className="font-ui text-[12px] text-steel">
            kcal · {targets.proteinG} g protein
          </Text>
        </View>
        <View className="flex-1 rounded-card bg-graphite-900 p-4">
          <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
            Workouts
          </Text>
          <Text className="mt-1 font-display text-[24px] text-bone">
            {history.length}
          </Text>
          <Text className="font-ui text-[12px] text-steel">
            {draft.trainingDays} days / week plan
          </Text>
        </View>
      </View>

      {prs.length ? (
        <View className="mt-3 rounded-card bg-graphite-900 p-4">
          <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
            Best lifts
          </Text>
          {prs.map(([name, kg]) => (
            <View key={name} className="mt-2 flex-row justify-between">
              <Text className="font-ui text-[15px] text-bone">{name}</Text>
              <Text className="font-uiSemi text-[15px] text-gold">
                {kgLabel(kg)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <Pressable
        onPress={() => go('/(tabs)/you/paywall')}
        className="mt-3 rounded-card border border-molten/40 bg-graphite-900 p-4"
      >
        <Text className="font-uiSemi text-[15px] text-molten">Forge Pro</Text>
        <Text className="mt-1 font-ui text-[13px] text-steel">
          Unlimited meal scans · AI coach read every day
        </Text>
      </Pressable>

      <View className="mt-6">
        <Row
          label="Coach style"
          value={`${COACH[draft.coach]} ›`}
          onPress={cycleCoach}
        />
        <Row
          label="Redo my plan"
          value="›"
          onPress={() => go('/(onboarding)/goal')}
        />
        <Row
          label="Privacy policy"
          value="›"
          onPress={() => void WebBrowser.openBrowserAsync(LINKS.privacy)}
        />
        <Row
          label="Terms"
          value="›"
          onPress={() => void WebBrowser.openBrowserAsync(LINKS.terms)}
        />
        <Row
          label="Contact support"
          value="›"
          onPress={() => void Linking.openURL(LINKS.support)}
        />
        {session ? (
          <>
            <Row label="Sign out" onPress={() => void onSignOut()} />
            <Row
              label="Delete account"
              danger
              onPress={() => setConfirmDelete(true)}
            />
          </>
        ) : (
          <Row
            label="Sign in"
            value="›"
            onPress={() => go('/(auth)/sign-in?mode=signin')}
          />
        )}
      </View>

      {confirmDelete ? (
        <View className="mt-4 rounded-card border border-rose/50 bg-graphite-900 p-4">
          <Text className="font-uiSemi text-[17px] text-bone">
            Delete your account?
          </Text>
          <Text className="mt-1 font-ui text-[15px] text-steel">
            This permanently deletes your account, workouts, meals and health
            data from Forge. It can’t be undone. Subscriptions are managed in
            your App Store / Google Play settings.
          </Text>
          {error ? (
            <Text className="mt-2 font-ui text-[14px] text-rose">{error}</Text>
          ) : null}
          <View className="mt-4 gap-2">
            <Button
              label={busy ? 'Deleting…' : 'Yes, delete everything'}
              disabled={busy}
              onPress={() => void onDelete()}
            />
            <Button
              label="Cancel"
              variant="ghost"
              onPress={() => setConfirmDelete(false)}
            />
          </View>
        </View>
      ) : null}

      <Text className="mt-8 pb-6 font-ui text-[13px] text-steel">
        Forge is not medical advice. Talk to a doctor about health conditions.
      </Text>
    </Screen>
  );
}
