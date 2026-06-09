import React from 'react';
import { Pressable, PressableProps, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { palette } from '../../theme/colors';
import { radius } from '../../theme/typography';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

const heights: Record<Size, number> = { sm: 40, md: 52, lg: 58 };

/** Primary CTA = navy fill / brass accent per brand button styles. */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const palettes: Record<Variant, { bg: string; border: string; fg: string }> = {
    primary: { bg: palette.navy, border: palette.navy, fg: palette.cream },
    secondary: { bg: palette.sand, border: palette.sand, fg: palette.navy },
    tertiary: { bg: 'transparent', border: 'transparent', fg: palette.navy },
    ghost: { bg: 'transparent', border: palette.navy, fg: palette.navy },
  };
  const c = palettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: heights[size],
          backgroundColor: c.bg,
          borderColor: c.border,
          opacity: isDisabled ? 0.55 : pressed ? 0.9 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? 20 : 24,
        },
        style as object,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={c.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={20} color={c.fg} style={styles.iconLeft} /> : null}
          <AppText weight="semibold" variant={size === 'sm' ? 'caption' : 'body'} style={{ color: c.fg }}>
            {label}
          </AppText>
          {iconRight ? (
            <Ionicons name={iconRight} size={18} color={c.fg} style={styles.iconRight} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});
