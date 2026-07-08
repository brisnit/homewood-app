/**
 * Homewood Living Ministries — typography tokens.
 * Primary: Raleway. Secondary (serif accents): Crimson Text.
 * Font family strings match the @expo-google-fonts exports loaded in app/_layout.tsx.
 */
export const fonts = {
  regular: 'Raleway_400Regular',
  medium: 'Raleway_500Medium',
  semibold: 'Raleway_600SemiBold',
  bold: 'Raleway_700Bold',
  serif: 'CrimsonText_400Regular',
  serifSemibold: 'CrimsonText_600SemiBold',
} as const;

/** Mobile type scale from the brand guidelines. */
export const typeScale = {
  h1: { fontSize: 40, lineHeight: 48 },
  h2: { fontSize: 32, lineHeight: 40 },
  h3: { fontSize: 28, lineHeight: 36 },
  h4: { fontSize: 24, lineHeight: 32 },
  h5: { fontSize: 19, lineHeight: 26 },
  h6: { fontSize: 17, lineHeight: 24 },
  bodyLarge: { fontSize: 19, lineHeight: 30 },
  body: { fontSize: 17, lineHeight: 26 },
  caption: { fontSize: 14, lineHeight: 20 },
  overline: { fontSize: 12, lineHeight: 16 },
} as const;

export type TypeVariant = keyof typeof typeScale;

/** Elder-friendly spacing scale (generous touch targets). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  card: 20,
  pill: 999,
} as const;
