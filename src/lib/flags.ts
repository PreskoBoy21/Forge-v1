import { Platform } from 'react-native';

/**
 * Launch switches.
 * SUBSCRIPTIONS: Forge Pro is sold on the web (Stripe). Native builds stay
 * free until Apple/Google in-app purchases are set up.
 */
export const FLAGS = {
  SUBSCRIPTIONS: Platform.OS === 'web',
} as const;
