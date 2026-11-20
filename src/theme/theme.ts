import { vars } from 'nativewind';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { deviceStorage } from '@/lib/storage';

/**
 * Light (default) and dark themes.
 * Every Tailwind colour class (bg-graphite-900, text-bone, text-molten…)
 * reads a CSS variable, so one `vars()` at the root re-themes the whole app.
 * Use `useColors()` where a raw colour is needed (SVG charts, icons).
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type Scheme = 'light' | 'dark';

/** Black & Orange (chosen by Presko 2026-11-20). */
const DARK = {
  bg: '#000000',
  card: '#111111',
  raised: '#1C1C1C',
  line: '#262626',
  text: '#FFFFFF',
  muted: '#8E8E8E',
  accent: '#FF6A1A',
  aqua: '#FFFFFF',
  violet: '#B8B8B8',
  good: '#4ADE9A',
  warn: '#FFC542',
  bad: '#FF5D6C',
  info: '#5B9DFF',
};

const LIGHT: typeof DARK = {
  bg: '#F4F4F4',
  card: '#FFFFFF',
  raised: '#EAEAEA',
  line: '#DEDEDE',
  text: '#0A0A0A',
  muted: '#6B6B6B',
  accent: '#E8580C',
  aqua: '#0A0A0A',
  violet: '#5C5C5C',
  good: '#0F9A62',
  warn: '#B7791F',
  bad: '#D63445',
  info: '#2F6FDB',
};

export const PALETTE: Record<Scheme, typeof DARK> = {
  light: LIGHT,
  dark: DARK,
};
export type Colors = typeof DARK;

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const toVars = (c: Colors) =>
  vars({
    '--c-bg': rgb(c.bg),
    '--c-card': rgb(c.card),
    '--c-raised': rgb(c.raised),
    '--c-line': rgb(c.line),
    '--c-text': rgb(c.text),
    '--c-muted': rgb(c.muted),
    '--c-accent': rgb(c.accent),
    '--c-aqua': rgb(c.aqua),
    '--c-violet': rgb(c.violet),
    '--c-good': rgb(c.good),
    '--c-warn': rgb(c.warn),
    '--c-bad': rgb(c.bad),
    '--c-info': rgb(c.info),
  });

export const THEME_VARS = { light: toVars(LIGHT), dark: toVars(DARK) };

type ThemeState = { mode: ThemeMode; setMode: (m: ThemeMode) => void };

export const useTheme = create<ThemeState>()(
  persist((set) => ({ mode: 'dark', setMode: (mode) => set({ mode }) }), {
    name: 'forge-theme-v2',
    storage: deviceStorage,
  }),
);

export function useScheme(): Scheme {
  const mode = useTheme((s) => s.mode);
  const system = useColorScheme();
  if (mode === 'system') return system === 'dark' ? 'dark' : 'light';
  return mode;
}

export function useColors(): Colors {
  return PALETTE[useScheme()];
}
