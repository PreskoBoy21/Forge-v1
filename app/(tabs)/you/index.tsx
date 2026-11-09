import * as WebBrowser from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  Bell,
  Brain,
  CalendarDays,
  FileText,
  HeartPulse,
  LogOut,
  Mail,
  MessageCircle,
  Monitor,
  Moon,
  Pencil,
  RotateCcw,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  User,
} from '@/components/icons';
import { ListRow, SectionHeader } from '@/components/ui';
import { Screen } from '@/components/Screen';
import { deleteAccount, signOut, useSession } from '@/features/auth/session';
import { useConsent } from '@/features/consent/store';
import { useTargets } from '@/features/food/store';
import { usePro } from '@/features/paywall/purchases';
import { FLAGS } from '@/lib/flags';
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
import {
  disableReminder,
  enableReminder,
  REMINDER_TIMES,
  timeLabel,
  useReminder,
} from '@/features/notify/reminders';
import {
  healthProviderLabel,
  healthSupported,
  useHealth,
} from '@/features/health/store';
import { useColors, useTheme, type ThemeMode } from '@/theme/theme';

const COACH: Record<CoachPersona, string> = {
  buddy: 'Buddy',
  sergeant: 'Sergeant',
  scientist: 'Scientist',
};

const MODES: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'system', label: 'System', Icon: Monitor },
];

function AppearancePicker() {
  const c = useColors();
  const { mode, setMode } = useTheme();
  return (
    <View className="flex-row gap-2">
      {MODES.map((m) => {
        const on = m.mode === mode;
        return (
          <Pressable
            key={m.mode}
            onPress={() => setMode(m.mode)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            className={`flex-1 items-center rounded-2xl border py-3 ${on ? 'border-molten bg-graphite-800' : 'border-graphite-700/60'}`}
          >
            <m.Icon size={20} color={on ? c.accent : c.muted} />
            <Text
              className={`mt-1 font-uiSemi text-[13px] ${on ? 'text-bone' : 'text-steel'}`}
            >
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function YouScreen() {
  const health = useHealth();
  const reminder = useReminder();
  const aiConsent = useConsent((s) => s.ai);
  // Off → 07:30 → 12:00 → 17:30 → 20:00 → Off
  const cycleReminder = () => {
    if (!reminder.enabled) {
      const t = REMINDER_TIMES[0];
      return void enableReminder(t.hour, t.minute);
    }
    const i = REMINDER_TIMES.findIndex(
      (t) => t.hour === reminder.hour && t.minute === reminder.minute,
    );
    const t = REMINDER_TIMES[i + 1];
    return void (t ? enableReminder(t.hour, t.minute) : disableReminder());
  };
  const session = useSession((s) => s.session);
  const isPro = usePro((s) => s.isPro);
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
        {COACH[draft.coach]} coach
        {FLAGS.SUBSCRIPTIONS ? (isPro ? ' · Pro' : ' · Free') : ''}
      </Text>
      <Text
        className="mt-1 font-display text-[28px] uppercase tracking-wide text-bone"
        numberOfLines={1}
      >
        {session?.user.email?.split('@')[0] ?? 'Not signed in'}
      </Text>

      <View className="mt-5 flex-row gap-3">
        <Card className="flex-1">
          <Text className="font-uiMedium text-[12px] text-steel">
            Daily target
          </Text>
          <Text className="mt-1 font-display text-[24px] text-bone">
            {targets.kcal}
          </Text>
          <Text className="font-ui text-[12px] text-steel">
            kcal · {targets.proteinG} g protein
          </Text>
        </Card>
        <Card className="flex-1">
          <Text className="font-uiMedium text-[12px] text-steel">Workouts</Text>
          <Text className="mt-1 font-display text-[24px] text-bone">
            {history.length}
          </Text>
          <Text className="font-ui text-[12px] text-steel">
            {draft.trainingDays} days / week plan
          </Text>
        </Card>
      </View>

      {prs.length ? (
        <Card className="mt-3">
          <Text className="font-uiMedium text-[12px] text-steel">
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
        </Card>
      ) : null}

      {FLAGS.SUBSCRIPTIONS ? (
        <Pressable
          onPress={() => go('/(tabs)/you/paywall')}
          className="mt-3 rounded-card border border-molten/40 bg-graphite-900 p-4"
        >
          <Text className="font-uiSemi text-[15px] text-molten">Forge Pro</Text>
          <Text className="mt-1 font-ui text-[13px] text-steel">
            Unlimited meal scans · AI coach read every day
          </Text>
        </Pressable>
      ) : null}

      <SectionHeader title="Appearance" />
      <AppearancePicker />

      <SectionHeader title="Coach & data" />
      <Card className="py-1">
        <ListRow
          Icon={Sparkles}
          label="Coach style"
          value={COACH[draft.coach]}
          onPress={cycleCoach}
        />
        <ListRow
          Icon={CalendarDays}
          label="Weekly verdict"
          onPress={() => go('/(tabs)/you/verdict')}
        />
        <ListRow
          Icon={Brain}
          label="AI coaching"
          value={aiConsent === 'granted' ? 'On' : 'Off'}
          onPress={() => go('/(tabs)/you/ai')}
        />
        <ListRow
          Icon={HeartPulse}
          label={healthSupported ? healthProviderLabel : 'Health data'}
          value={
            health.connected
              ? health.loading
                ? 'Syncing…'
                : 'Connected'
              : 'Connect'
          }
          onPress={() =>
            void (health.connected ? health.refresh() : health.connect())
          }
        />
        <ListRow
          Icon={Bell}
          label="Daily reminder"
          value={
            reminder.enabled ? timeLabel(reminder.hour, reminder.minute) : 'Off'
          }
          onPress={cycleReminder}
        />
        <ListRow
          Icon={Pencil}
          label="Edit my plan"
          onPress={() => go('/(tabs)/train/edit')}
        />
        <ListRow
          Icon={RotateCcw}
          label="Redo my plan"
          onPress={() => go('/(onboarding)/goal')}
          last
        />
      </Card>

      <SectionHeader title="Account" />
      <Card className="py-1">
        <ListRow
          Icon={Shield}
          label="Privacy policy"
          onPress={() => void WebBrowser.openBrowserAsync(LINKS.privacy)}
        />
        <ListRow
          Icon={FileText}
          label="Terms"
          onPress={() => void WebBrowser.openBrowserAsync(LINKS.terms)}
        />
        <ListRow
          Icon={MessageCircle}
          label="Send feedback"
          onPress={() => go('/(tabs)/you/feedback')}
        />
        <ListRow
          Icon={Mail}
          label="Contact support"
          onPress={() => void Linking.openURL(LINKS.support)}
          last={!session}
        />
        {session ? (
          <>
            <ListRow
              Icon={LogOut}
              label="Sign out"
              onPress={() => void onSignOut()}
            />
            <ListRow
              Icon={Trash2}
              label="Delete account"
              danger
              onPress={() => setConfirmDelete(true)}
              last
            />
          </>
        ) : (
          <ListRow
            Icon={User}
            label="Log in"
            onPress={() => go('/(auth)/sign-in?mode=signin')}
            last
          />
        )}
      </Card>

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
