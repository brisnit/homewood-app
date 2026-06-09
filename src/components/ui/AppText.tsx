import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { fonts, typeScale, TypeVariant } from '../../theme/typography';
import { useTheme } from '../../theme/ThemeProvider';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
type Tone = 'default' | 'muted' | 'inverse' | 'accent' | 'link' | 'highlight' | 'success';

interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  weight?: Weight;
  serif?: boolean;
  tone?: Tone;
  center?: boolean;
}

const weightToFont: Record<Weight, string> = {
  regular: fonts.regular,
  medium: fonts.medium,
  semibold: fonts.semibold,
  bold: fonts.bold,
};

/**
 * Brand-aware Text. Defaults to Raleway; `serif` switches to Crimson Text.
 * Use `variant` for the type scale and `tone` for semantic color.
 */
export function AppText({
  variant = 'body',
  weight = 'regular',
  serif = false,
  tone = 'default',
  center = false,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  const toneColor: Record<Tone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    inverse: '#F8F2E7',
    accent: colors.accent,
    link: colors.link,
    highlight: colors.highlight,
    success: colors.success,
  };

  const fontFamily = serif
    ? weight === 'regular'
      ? fonts.serif
      : fonts.serifSemibold
    : weightToFont[weight];

  return (
    <Text
      {...rest}
      style={[
        typeScale[variant],
        { fontFamily, color: toneColor[tone] },
        center && styles.center,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
