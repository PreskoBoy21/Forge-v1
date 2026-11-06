import { create } from 'zustand';

/**
 * Subscriptions are OFF for v1 (see src/lib/flags.ts), so the RevenueCat SDK
 * (react-native-purchases) is not installed: its iOS pod (PurchasesHybridCommon
 * 20.1.0) could not be resolved on EAS. The full RevenueCat version of this
 * file is in git history at 5c5a2de:src/features/paywall/purchases.ts.
 * To bring Pro back: install a react-native-purchases version whose iOS pod
 * resolves, restore that file, and set FLAGS.SUBSCRIPTIONS = true.
 */
export const ENTITLEMENT = 'pro';

/** Minimal shape the paywall UI needs (matches RevenueCat's package). */
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
  available: false,
  isPro: false,
  offering: null,
}));

export async function initPurchases(_userId: string | null) {
  usePro.setState({ ready: true, available: false });
}

export async function buy(
  _pkg: PurchasesPackage,
): Promise<'done' | 'cancelled' | 'error'> {
  return 'error';
}

export async function restore(): Promise<boolean> {
  return false;
}
