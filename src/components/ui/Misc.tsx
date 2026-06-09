import React from 'react';
import { View, Pressable, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';

export function Divider({ spacing = 0 }: { spacing?: number }) {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing }} />;
}

export function IconButton({
  icon,
  onPress,
  color,
  size = 22,
  accessibilityLabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  size?: number;
  accessibilityLabel?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
    >
      <Ionicons name={icon} size={size} color={color ?? colors.text} />
    </Pressable>
  );
}

/** Settings / list row with optional leading icon, value text, chevron or switch. */
export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  danger,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  danger?: boolean;
}) {
  const { colors } = useTheme();
  const labelColor = danger ? colors.highlight : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !toggle}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : undefined]}
    >
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name={icon} size={18} color={danger ? colors.highlight : colors.primary} />
        </View>
      ) : null}
      <AppText weight="medium" style={{ flex: 1, color: labelColor }}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="caption" tone="muted" style={{ marginRight: 6 }}>
          {value}
        </AppText>
      ) : null}
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ true: palette.pine, false: colors.border }}
          thumbColor="#FFF"
        />
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
