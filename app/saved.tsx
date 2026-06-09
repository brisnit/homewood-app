import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, IconButton, EmptyState } from '../src/components/ui';
import { useSaved } from '../src/state/SavedProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { SavedItem } from '../src/types/models';

const KIND_META: Record<SavedItem['kind'], { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }> = {
  devotional: { icon: 'book', label: 'Devotional', color: palette.clay },
  plan: { icon: 'leaf', label: 'Plan', color: palette.pine },
  verse: { icon: 'bookmark', label: 'Verse', color: palette.brass },
};

/** Saved / bookmarked devotionals, plans, and verses. */
export default function Saved() {
  const router = useRouter();
  const { colors } = useTheme();
  const { items, remove } = useSaved();

  const open = (item: SavedItem) => {
    if (item.kind === 'devotional') router.push(`/devotional/${item.refId}`);
    else if (item.kind === 'plan') router.push(`/plan/${item.refId}`);
    else router.push(`/reader?ref=${encodeURIComponent(item.title)}&translation=KJV`);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">
          Saved
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="Nothing saved yet"
          message="Tap the bookmark on a devotional or plan to save it here for later."
          actionLabel="Browse plans"
          onAction={() => router.replace('/(tabs)/plans')}
        />
      ) : (
        <>
          <AppText variant="caption" tone="muted" weight="semibold" style={{ marginBottom: 12 }}>
            {items.length} saved {items.length === 1 ? 'item' : 'items'}
          </AppText>
          {items.map((item) => {
            const meta = KIND_META[item.kind];
            return (
              <Card key={item.id} onPress={() => open(item)} style={styles.card}>
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: `${meta.color}1A` }]}>
                    <Ionicons name={meta.icon} size={20} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText weight="semibold" numberOfLines={1}>
                      {item.title}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {meta.label} · saved {formatDate(item.savedAt)}
                    </AppText>
                  </View>
                  <IconButton
                    icon="bookmark"
                    size={20}
                    color={meta.color}
                    onPress={() => remove(item.id)}
                    accessibilityLabel="Remove from saved"
                  />
                </View>
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
