/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        molten: '#C6F24E',
        ember: '#47D7E8',
        magenta: '#9B8CFF',
        graphite: {
          950: '#0A0C10',
          900: '#12151B',
          800: '#1B1F27',
          700: '#282D38',
        },
        steel: '#8C95A6',
        bone: '#EEF1F5',
        mint: '#4ADE9A',
        gold: '#FFC542',
        rose: '#FF5D6C',
        signal: '#5B9DFF',
        protein: '#C6F24E',
        carbs: '#47D7E8',
        fat: '#FFC542',
        volt: '#C6F24E',
        aqua: '#47D7E8',
        violet: '#9B8CFF',
        ink: { 950: '#0A0C10', 900: '#12151B', 800: '#1B1F27', 700: '#282D38' },
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
