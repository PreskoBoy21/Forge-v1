import type { Href } from 'expo-router';

export type PreviewLink = {
  title: string;
  hint: string;
  href: Href;
};

export type PreviewGroup = {
  title: string;
  links: PreviewLink[];
};

export const previewCatalog: PreviewGroup[] = [
  {
    title: 'Start',
    links: [
      { title: 'Welcome', hint: 'First impression', href: '/(auth)/welcome' },
      {
        title: 'Sign in',
        hint: 'Email / Apple / Google',
        href: '/(auth)/sign-in',
      },
    ],
  },
  {
    title: 'Onboarding',
    links: [
      { title: 'Age gate', hint: '18+ check', href: '/(onboarding)/age' },
      {
        title: 'Body',
        hint: 'Sex, year, height, weight',
        href: '/(onboarding)/body',
      },
      {
        title: 'Goal',
        hint: 'Fat / muscle / recomp',
        href: '/(onboarding)/goal',
      },
      {
        title: 'Training',
        hint: 'Days and equipment',
        href: '/(onboarding)/training',
      },
      {
        title: 'Diet',
        hint: 'Prefs and allergies',
        href: '/(onboarding)/diet',
      },
      {
        title: 'Coach style',
        hint: 'Buddy or strict',
        href: '/(onboarding)/coach-style',
      },
      {
        title: 'Your plan',
        hint: 'Targets + split',
        href: '/(onboarding)/your-plan',
      },
    ],
  },
  {
    title: 'Today',
    links: [{ title: 'Home', hint: 'Daily plan card', href: '/(tabs)/today' }],
  },
  {
    title: 'Food',
    links: [
      { title: 'Meals', hint: 'Macros and log', href: '/(tabs)/food' },
      { title: 'Scan', hint: 'Camera', href: '/(tabs)/food/scan' },
      { title: 'Review', hint: 'Edit AI items', href: '/(tabs)/food/review' },
      {
        title: 'Manual add',
        hint: 'Search or type',
        href: '/(tabs)/food/add-manual',
      },
    ],
  },
  {
    title: 'Train',
    links: [
      { title: 'Workout', hint: "Today's session", href: '/(tabs)/train' },
      {
        title: 'Log sets',
        hint: 'Timer + swap',
        href: '/(tabs)/train/session',
      },
      {
        title: 'History',
        hint: 'Past sessions',
        href: '/(tabs)/train/history',
      },
    ],
  },
  {
    title: 'Progress',
    links: [
      { title: 'Trend', hint: 'Weight + PRs', href: '/(tabs)/progress' },
      {
        title: 'Weekly check-in',
        hint: 'Coach summary',
        href: '/(tabs)/progress/checkin',
      },
    ],
  },
  {
    title: 'Profile',
    links: [
      {
        title: 'Settings',
        hint: 'Goal, health, disclaimer',
        href: '/(tabs)/profile',
      },
      { title: 'Paywall', hint: 'Forge Pro', href: '/(tabs)/profile/paywall' },
    ],
  },
];
