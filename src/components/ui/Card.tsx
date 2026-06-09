import React from 'react';
import { View, ViewProps, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/typography';

interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
}

/** Soft, rounded surface card — the core visual unit of the app. */
export function Card({ children, onPress, padded = true, elevated = true, style, ...rest }: CardProps) {
  const { colors, isDark } = useTheme();

  const content = (
    <View
      {...rest}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: padded ? 18 : 0,
        },
        elevated && !isDark && styles.shadow,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
  },
  shadow: {
    shadowColor: '#0B1C3F',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
});
