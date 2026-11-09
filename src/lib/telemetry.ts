import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';

import type { Json } from '@/types/database';

import { supabase } from './supabase';
import { cleanProps, type Props } from './telemetry-props';

export { cleanProps };

/**
 * First-party analytics, crash reports and feedback, stored in our own
 * Supabase table `app_events` (insert-only). No third-party SDK, no
 * advertising IDs, no names or emails in props.
 *
 * - Normal events are buffered in memory and sent in small batches; if a send
 *   fails they are dropped (telemetry must never break the app).
 * - Crashes and feedback are also saved on the device until the server has
 *   them, so a fatal crash is reported on the next launch and feedback is
 *   never lost.
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
const MAX_PENDING = 30;
const FLUSH_EVERY_MS = 20_000;
const INSTALL_KEY = 'forge-install-id';
const PENDING_KEY = 'forge-pending-events';

let buffer: Row[] = [];
let pending: Row[] = []; // crashes + feedback, mirrored to AsyncStorage
let installId: string | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let inFlight: Promise<boolean> | null = null;

const isServer = typeof window === 'undefined' && Platform.OS === 'web';
const appVersion = Constants.expoConfig?.version ?? null;
const important = (n: EventName) => n === 'crash' || n === 'feedback';

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

/** Install id, so account deletion can also remove pre-sign-in events. */
export const telemetryInstallId = () => getInstallId();

function savePending() {
  AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending)).catch(
    () => undefined,
  );
}

async function loadPending() {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const saved = raw ? (JSON.parse(raw) as Row[]) : [];
    if (Array.isArray(saved))
      pending = [...saved, ...pending].slice(-MAX_PENDING);
  } catch {
    // ignore corrupt storage
  }
}

/** Record one event. Cheap and safe to call anywhere. */
export function track(name: EventName, props?: Props) {
  if (isServer) return;
  const row = {
    name,
    props: cleanProps(props),
    created_at: new Date().toISOString(),
  };
  if (important(name)) {
    pending = [...pending, row].slice(-MAX_PENDING);
    savePending();
    void flush();
    return;
  }
  buffer.push(row);
  if (buffer.length > MAX_BUFFER) buffer = buffer.slice(-MAX_BUFFER);
}

async function send(): Promise<boolean> {
  if (!supabase) return false;
  const batch = buffer.splice(0, 50);
  const urgent = pending.slice();
  if (!batch.length && !urgent.length) return true;
  try {
    const [{ data }, id] = await Promise.all([
      supabase.auth.getSession(),
      getInstallId(),
    ]);
    const userId = data.session?.user.id ?? null;
    const { error } = await supabase.from('app_events').insert(
      [...urgent, ...batch].map((r) => ({
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
    if (error) return false; // normal events dropped, crashes/feedback stay pending
    pending = pending.filter((r) => !urgent.includes(r));
    savePending();
    return true;
  } catch {
    return false;
  }
}

/**
 * Send what's waiting. Resolves true when crashes/feedback are safely on the
 * server (or there was nothing to send). Never throws.
 */
export async function flush(): Promise<boolean> {
  if (inFlight) await inFlight;
  inFlight = send();
  try {
    return await inFlight;
  } finally {
    inFlight = null;
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

/** Call once at app start: send leftovers, periodic flush, error hooks. */
export function startTelemetry() {
  if (isServer || timer) return;
  track('app_open');
  void loadPending().then(() => flush());
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
      // Saved to the device first, so a fatal crash is sent on next launch.
      reportError(e, { fatal: Boolean(fatal), screen: currentScreen });
      prev(e, fatal);
    });
  } else if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('error', (ev) =>
      reportError(ev.error ?? ev.message, { screen: currentScreen }),
    );
    window.addEventListener('unhandledrejection', (ev) =>
      reportError(ev.reason, { screen: currentScreen, promise: true }),
    );
  }
}

export const currentScreenPath = () => currentScreen;
