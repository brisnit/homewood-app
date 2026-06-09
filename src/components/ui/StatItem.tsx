import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme } from '../../theme/ThemeProvider';

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  count: number | string;
  onPress?: () => void;
  active?: boolean;
}

/** Icon + count cluster used on the Verse of the Day card (likes/chats/downloads). */
export function StatItem({ icon, count, onPress, active = false }: StatItemProps) {
  const { colors } = useTheme();
  const color = active ? colors.highlight : colors.textMuted;
  return (
    <Pressable onPress={onPress} disabled={!onPress} hitSlop={6}>
      <View style={styles.row}>
        <Ionicons name={icon} size={18} color={color} />
        <AppText variant="caption" weight="medium" style={{ color, marginLeft: 5 }}>
          {count}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
