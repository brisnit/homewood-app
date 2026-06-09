import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../../theme/ThemeProvider';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <AppText variant="h5" weight="bold">
        {title}
      </AppText>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
