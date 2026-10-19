export type PreviewLink = { title: string; hint: string; href: string };
export type PreviewGroup = { title: string; links: PreviewLink[] };

export const previewCatalog: PreviewGroup[] = [
  {
    title: 'Start',
    links: [{ title: 'Hook', hint: 'Stop guessing', href: '/(auth)/welcome' }],
  },
  {
    title: 'Onboarding',
    links: [
      { title: 'Goal', hint: 'One tap', href: '/(onboarding)/goal' },
      { title: 'Body', hint: '18+ and sliders', href: '/(onboarding)/body' },
      { title: 'Training', hint: 'Gym chain', href: '/(onboarding)/training' },
      { title: 'Food', hint: 'What you hate', href: '/(onboarding)/food' },
      { title: 'Coach', hint: 'Hear a line', href: '/(onboarding)/coach' },
      { title: 'Forging…', hint: '3-sec build', href: '/(onboarding)/forging' },
      { title: 'Plan reveal', hint: 'The aha', href: '/(onboarding)/plan' },
      {
        title: 'Notifications',
        hint: 'Daily Call 07:30',
        href: '/(onboarding)/notify',
      },
      {
        title: 'Paywall',
        hint: 'Continue free',
        href: '/(onboarding)/paywall',
      },
    ],
  },
  {
    title: 'The loop',
    links: [
      { title: 'Daily Call', hint: 'Today', href: '/(tabs)/today' },
      {
        title: 'Forge the Day',
        hint: 'Evening ritual',
        href: '/(tabs)/today/forge-day',
      },
      { title: 'Gym Mode', hint: 'Sweaty hands', href: '/(tabs)/train/gym' },
      { title: 'Snap', hint: 'Camera', href: '/(tabs)/snap' },
      { title: 'Crew', hint: 'Who forged', href: '/(tabs)/crew' },
      { title: 'You', hint: 'Progress + settings', href: '/(tabs)/you' },
      { title: 'Weekly Verdict', hint: 'Sunday', href: '/(tabs)/you/verdict' },
      {
        title: 'Forged Card',
        hint: 'Shareable 9:16',
        href: '/(tabs)/you/card',
      },
    ],
  },
];
