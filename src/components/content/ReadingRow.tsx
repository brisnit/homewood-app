import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';
import { BiblePassageRef } from '../../types/models';

interface Props {
  label: string;
  passage: BiblePassageRef;
  hasAudio?: boolean;
  onPress: () => void;
}

/** A single OT / NT / Psalm reading row inside the daily Bible card. */
export function ReadingRow({ label, passage, hasAudio, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}>
      <View style={[styles.dot, { backgroundColor: `${palette.slate}1A` }]}>
        <Ionicons name="book-outline" size={16} color={palette.slate} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="overline" tone="muted" weight="semibold">
          {label.toUpperCase()}
        </AppText>
        <AppText weight="semibold">{passage.reference}</AppText>
      </View>
      {hasAudio ? <Ionicons name="headset-outline" size={16} color={colors.success} style={{ marginRight: 8 }} /> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  dot: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
