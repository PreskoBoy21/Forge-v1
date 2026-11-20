import { Platform } from 'react-native';
import { create } from 'zustand';

import { billingReady } from '@/lib/billing';
import { FLAGS } from '@/lib/flags';
import { supabase } from '@/lib/supabase';

/**
 * Forge Pro status.
 * - Web: Stripe (Payment Links + stripe-webhook) sets profiles.is_pro; the app
 *   just reads it.
 * - iOS/Android: in-app purchases aren't set up yet (RevenueCat version is in
 *   git history at 5c5a2de), so native builds stay on the free launch rules.
 */
export const ENTITLEMENT = 'pro';

/** Minimal shape the native paywall UI needs (matches RevenueCat's package). */
export type PurchasesPackage = {
  identifier: string;
  packageType: string;
  product: {
    title: string;
    priceString: string;
    introPrice?: {
      price: number;
      priceString: string;
      periodNumberOfUnits: number;
      periodUnit: string;
    } | null;
  };
};

type ProState = {
  ready: boolean;
  available: boolean;
  isPro: boolean;
  offering: { availablePackages: PurchasesPackage[] } | null;
};

export const usePro = create<ProState>(() => ({
  ready: true,
  available: Platform.OS === 'web' && billingReady(),
  isPro: false,
  offering: null,
}));

let currentUser: string | null = null;

/** Re-read is_pro from the user's profile (web subscriptions). */
export async function refreshPro(): Promise<boolean> {
  if (!supabase || !currentUser) {
    usePro.setState({ isPro: false });
    return false;
  }
  const { data } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', currentUser)
    .maybeSingle();
  const isPro = Boolean(data?.is_pro);
  usePro.setState({ isPro });
  return isPro;
}

export async function initPurchases(userId: string | null) {
  currentUser = userId;
  usePro.setState({
    ready: true,
    available: Platform.OS === 'web' && billingReady(),
  });
  const isPro = await refreshPro();
  // Just back from Stripe (…/you?pro=1): the webhook may take a few seconds.
  if (
    !isPro &&
    userId &&
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('pro') === '1'
  ) {
    for (let i = 0; i < 10 && !(await refreshPro()); i++)
      await new Promise((r) => setTimeout(r, 2000));
  }
}

export async function buy(
  _pkg: PurchasesPackage,
): Promise<'done' | 'cancelled' | 'error'> {
  return 'error';
}

export async function restore(): Promise<boolean> {
  return refreshPro();
}

/** Web free plan: the AI coach and Weekly Verdict are Pro. */
export const useProLocked = () => {
  const isPro = usePro((s) => s.isPro);
  return FLAGS.SUBSCRIPTIONS && !isPro;
};
