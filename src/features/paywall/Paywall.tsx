import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { PurchasesPackage } from './purchases';

import { Button } from '@/components/Button';
import { LINKS } from '@/lib/links';

import { buy, restore, usePro } from './purchases';

const PERKS = [
  'Unlimited meal photo scans',
  'Daily AI coach read of your sleep, recovery and weight',
  'Calories that adjust every week from your real trend',
];

/** Shared paywall body (onboarding + You tab). `onDone` = continue/close. */
export function Paywall({ onDone }: { onDone: () => void }) {
  const { offering, available, isPro } = usePro();
  const pkgs = offering?.availablePackages ?? [];
  const annual = pkgs.find((p) => p.packageType === 'ANNUAL');
  const [picked, setPicked] = useState<PurchasesPackage | undefined>(
    annual ?? pkgs[0],
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const purchase = async () => {
    const pkg = picked ?? annual ?? pkgs[0];
    if (!pkg) return;
    setBusy(true);
    setMsg('');
    const r = await buy(pkg);
    setBusy(false);
    if (r === 'done') onDone();
    else if (r === 'error') setMsg('Purchase didn’t go through. Try again.');
  };

  if (isPro) {
    return (
      <View className="mt-6 gap-4">
        <Text className="font-uiSemi text-[17px] text-mint">
          You’re Pro. 🔥
        </Text>
        <Button label="Continue" onPress={onDone} />
      </View>
    );
  }

  return (
    <View className="mt-6">
      <View className="gap-2">
        {PERKS.map((p) => (
          <Text key={p} className="font-uiMedium text-[16px] text-bone">
            ✓ {p}
          </Text>
        ))}
      </View>

      {available ? (
        <View className="mt-6 gap-3">
          {pkgs.map((p) => {
            const on = picked?.identifier === p.identifier;
            const intro = p.product.introPrice;
            return (
              <Pressable
                key={p.identifier}
                onPress={() => setPicked(p)}
                className={`rounded-card border p-4 ${on ? 'border-molten bg-graphite-900' : 'border-graphite-800 bg-graphite-900'}`}
              >
                <View className="flex-row justify-between">
                  <Text className="font-uiSemi text-[16px] text-bone">
                    {p.packageType === 'ANNUAL'
                      ? 'Yearly'
                      : p.packageType === 'MONTHLY'
                        ? 'Monthly'
                        : p.product.title}
                  </Text>
                  <Text className="font-uiSemi text-[16px] text-bone">
                    {p.product.priceString}
                  </Text>
                </View>
                {intro && intro.price === 0 ? (
                  <Text className="mt-1 font-ui text-[13px] text-mint">
                    {intro.periodNumberOfUnits}-{intro.periodUnit.toLowerCase()}{' '}
                    free trial
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
          <Button
            label={
              busy
                ? 'One sec…'
                : picked?.product.introPrice?.price === 0
                  ? 'Start free trial'
                  : 'Go Pro'
            }
            disabled={busy || !picked}
            onPress={() => void purchase()}
          />
          {msg ? (
            <Text className="font-ui text-[14px] text-rose">{msg}</Text>
          ) : null}
          <Text className="font-ui text-[12px] leading-[17px] text-steel">
            Auto-renews until cancelled. Cancel any time in your App Store /
            Google Play settings, at least 24 hours before the period ends.
          </Text>
          <View className="flex-row justify-center gap-5">
            <Pressable
              onPress={() => void restore().then((ok) => ok && onDone())}
            >
              <Text className="font-uiMedium text-[13px] text-steel">
                Restore
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void WebBrowser.openBrowserAsync(LINKS.terms)}
            >
              <Text className="font-uiMedium text-[13px] text-steel">
                Terms
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void WebBrowser.openBrowserAsync(LINKS.privacy)}
            >
              <Text className="font-uiMedium text-[13px] text-steel">
                Privacy
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text className="mt-6 font-ui text-[14px] text-steel">
          Subscriptions open when Forge launches in the App Store and Google
          Play. Everything else works free for now.
        </Text>
      )}

      <View className="mt-4">
        <Button label="Continue free" variant="ghost" onPress={onDone} />
      </View>
    </View>
  );
}
