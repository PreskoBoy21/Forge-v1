import { Platform } from 'react-native';

/**
 * Launch switches.
 * SUBSCRIPTIONS: Forge Pro is sold on the web (Stripe). Native builds stay
 * free until Apple/Google in-app purchases are set up.
 */
export const FLAGS = {
  // EXPO_PUBLIC_STORE_SHOTS=1: web build that looks like the iPhone app
  // (no paywall), only used to make App Store screenshots.
  SUBSCRIPTIONS:
    Platform.OS === 'web' && process.env.EXPO_PUBLIC_STORE_SHOTS !== '1',
} as const;
