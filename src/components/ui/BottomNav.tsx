import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { fonts } from '../../theme/typography';

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
}

// Keep in sync with app/(tabs)/_layout.tsx — this bar mirrors it.
const ITEMS: NavItem[] = [
  { label: 'Home', icon: 'home', href: '/(tabs)' },
  { label: 'Bible', icon: 'book', href: '/(tabs)/bible' },
  { label: 'Plans', icon: 'calendar', href: '/(tabs)/plans' },
  { label: 'Media', icon: 'play-circle', href: '/(tabs)/media' },
  { label: 'Events', icon: 'people', href: '/(tabs)/events' },
  { label: 'Profile', icon: 'person-circle', href: '/(tabs)/you' },
];

/**
 * Persistent bottom navigation shown on secondary/detail screens that live
 * outside the tab group, so the primary destinations (and a way Home) are
 * always one tap away. The real Tabs bar shows on the tab screens themselves;
 * this mirrors it everywhere else.
 */
export function BottomNav() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 10) },
      ]}
      accessibilityRole="tablist"
    >
      {ITEMS.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => router.navigate(item.href)}
          accessibilityRole="tab"
          accessibilityLabel={item.label}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name={item.icon} size={24} color={colors.textMuted} />
          <AppText style={[styles.label, { color: colors.textMuted, fontFamily: fonts.semibold }]}>
            {item.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 2 },
  label: { fontSize: 12 },
});
