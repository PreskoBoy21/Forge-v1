/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // 'class' lets the app pick light/dark itself (web crashes with 'media').
  darkMode: 'class',
  theme: {
    extend: {
      // Theme-aware: values come from CSS variables set in src/theme/theme.ts
      colors: {
        molten: 'rgb(var(--c-accent) / <alpha-value>)',
        ember: 'rgb(var(--c-aqua) / <alpha-value>)',
        magenta: 'rgb(var(--c-violet) / <alpha-value>)',
        graphite: {
          950: 'rgb(var(--c-bg) / <alpha-value>)',
          900: 'rgb(var(--c-card) / <alpha-value>)',
          800: 'rgb(var(--c-raised) / <alpha-value>)',
          700: 'rgb(var(--c-line) / <alpha-value>)',
        },
        steel: 'rgb(var(--c-muted) / <alpha-value>)',
        bone: 'rgb(var(--c-text) / <alpha-value>)',
        mint: 'rgb(var(--c-good) / <alpha-value>)',
        gold: 'rgb(var(--c-warn) / <alpha-value>)',
        rose: 'rgb(var(--c-bad) / <alpha-value>)',
        signal: 'rgb(var(--c-info) / <alpha-value>)',
        protein: 'rgb(var(--c-accent) / <alpha-value>)',
        carbs: 'rgb(var(--c-aqua) / <alpha-value>)',
        fat: 'rgb(var(--c-warn) / <alpha-value>)',
        volt: 'rgb(var(--c-accent) / <alpha-value>)',
        aqua: 'rgb(var(--c-aqua) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        ink: { 950: 'rgb(var(--c-bg) / <alpha-value>)', 900: 'rgb(var(--c-card) / <alpha-value>)', 800: 'rgb(var(--c-raised) / <alpha-value>)', 700: 'rgb(var(--c-line) / <alpha-value>)' },
      },
      fontFamily: {
        display: ['Archivo_800ExtraBold'],
        ui: ['Inter_400Regular'],
        uiMedium: ['Inter_500Medium'],
        uiSemi: ['Inter_600SemiBold'],
      },
      borderRadius: {
        card: 20,
        btn: 16,
        sheet: 28,
      },
    },
  },
  plugins: [],
};
