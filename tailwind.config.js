/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#121614',
        surface: '#1B211E',
        ink: '#F2F3EC',
        muted: '#8A948E',
        lime: '#C6F24E',
        orange: '#FF8A50',
      },
      fontFamily: {
        heading: ['Oswald_600SemiBold'],
        headingBold: ['Oswald_700Bold'],
        body: ['DMSans_400Regular'],
        bodyMedium: ['DMSans_500Medium'],
        bodySemi: ['DMSans_600SemiBold'],
      },
    },
  },
  plugins: [],
};
