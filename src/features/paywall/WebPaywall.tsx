import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Check, X } from '@/components/icons';
import { useSession } from '@/features/auth/session';
import { BILLING, billingReady, checkoutUrl } from '@/lib/billing';
import { LINKS } from '@/lib/links';
import { go } from '@/lib/nav';
import { track } from '@/lib/telemetry';
import { useColors } from '@/theme/theme';

import { refreshPro, usePro } from './purchases';

/** What Pro unlocks (also used by upsell cards). */
export const PRO_PERKS = [
  'Your AI coach: today’s plan, meal times and the “why” behind every tip',
  'Unlimited meal photo scans',
  'Full history: 30-day sleep, strength and volume graphs',
  'Weekly muscle map + Weekly Verdict',
];

/** What the free plan keeps. */
const FREE_YES = [
  'Today’s workout with exact weights',
  'Exercise animations',
  'Daily check-in + last 7 nights of sleep',
  'Food log by barcode and search',
];
const FREE_NO = [
  'AI coach day plan and “why” explanations',
  'Unlimited photo scans (Free: 3 a week)',
  '30-day history and progress graphs',
  'Weekly muscle map and Weekly Verdict',
];

const open = (url: string) => {
  if (typeof window !== 'undefined') window.location.href = url;
  else void Linking.openURL(url);
};

function Line({ ok, text }: { ok: boolean; text: string }) {
  const c = useColors();
  return (
    <View className="flex-row items-start py-1">
      <View className="mt-0.5 w-6">
        {ok ? (
          <Check size={17} color={c.accent} strokeWidth={3} />
        ) : (
          <X size={17} color={c.muted} strokeWidth={2.5} />
        )}
      </View>
      <Text
        className={`flex-1 font-ui text-[15px] leading-[21px] ${ok ? 'text-bone' : 'text-steel'}`}
      >
        {text}
      </Text>
    </View>
  );
}

/**
 * Web plan choice: Forge Pro (recommended) or Free, side by side,
 * so people pick consciously. Stripe Payment Links do the payment.
 */
export function WebPaywall({ onDone }: { onDone: () => void }) {
  const isPro = usePro((s) => s.isPro);
  const session = useSession((s) => s.session);
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [checking, setChecking] = useState(false);

  if (isPro) {
    return (
      <View className="mt-6 gap-4">
        <Text className="font-uiSemi text-[17px] text-mint">
          You’re Pro. 🔥
        </Text>
        {BILLING.portal ? (
          <Button
            label="Manage subscription"
            variant="secondary"
            onPress={() => open(BILLING.portal)}
          />
        ) : null}
        <Button label="Continue" onPress={onDone} />
      </View>
    );
  }

  const buy = () => {
    track('screen', { path: `checkout_${plan}` });
    if (!session) return go('/(auth)/sign-in');
    open(checkoutUrl(BILLING[plan], session.user.id, session.user.email));
  };
  const price =
    plan === 'yearly'
      ? {
          big: BILLING.prices.yearlyPerMonth,
          small: '/ month',
          note: `${BILLING.prices.yearly} billed yearly · save 50%`,
        }
      : {
          big: BILLING.prices.monthly,
          small: '/ month',
          note: 'Billed monthly · cancel any time',
        };

  return (
    <View className="mt-5">
      {/* PRO */}
      <View className="rounded-card border-2 border-molten bg-graphite-900 p-5">
        <View className="flex-row items-center justify-between">
          <Text className="font-display text-[26px] uppercase text-bone">
            Forge <Text className="text-molten">Pro</Text>
          </Text>
          <View className="rounded-full bg-molten px-3 py-1">
            <Text className="font-uiSemi text-[12px]" style={{ color: '#000' }}>
              RECOMMENDED
            </Text>
          </View>
        </View>

        {billingReady() ? (
          <>
            <View className="mt-4 flex-row rounded-xl bg-graphite-800 p-1">
              {(['yearly', 'monthly'] as const).map((p) => (
                <Pressable
                  key={p}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: plan === p }}
                  onPress={() => setPlan(p)}
                  className={`flex-1 items-center rounded-lg py-2 ${plan === p ? 'bg-graphite-950' : ''}`}
                >
                  <Text
                    className={`font-uiSemi text-[14px] ${plan === p ? 'text-bone' : 'text-steel'}`}
                  >
                    {p === 'yearly' ? 'Yearly · −50%' : 'Monthly'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="mt-4 flex-row items-end">
              <Text className="font-display text-[44px] leading-[48px] text-bone">
                {price.big}
              </Text>
              <Text className="mb-1.5 ml-1 font-ui text-[15px] text-steel">
                {price.small}
              </Text>
            </View>
            <Text className="font-ui text-[13px] text-mint">{price.note}</Text>
          </>
        ) : null}

        <View className="mt-4">
          {PRO_PERKS.map((p) => (
            <Line key={p} ok text={p} />
          ))}
          {FREE_YES.slice(0, 2).map((p) => (
            <Line key={p} ok text={p} />
          ))}
        </View>

        <View className="mt-5">
          {billingReady() ? (
            <Button
              label={session ? 'Start Pro' : 'Start Pro · create account'}
              size="gym"
              onPress={buy}
            />
          ) : (
            <Text className="font-ui text-[14px] text-steel">
              Forge Pro opens in a few days.
            </Text>
          )}
        </View>
        <Text className="mt-3 text-center font-ui text-[12px] leading-[17px] text-steel">
          Secure payment by Stripe. Renews automatically, cancel any time.
        </Text>
      </View>

      {/* FREE */}
      <View className="mt-4 rounded-card border border-graphite-700 bg-graphite-900 p-5">
        <View className="flex-row items-end justify-between">
          <Text className="font-display text-[22px] uppercase text-bone">
            Free
          </Text>
          <Text className="font-display text-[22px] text-steel">€0</Text>
        </View>
        <View className="mt-3">
          {FREE_YES.map((p) => (
            <Line key={p} ok text={p} />
          ))}
          {FREE_NO.map((p) => (
            <Line key={p} ok={false} text={p} />
          ))}
        </View>
        <View className="mt-4">
          <Button
            label="Continue with Free"
            variant="secondary"
            onPress={onDone}
          />
        </View>
      </View>

      <View className="mt-4 flex-row justify-center gap-5">
        <Pressable
          onPress={() => {
            setChecking(true);
            void refreshPro().finally(() => setChecking(false));
          }}
        >
          <Text className="font-uiMedium text-[13px] text-steel">
            {checking ? 'Checking…' : 'Already paid? Refresh'}
          </Text>
        </Pressable>
        <Pressable onPress={() => open(LINKS.terms)}>
          <Text className="font-uiMedium text-[13px] text-steel">Terms</Text>
        </Pressable>
      </View>
    </View>
  );
}
