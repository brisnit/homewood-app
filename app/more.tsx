import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, IconButton } from '../src/components/ui';
import { useAuth } from '../src/auth/AuthProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { can, Capability } from '../src/lib/roles';

interface Entry {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
  tint: string;
  capability?: Capability;
}

const ENTRIES: Entry[] = [
  { label: 'Bible', description: 'Read the full Bible', icon: 'book', href: '/(tabs)/bible', tint: palette.navy, capability: 'daily-bible' },
  { label: 'Study Bible', description: 'Commentary, cross references & study', icon: 'library', href: '/study', tint: palette.slate, capability: 'study-bible' },
  { label: 'Reading Plans', description: 'Read the Bible in a year', icon: 'calendar', href: '/(tabs)/plans', tint: palette.pine, capability: 'plans' },
  { label: 'Resources', description: 'Bible studies, discipleship & academy', icon: 'school', href: '/resources', tint: palette.brass, capability: 'resources' },
  { label: 'Media', description: 'Teachings, sermons & worship', icon: 'play-circle', href: '/(tabs)/media', tint: palette.clay, capability: 'media' },
  { label: 'Events', description: 'Worship, studies & fellowship', icon: 'people', href: '/events', tint: palette.pine, capability: 'events' },
  { label: 'Photos', description: 'Moments from life together', icon: 'images', href: '/photos', tint: palette.slate, capability: 'photos' },
  { label: 'Journal', description: 'Reflect and record what you learn', icon: 'create', href: '/journal', tint: palette.navy },
  { label: 'Saved', description: 'Your bookmarked content', icon: 'bookmark', href: '/saved', tint: palette.brass },
];

/** Dashboard-style grid of all app sections (secondary navigation). */
export default function More() {
  const router = useRouter();
  const { profile } = useAuth();
  const { colors } = useTheme();
  const role = profile?.role ?? 'community';

  const entries = ENTRIES.filter((e) => !e.capability || can(role, e.capability));

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">Explore</AppText>
        <View style={{ width: 30 }} />
      </View>

      <AppText tone="muted" style={{ marginBottom: 16 }}>
        Everything Homewood Living has to offer, in one place.
      </AppText>

      {entries.map((e) => (
        <Card key={e.label} onPress={() => router.push(e.href)} style={{ marginBottom: 12 }}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: `${e.tint}18` }]}>
              <Ionicons name={e.icon} size={24} color={e.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="h6" weight="bold">{e.label}</AppText>
              <AppText variant="caption" tone="muted">{e.description}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
