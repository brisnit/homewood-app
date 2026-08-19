import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, AppHeader, AppText, Chip, SectionHeader, Divider } from '../../src/components/ui';
import { MediaCard } from '../../src/components/content/MediaCard';
import { EpisodeCard } from '../../src/components/content/EpisodeCard';
import { MEDIA_ITEMS } from '../../src/data/homewoodData';
import { RJM_EPISODES } from '../../src/data/episodes';
import { MediaCategory } from '../../src/types/homewood';
import { useAuth } from '../../src/auth/AuthProvider';
import { visibleTo } from '../../src/lib/roles';

type Filter = 'all' | MediaCategory | 'podcast';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'teaching', label: 'Teachings' },
  { key: 'sermon', label: 'Sermons' },
  { key: 'live', label: 'Live' },
  { key: 'entertainment', label: 'Worship' },
  { key: 'podcast', label: 'Podcast' },
];

/** Media library — teachings, sermons, live studies, and worship. */
export default function Media() {
  const router = useRouter();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');

  const items = useMemo(() => {
    if (filter === 'podcast') return [];
    const forRole = profile ? visibleTo(MEDIA_ITEMS, profile.role) : MEDIA_ITEMS;
    return filter === 'all' ? forRole : forRole.filter((m) => m.category === filter);
  }, [filter, profile]);

  const featured = items[0];
  const rest = items.slice(1);
  const live = items.find((m) => m.isLive);

  return (
    <Screen>
      <AppHeader title="Media" />
      <AppText tone="muted" style={{ marginTop: -8, marginBottom: 16 }}>
        Teachings, sermons, and worship for every day.
      </AppText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} accent={f.key === 'live' ? 'clay' : 'navy'} selected={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </ScrollView>

      {/* Podcast-only view */}
      {filter === 'podcast' ? (
        <>
          <SectionHeader title="The Robert J. Morgan Podcast" />
          {RJM_EPISODES.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </>
      ) : null}

      {live && filter === 'all' ? (
        <View style={{ marginBottom: 20 }}>
          <SectionHeader title="Live now" />
          <MediaCard item={live} variant="feature" onPress={() => router.push(`/media/${live.id}`)} />
        </View>
      ) : null}

      {featured ? (
        <View style={{ marginBottom: 8 }}>
          {!(live && filter === 'all') ? <MediaCard item={featured} variant="feature" onPress={() => router.push(`/media/${featured.id}`)} /> : null}
        </View>
      ) : null}

      {filter !== 'podcast' ? (
        <>
          <SectionHeader title={filter === 'all' ? 'Recent' : FILTERS.find((f) => f.key === filter)!.label} />
          {(live && filter === 'all' ? items : rest).map((m, i) => (
            <View key={m.id}>
              {i > 0 ? <Divider /> : null}
              <MediaCard item={m} onPress={() => router.push(`/media/${m.id}`)} />
            </View>
          ))}
        </>
      ) : null}

      {/* Podcast episodes on the All tab too (external) */}
      {filter === 'all' ? (
        <View style={{ marginTop: 24 }}>
          <SectionHeader title="The Robert J. Morgan Podcast" />
          {RJM_EPISODES.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { gap: 8, paddingVertical: 2, paddingRight: 12 },
});
