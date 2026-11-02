import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const isServer = typeof window === 'undefined' && Platform.OS === 'web';

const noop: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/** Device storage for zustand `persist` (no-op during web static render). */
export const deviceStorage = createJSONStorage(() =>
  isServer ? noop : AsyncStorage,
);
