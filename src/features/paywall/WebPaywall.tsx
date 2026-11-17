import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { useSession } from '@/features/auth/session';
import { BILLING, billingReady, checkoutUrl } from '@/lib/billing';
import { LINKS } from '@/lib/links';
import { go } from '@/lib/nav';
import { track } from '@/lib/telemetry';

import { refreshPro, usePro } from './purchases';

export const PRO_PERKS = [
  'Unlimited AI meal photo scans',
  'Your AI coach: a daily read of sleep, training and food',
  'Weekly Verdict: one clear change for next week',
];

const open = (url: string) => {
  if (typeof window !== 'undefined') window.location.href = url;
  else void Linking.openURL(url);
};

function PlanRow({
  on,
  onPress,
  title,
  price,
  note,
}: {
  on: boolean;
  onPress: () => void;
  title: string;
  price: string;
  note?: string;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      className={`rounded-card border-2 bg-graphite-900 p-4 ${on ? 'border-molten' : 'border-graphite-800'}`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="font-uiSemi text-[17px] text-bone">{title}</Text>
        <Text className="font-uiSemi text-[17px] text-bone">{price}</Text>
      </View>
      {note ? (
        <Text className="mt-1 font-ui text-[13px] text-mint">{note}</Text>
      ) : null}
    </Pressable>
  );
}

/** Web paywall: Stripe Payment Links, monthly or yearly. */
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
    if (!session) return go('/(auth)/sign-in');
    track('screen', { path: `checkout_${plan}` });
    open(checkoutUrl(BILLING[plan], session.user.id, session.user.email));
  };

  return (
    <View className="mt-6">
      <View className="gap-2">
        {PRO_PERKS.map((p) => (
          <Text key={p} className="font-uiMedium text-[16px] text-bone">
            ✓ {p}
          </Text>
        ))}
      </View>

      {billingReady() ? (
        <View className="mt-6 gap-3">
          <PlanRow
            on={plan === 'yearly'}
            onPress={() => setPlan('yearly')}
            title="Yearly"
            price={`${BILLING.prices.yearly} / year`}
            note={`Just ${BILLING.prices.yearlyPerMonth} a month · save 50%`}
          />
          <PlanRow
            on={plan === 'monthly'}
            onPress={() => setPlan('monthly')}
            title="Monthly"
            price={`${BILLING.prices.monthly} / month`}
          />
          <Button
            label={session ? 'Go Pro' : 'Create a free account first'}
            onPress={buy}
          />
          <Text className="font-ui text-[12px] leading-[17px] text-steel">
            Secure payment by Stripe. Renews automatically, cancel any time in
            Manage subscription.
          </Text>
          <View className="flex-row justify-center gap-5">
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
              <Text className="font-uiMedium text-[13px] text-steel">
                Terms
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text className="mt-6 font-ui text-[14px] text-steel">
          Forge Pro opens in a few days. Everything else works free for now.
        </Text>
      )}

      <View className="mt-4">
        <Button label="Continue free" variant="ghost" onPress={onDone} />
      </View>
    </View>
  );
}
