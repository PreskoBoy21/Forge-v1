import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { deviceStorage } from '@/lib/storage';

/**
 * Daily reminder ("Daily call") as a local notification.
 * No server or push token needed: the phone schedules it itself.
 */
type N = typeof import('expo-notifications');
let mod: N | null | undefined;
function notifications(): N | null {
  if (mod !== undefined) return mod;
  if (Platform.OS === 'web') return (mod = null);
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('expo-notifications') as N;
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    mod = null;
  }
  return mod;
}

export const REMINDER_TIMES = [
  { hour: 7, minute: 30 },
  { hour: 12, minute: 0 },
  { hour: 17, minute: 30 },
  { hour: 20, minute: 0 },
] as const;

export const timeLabel = (h: number, m: number) =>
  `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

type ReminderState = {
  enabled: boolean;
  hour: number;
  minute: number;
  set: (s: Partial<Pick<ReminderState, 'enabled' | 'hour' | 'minute'>>) => void;
};

export const useReminder = create<ReminderState>()(
  persist(
    (set) => ({
      enabled: false,
      hour: 7,
      minute: 30,
      set: (s) => set(s),
    }),
    {
      name: 'forge-reminder',
      storage: deviceStorage,
      partialize: (s) => ({
        enabled: s.enabled,
        hour: s.hour,
        minute: s.minute,
      }),
    },
  ),
);

const BODY = [
  'Your plan for today is ready. Check your readiness and go.',
  'Today’s workout and weights are waiting. 2 minutes to see the plan.',
  'How did you sleep? Your coach adjusted today’s plan.',
];

/** Ask permission (once) and schedule the daily reminder. */
export async function enableReminder(hour: number, minute: number) {
  const n = notifications();
  if (!n) return false;
  try {
    let { status } = await n.getPermissionsAsync();
    if (status !== 'granted') {
      ({ status } = await n.requestPermissionsAsync());
    }
    if (status !== 'granted') {
      useReminder.getState().set({ enabled: false });
      return false;
    }
    if (Platform.OS === 'android') {
      await n.setNotificationChannelAsync('daily', {
        name: 'Daily plan',
        importance: n.AndroidImportance.DEFAULT,
      });
    }
    await n.cancelAllScheduledNotificationsAsync();
    await n.scheduleNotificationAsync({
      content: {
        title: 'Forge',
        body: BODY[new Date().getDate() % BODY.length]!,
      },
      trigger: {
        type: n.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: 'daily',
      },
    });
    useReminder.getState().set({ enabled: true, hour, minute });
    return true;
  } catch {
    return false;
  }
}

export async function disableReminder() {
  useReminder.getState().set({ enabled: false });
  const n = notifications();
  if (!n) return;
  await n.cancelAllScheduledNotificationsAsync().catch(() => undefined);
}
