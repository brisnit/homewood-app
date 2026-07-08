import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Screen, AppText, Chip, SectionHeader, EmptyState } from '../../src/components/ui';
import { EventCard } from '../../src/components/content/EventCard';
import { MINISTRY_EVENTS } from '../../src/data/homewoodData';
import { useAuth } from '../../src/auth/AuthProvider';
import { visibleTo } from '../../src/lib/roles';

/** Events list — gather, worship, and grow together. */
export default function Events() {
  const router = useRouter();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<string>('All');

  const events = profile ? visibleTo(MINISTRY_EVENTS, profile.role) : MINISTRY_EVENTS;

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(events.map((e) => e.category)))],
    [events],
  );

  const visible = useMemo(() => {
    const filtered = filter === 'All' ? events : events.filter((e) => e.category === filter);
    return [...filtered].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }, [events, filter]);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ marginTop: 4, marginBottom: 14 }}>
        <AppText variant="h3" weight="bold">Events</AppText>
        <AppText tone="muted" style={{ marginTop: 4 }}>Gather, worship, and grow together.</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={{ marginBottom: 18 }}
      >
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            accent="navy"
            selected={filter === c}
            onPress={() => setFilter(c)}
          />
        ))}
      </ScrollView>

      <SectionHeader title="Upcoming" />

      {visible.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No events yet"
          message="There are no upcoming events in this category. Please check back soon."
        />
      ) : (
        visible.map((ev) => (
          <EventCard key={ev.id} event={ev} onPress={() => router.push(`/events/${ev.id}`)} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { gap: 8, paddingVertical: 2, paddingRight: 12 },
});
