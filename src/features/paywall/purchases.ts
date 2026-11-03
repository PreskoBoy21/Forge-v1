import { Platform } from 'react-native';
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import { create } from 'zustand';

/**
 * RevenueCat subscriptions. Public SDK keys come from the RevenueCat
 * dashboard (safe to ship in the app). Entitlement id: "pro".
 */
const KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
});
export const ENTITLEMENT = 'pro';

type RC = typeof import('react-native-purchases').default;

function sdk(): RC | null {
  if (Platform.OS === 'web' || !KEY) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-purchases').default as RC;
  } catch {
    return null;
  }
}

type ProState = {
  ready: boolean;
  available: boolean;
  isPro: boolean;
  offering: PurchasesOffering | null;
};

export const usePro = create<ProState>(() => ({
  ready: false,
  available: false,
  isPro: false,
  offering: null,
}));

const apply = (info: CustomerInfo) =>
  usePro.setState({ isPro: Boolean(info.entitlements.active[ENTITLEMENT]) });

let configured = false;

/** Call once with the Supabase user id (or null when signed out). */
export async function initPurchases(userId: string | null) {
  const rc = sdk();
  if (!rc) {
    usePro.setState({ ready: true, available: false });
    return;
  }
  try {
    if (!configured) {
      rc.configure({ apiKey: KEY!, appUserID: userId ?? undefined });
      rc.addCustomerInfoUpdateListener(apply);
      configured = true;
    } else if (userId) {
      await rc.logIn(userId);
    } else {
      await rc.logOut().catch(() => undefined);
    }
    apply(await rc.getCustomerInfo());
    const offerings = await rc.getOfferings();
    usePro.setState({
      ready: true,
      available: Boolean(offerings.current),
      offering: offerings.current,
    });
  } catch {
    usePro.setState({ ready: true, available: false });
  }
}

export async function buy(
  pkg: PurchasesPackage,
): Promise<'done' | 'cancelled' | 'error'> {
  const rc = sdk();
  if (!rc) return 'error';
  try {
    const { customerInfo } = await rc.purchasePackage(pkg);
    apply(customerInfo);
    return 'done';
  } catch (e) {
    return (e as { userCancelled?: boolean }).userCancelled
      ? 'cancelled'
      : 'error';
  }
}

export async function restore(): Promise<boolean> {
  const rc = sdk();
  if (!rc) return false;
  try {
    const info = await rc.restorePurchases();
    apply(info);
    return Boolean(info.entitlements.active[ENTITLEMENT]);
  } catch {
    return false;
  }
}
