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

const DARK = {
  bg: '#0A0C10',
  card: '#12151B',
  raised: '#1B1F27',
  line: '#282D38',
  text: '#EEF1F5',
  muted: '#8C95A6',
  accent: '#C6F24E',
  aqua: '#47D7E8',
  violet: '#9B8CFF',
  good: '#4ADE9A',
  warn: '#FFC542',
  bad: '#FF5D6C',
  info: '#5B9DFF',
};

const LIGHT: typeof DARK = {
  bg: '#F3F5F8',
  card: '#FFFFFF',
  raised: '#E9EDF2',
  line: '#DCE2EA',
  text: '#11141A',
  muted: '#5F6B7C',
  accent: '#4C8A0C',
  aqua: '#0B8EA0',
  violet: '#6B58DD',
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
  persist((set) => ({ mode: 'light', setMode: (mode) => set({ mode }) }), {
    name: 'forge-theme',
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
