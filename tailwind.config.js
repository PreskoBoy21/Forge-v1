/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        molten: '#FF5A1F',
        ember: '#FFB224',
        magenta: '#E8336D',
        graphite: {
          950: '#0F1115',
          900: '#171A21',
          800: '#22262F',
          700: '#2E3340',
        },
        steel: '#8B93A7',
        bone: '#F4F1EA',
        mint: '#3EE6B0',
        gold: '#F4C542',
        rose: '#FF4D5E',
        signal: '#4C8DFF',
        protein: '#FF5A1F',
        carbs: '#4C8DFF',
        fat: '#F4C542',
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
