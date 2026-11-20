import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { deviceStorage } from '@/lib/storage';

/** Shows the plan choice once to free web users who never saw it. */
export const usePlanPrompt = create<{ seen: boolean; markSeen: () => void }>()(
  persist((set) => ({ seen: false, markSeen: () => set({ seen: true }) }), {
    name: 'forge-plan-prompt',
    storage: deviceStorage,
  }),
);
