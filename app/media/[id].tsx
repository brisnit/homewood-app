import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Button, IconButton, HomewoodImage, Card, EmptyState } from '../../src/components/ui';
import { MEDIA_ITEMS } from '../../src/data/homewoodData';
import { useSaved } from '../../src/state/SavedProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

const CATEGORY_LABEL: Record<string, string> = {
  teaching: 'Teaching',
  live: 'Live Study',
  sermon: 'Sermon',
  entertainment: 'Worship & Music',
};

export default function MediaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isSaved, toggleSave } = useSaved();
  const [playing, setPlaying] = useState(false);

  const item = MEDIA_ITEMS.find((m) => m.id === id);
  if (!item) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
        <EmptyState icon="play-circle-outline" title="Media not found" />
      </Screen>
    );
  }

  const saved = isSaved('media', item.id);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <IconButton icon="share-outline" onPress={() => Alert.alert('Share', 'Sharing coming soon.')} accessibilityLabel="Share" />
      </View>

      {/* Video/player placeholder — TODO(media): wire real playback (HLS/mp4/YouTube) */}
      <HomewoodImage name={item.image} height={210} radius={20} overlay={0.42} accessibilityLabel={item.title}>
        <View style={styles.playerInner}>
          <View style={styles.playFab}>
            <Ionicons name={playing ? 'pause' : 'play'} size={26} color={palette.navy} style={{ marginLeft: playing ? 0 : 2 }} />
          </View>
        </View>
      </HomewoodImage>
      <Button
        label={playing ? 'Pause' : 'Play now'}
        icon={playing ? 'pause' : 'play'}
        onPress={() => { setPlaying((p) => !p); }}
        style={{ marginTop: 14 }}
      />

      <View style={styles.metaRow}>
        <View style={[styles.tag, { backgroundColor: `${palette.slate}1A` }]}>
          <AppText variant="overline" weight="bold" style={{ color: palette.slate }}>
            {(CATEGORY_LABEL[item.category] ?? item.category).toUpperCase()}
          </AppText>
        </View>
        <AppText variant="caption" tone="muted">{item.durationMinutes} min</AppText>
      </View>

      <AppText variant="h4" weight="bold" serif style={{ marginTop: 10 }}>{item.title}</AppText>
      <View style={styles.speakerRow}>
        <View style={[styles.speakerAvatar, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="person" size={16} color={colors.primary} />
        </View>
        <AppText weight="semibold">{item.speaker}</AppText>
      </View>

      <View style={styles.actions}>
        <Button label={saved ? 'Saved' : 'Save'} icon={saved ? 'bookmark' : 'bookmark-outline'} variant="secondary" size="sm" fullWidth={false} onPress={() => toggleSave({ kind: 'media', refId: item.id, title: item.title })} />
        <Button label="Notes" icon="create-outline" variant="secondary" size="sm" fullWidth={false} onPress={() => router.push(`/journal/new?ref=${encodeURIComponent(item.title)}`)} />
      </View>

      <Card style={{ marginTop: 20 }}>
        <AppText weight="bold" style={{ marginBottom: 6 }}>About this {CATEGORY_LABEL[item.category]?.toLowerCase() ?? 'teaching'}</AppText>
        <AppText tone="muted" style={{ lineHeight: 26 }}>{item.description}</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  playerInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  playFab: { width: 62, height: 62, borderRadius: 31, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  speakerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  speakerAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
});
