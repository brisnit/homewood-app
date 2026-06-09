import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';

interface ProgressBarProps {
  value: number; // 0..1
  color?: string;
  height?: number;
}

export function ProgressBar({ value, color = palette.pine, height = 8 }: ProgressBarProps) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height, backgroundColor: colors.surfaceAlt }]}>
      <View style={{ width: `${pct * 100}%`, height, backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: 999, overflow: 'hidden', width: '100%' },
});
