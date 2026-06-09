import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  Button,
  IconButton,
  Chip,
  LoadingState,
  ErrorState,
} from '../../src/components/ui';
import { useAsync } from '../../src/lib/useAsync';
import { devotionalProvider } from '../../src/providers';
import { CATEGORY_LABEL, CATEGORIES } from '../../src/data/mockData';
import { accentHex } from '../../src/lib/format';
import { palette } from '../../src/theme/colors';
import { useSaved } from '../../src/state/SavedProvider';

export default function DevotionalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const devo = useAsync(() => devotionalProvider.getDevotional(id), [id]);
  const { isSaved, toggleSave } = useSaved();
  const [done, setDone] = useState(false);

  if (devo.loading) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState />
      </Screen>
    );
  }
  if (devo.error || !devo.data) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorState onRetry={devo.reload} />
      </Screen>
    );
  }

  const d = devo.data;
  const accent = accentHex[d.imageColor];
  const categoryAccent = CATEGORIES.find((c) => c.key === d.category)?.accent ?? 'navy';

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
        <IconButton
          icon={isSaved('devotional', d.id) ? 'bookmark' : 'bookmark-outline'}
          color={isSaved('devotional', d.id) ? accent : undefined}
          onPress={() => toggleSave({ kind: 'devotional', refId: d.id, title: d.title })}
          accessibilityLabel="Save devotional"
        />
      </View>

      <View style={[styles.banner, { backgroundColor: accent }]}>
        {d.image ? (
          <>
            <Image source={d.image} style={styles.bannerImage} resizeMode="cover" />
            <View style={[styles.bannerImage, { backgroundColor: accent, opacity: 0.42 }]} />
            <View style={[styles.bannerImage, { backgroundColor: 'rgba(7,16,31,0.34)' }]} />
          </>
        ) : (
          <Ionicons name="book" size={26} color="#FFF" style={{ opacity: 0.9 }} />
        )}
        <View style={styles.bannerMeta}>
          <Chip label={CATEGORY_LABEL[d.category]} accent={categoryAccent} selected />
          <View style={styles.time}>
            <Ionicons name="time-outline" size={13} color="#FFF" />
            <AppText variant="overline" weight="semibold" style={{ color: '#FFF', marginLeft: 4 }}>
              {d.estimatedMinutes} min read
            </AppText>
          </View>
        </View>
      </View>

      <AppText variant="h3" weight="bold" serif style={{ marginTop: 18 }}>
        {d.title}
      </AppText>

      {/* Tap the reference to read the full passage. */}
      <Card
        style={{ marginTop: 16, backgroundColor: `${accent}10`, borderColor: `${accent}40` }}
        onPress={() => router.push(`/reader?ref=${encodeURIComponent(d.scriptureRef)}&translation=KJV`)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="bookmarks-outline" size={16} color={accent} />
          <AppText weight="bold" style={{ color: accent, marginLeft: 8, flex: 1 }}>
            {d.scriptureRef}
          </AppText>
          <View style={styles.readPill}>
            <AppText variant="overline" weight="bold" style={{ color: accent }}>
              READ
            </AppText>
            <Ionicons name="chevron-forward" size={13} color={accent} />
          </View>
        </View>
      </Card>

      <AppText variant="bodyLarge" style={{ marginTop: 18, lineHeight: 30 }}>
        {d.body}
      </AppText>

      <Card style={{ marginTop: 24 }}>
        <AppText weight="bold" style={{ marginBottom: 6 }}>
          Reflect & pray
        </AppText>
        <AppText tone="muted" style={{ lineHeight: 24 }}>
          Where do you most need to hear this today? Sit quietly for a moment and offer that to God in prayer.
        </AppText>
      </Card>

      <View style={{ marginTop: 24 }}>
        <Button
          label={done ? 'Completed ✓' : 'Mark as read'}
          variant={done ? 'secondary' : 'primary'}
          icon={done ? 'checkmark-circle' : 'checkmark'}
          onPress={() => setDone((v) => !v)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  banner: { borderRadius: 20, padding: 20, justifyContent: 'space-between', minHeight: 150, overflow: 'hidden' },
  bannerImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bannerMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  time: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.28)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  readPill: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
