import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';

import type { Json } from '@/types/database';

import { supabase } from './supabase';
import { cleanProps, type Props } from './telemetry-props';

export { cleanProps };

/**
 * First-party analytics, crash reports and feedback, stored in our own
 * Supabase table `app_events` (insert-only, deleted with the account).
 * No third-party SDK, no advertising IDs, no names or emails in props.
 *
 * Events are buffered and sent in small batches; failures are dropped
 * silently (telemetry must never break the app).
 */

export type EventName =
  | 'app_open'
  | 'screen'
  | 'onboarding_done'
  | 'ai_consent'
  | 'health_connected'
  | 'workout_started'
  | 'workout_finished'
  | 'meal_saved'
  | 'meal_scan'
  | 'verdict_viewed'
  | 'feedback'
  | 'crash';

type Row = { name: EventName; props: Props; created_at: string };

const MAX_BUFFER = 200;
const FLUSH_EVERY_MS = 20_000;
const INSTALL_KEY = 'forge-install-id';

let buffer: Row[] = [];
let installId: string | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let flushing = false;

const isServer = typeof window === 'undefined' && Platform.OS === 'web';
const appVersion = Constants.expoConfig?.version ?? null;

function randomId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

async function getInstallId() {
  if (installId) return installId;
  try {
    installId = await AsyncStorage.getItem(INSTALL_KEY);
    if (!installId) {
      installId = randomId();
      await AsyncStorage.setItem(INSTALL_KEY, installId);
    }
  } catch {
    installId = randomId();
  }
  return installId;
}

/** Record one event. Cheap and safe to call anywhere. */
export function track(name: EventName, props?: Props) {
  if (isServer) return;
  buffer.push({
    name,
    props: cleanProps(props),
    created_at: new Date().toISOString(),
  });
  if (buffer.length > MAX_BUFFER) buffer = buffer.slice(-MAX_BUFFER);
  if (name === 'crash' || name === 'feedback') void flush();
}

/** Send buffered events now. */
export async function flush() {
  if (!supabase || flushing || buffer.length === 0) return;
  flushing = true;
  const batch = buffer.splice(0, 50);
  try {
    const [{ data }, id] = await Promise.all([
      supabase.auth.getSession(),
      getInstallId(),
    ]);
    const userId = data.session?.user.id ?? null;
    const { error } = await supabase.from('app_events').insert(
      batch.map((r) => ({
        name: r.name,
        props: r.props as Json,
        created_at: r.created_at,
        install_id: id,
        user_id: userId,
        app_version: appVersion,
        platform: Platform.OS,
        os_version: String(Platform.Version ?? ''),
      })),
    );
    // Table missing or offline: keep feedback/crashes for one retry, drop the rest.
    if (error)
      buffer.unshift(
        ...batch.filter((r) => r.name === 'crash' || r.name === 'feedback'),
      );
  } catch {
    // never throw from telemetry
  } finally {
    flushing = false;
  }
}

/** Report an error with the screen it happened on. */
export function reportError(error: unknown, context: Props = {}) {
  const e = error instanceof Error ? error : new Error(String(error));
  track('crash', {
    message: e.message,
    stack: (e.stack ?? '').split('\n').slice(0, 6).join('\n'),
    ...context,
  });
}

let currentScreen = '';
export function setScreen(path: string) {
  if (path === currentScreen) return;
  currentScreen = path;
  track('screen', { path });
}

/** Call once at app start: periodic flush, flush on background, global error hook. */
export function startTelemetry() {
  if (isServer || timer) return;
  track('app_open');
  timer = setInterval(() => void flush(), FLUSH_EVERY_MS);
  AppState.addEventListener('change', (s) => {
    if (s !== 'active') void flush();
  });

  const g = globalThis as unknown as {
    ErrorUtils?: {
      getGlobalHandler: () => (e: unknown, fatal?: boolean) => void;
      setGlobalHandler: (h: (e: unknown, fatal?: boolean) => void) => void;
    };
  };
  if (g.ErrorUtils) {
    const prev = g.ErrorUtils.getGlobalHandler();
    g.ErrorUtils.setGlobalHandler((e, fatal) => {
      reportError(e, { fatal: Boolean(fatal), screen: currentScreen });
      prev(e, fatal);
    });
  } else if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('error', (ev) =>
      reportError(ev.error ?? ev.message, { screen: currentScreen }),
    );
  }
}

export const currentScreenPath = () => currentScreen;
