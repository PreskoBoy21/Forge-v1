/**
 * Palette v2 — "Volt on Ink".
 * Ink surfaces (deep blue-black), Volt for action and progress,
 * Aqua for body/health data, Violet for sleep & recovery.
 * Legacy token names (molten, ember, graphite, bone, steel) are kept so every
 * screen picks up the new palette without renaming classes; new code should
 * prefer the semantic names in `palette`.
 */
export const palette = {
  ink: { 950: '#0A0C10', 900: '#12151B', 800: '#1B1F27', 700: '#282D38' },
  volt: '#C6F24E',
  aqua: '#47D7E8',
  violet: '#9B8CFF',
  text: '#EEF1F5',
  muted: '#8C95A6',
  good: '#4ADE9A',
  warn: '#FFC542',
  bad: '#FF5D6C',
  info: '#5B9DFF',
} as const;

export const colors = {
  molten: { 500: palette.volt },
  ember: { 300: palette.aqua },
  magenta: { 500: palette.violet },
  gradient: { forge: [palette.volt, palette.aqua] as const },
  graphite: palette.ink,
  steel: { 400: palette.muted },
  bone: { 50: palette.text, 100: '#F6F8FA' },
  light: { card: '#FFFFFF', border: '#DCE1E8', textSecondary: '#556070' },
  status: {
    success: palette.good,
    warning: palette.warn,
    error: palette.bad,
    info: palette.info,
  },
  macro: { protein: palette.volt, carbs: palette.aqua, fat: palette.warn },
  health: {
    weight: palette.aqua,
    bodyFat: palette.warn,
    lean: palette.volt,
    sleep: palette.violet,
    heart: palette.bad,
    steps: palette.info,
  },
} as const;

export const fonts = {
  display: 'Archivo_800ExtraBold',
  ui: 'Inter_500Medium',
  uiRegular: 'Inter_400Regular',
  uiSemibold: 'Inter_600SemiBold',
} as const;

export const type = {
  score: 56,
  title: 34,
  heading: 24,
  body: 17,
  secondary: 15,
  caption: 13,
} as const;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;
export const radius = { card: 20, button: 16, sheet: 28, pill: 999 } as const;
export const touch = { min: 48, gym: 64 } as const;
export const glow = {
  shadowColor: palette.volt,
  shadowOpacity: 0.35,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 0 },
} as const;
