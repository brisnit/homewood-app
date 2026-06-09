/**
 * Homewood Living Ministries — brand color tokens.
 * Mirrors `tailwind.config.js`. Use these for non-className styling
 * (StatusBar, gradients, SVG, navigation theming, etc.).
 */
export const palette = {
  navy: '#0B1C3F', // Primary – deep navy
  ink: '#07101F', // Body text on cream
  cream: '#F8F2E7', // Light ground / page background
  creamDeep: '#F1E7D6',
  sand: '#ECDDC7', // Cards / dividers on cream
  brass: '#C9A24B', // Primary accent – CTAs
  clay: '#C2613D', // Warm pop – highlights
  pine: '#3E7C6B', // Success / charts
  slate: '#34507A', // Links / secondary navy
  navySoft: '#1B2F52',
  muted: '#6B7385',
  white: '#FFFFFF',
} as const;

export type PaletteColor = keyof typeof palette;

/** Light + dark surfaces. "Low light" mode uses the dark scheme. */
export const colors = {
  light: {
    // Clean white app. Contrast comes from deep navy + light-gray separators.
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F3F7',
    text: '#0A1A33', // very dark navy
    textMuted: '#5B6472',
    primary: palette.navy,
    accent: palette.brass,
    highlight: palette.clay,
    success: palette.pine,
    link: palette.slate,
    border: '#E5E8EC',
  },
  dark: {
    background: '#0A1426',
    surface: '#11203B',
    surfaceAlt: '#172A49',
    text: '#F3EEE3',
    textMuted: '#9AA4B8',
    primary: palette.brass,
    accent: palette.brass,
    highlight: palette.clay,
    success: palette.pine,
    link: '#8FA8D6',
    border: '#22365A',
  },
} as const;

export type ColorScheme = keyof typeof colors;
// Structural (string-valued) so both light & dark schemes are assignable.
export type ThemeColors = { [K in keyof (typeof colors)['light']]: string };
