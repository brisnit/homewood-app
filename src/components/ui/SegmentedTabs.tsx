import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/typography';

interface SegmentedTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}

/** Pill segmented control used for Today/Community and account activity tabs. */
export function SegmentedTabs<T extends string>({ tabs, value, onChange }: SegmentedTabsProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && { backgroundColor: colors.surface }]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <AppText
              variant="caption"
              weight={active ? 'bold' : 'medium'}
              style={{ color: active ? colors.primary : colors.textMuted }}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
});
