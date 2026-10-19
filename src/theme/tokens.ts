export const colors = {
  molten: { 500: '#FF5A1F' },
  ember: { 300: '#FFB224' },
  magenta: { 500: '#E8336D' },
  gradient: { forge: ['#FFB224', '#FF5A1F', '#E8336D'] as const },
  graphite: {
    950: '#0F1115',
    900: '#171A21',
    800: '#22262F',
    700: '#2E3340',
  },
  steel: { 400: '#8B93A7' },
  bone: { 50: '#F4F1EA', 100: '#F7F5F0' },
  light: { card: '#FFFDF9', border: '#DDD8CE', textSecondary: '#5B6273' },
  status: {
    success: '#3EE6B0',
    warning: '#F4C542',
    error: '#FF4D5E',
    info: '#4C8DFF',
  },
  macro: { protein: '#FF5A1F', carbs: '#4C8DFF', fat: '#F4C542' },
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
  shadowColor: '#FF5A1F',
  shadowOpacity: 0.35,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 0 },
} as const;
