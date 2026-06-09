/** @type {import('tailwindcss').Config} */
// Homewood Living Ministries brand palette + type scale.
// Source of truth mirrored in src/theme/colors.ts (keep in sync).
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: '#0B1C3F', // Primary – deep navy
        ink: '#07101F', // Body text on cream
        cream: '#F8F2E7', // Light ground / page background
        sand: '#ECDDC7', // Cards / dividers on cream
        brass: '#C9A24B', // Primary accent – CTAs
        clay: '#C2613D', // Warm pop – highlights
        pine: '#3E7C6B', // Success / charts
        slate: '#34507A', // Links / secondary navy
        // Convenience tints
        'cream-deep': '#F1E7D6',
        'navy-soft': '#1B2F52',
        muted: '#6B7385',
      },
      fontFamily: {
        // Raleway = primary UI font; Crimson = serif accents.
        sans: ['Raleway_400Regular'],
        'sans-medium': ['Raleway_500Medium'],
        'sans-semibold': ['Raleway_600SemiBold'],
        'sans-bold': ['Raleway_700Bold'],
        serif: ['CrimsonText_400Regular'],
        'serif-medium': ['CrimsonText_600SemiBold'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
