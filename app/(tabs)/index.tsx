import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Avatar,
  Card,
  Button,
  SectionHeader,
  ProgressBar,
  HomewoodImage,
} from '../../src/components/ui';
import { MediaCard } from '../../src/components/content/MediaCard';
import { useAuth } from '../../src/auth/AuthProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { greeting } from '../../src/lib/format';
import { roleGreeting } from '../../src/lib/roles';
import { DEFAULT_AVATAR } from '../../src/lib/assets';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { VERSE_OF_THE_DAY, DEVOTIONALS, PLANS } from '../../src/data/mockData';
import { MEDIA_ITEMS, MINISTRY_EVENTS } from '../../src/data/homewoodData';

const TOTAL_BIBLE_DAYS = 365;

const QUICK_LINKS: { label: string; icon: keyof typeof Ionicons.glyphMap; href: Href; tint: string }[] = [
  { label: 'Bible', icon: 'book', href: '/(tabs)/bible', tint: palette.navy },
  { label: 'Study Bible', icon: 'library', href: '/study', tint: palette.slate },
  { label: 'Reading Plans', icon: 'calendar', href: '/(tabs)/plans', tint: palette.pine },
  { label: 'Resources', icon: 'school', href: '/resources', tint: palette.brass },
  { label: 'Media', icon: 'play-circle', href: '/(tabs)/media', tint: palette.clay },
  { label: 'Events', icon: 'people', href: '/events', tint: palette.pine },
  { label: 'Photos', icon: 'images', href: '/photos', tint: palette.slate },
  { label: 'Journal', icon: 'create', href: '/journal', tint: palette.navy },
];

export default function Home() {
  const router = useRouter();
  const { profile } = useAuth();
  const { bibleCompletedCount } = useProgress();
  const { colors } = useTheme();

  const devotional = DEVOTIONALS[0];
  const plan = PLANS.find((p) => p.category === 'peace') ?? PLANS[0];
  const featuredMedia = MEDIA_ITEMS.find((m) => m.isLive) ?? MEDIA_ITEMS[0];
  const nextEvent = MINISTRY_EVENTS[0];
  const eventDate = new Date(nextEvent.date);

  return (
    <Screen>
      {/* Greeting */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" tone="muted">
            {greeting()},
          </AppText>
          <AppText variant="h3" weight="bold" numberOfLines={1}>
            {profile?.displayName ?? 'Friend'}
          </AppText>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/you')} accessibilityLabel="Open profile">
          <Avatar name={profile?.displayName ?? 'Friend'} uri={profile?.avatarUrl ?? DEFAULT_AVATAR} size={48} ring />
        </Pressable>
      </View>
      {profile ? (
        <AppText tone="muted" style={{ marginTop: -6, marginBottom: 18 }}>
          {roleGreeting(profile.role)}
        </AppText>
      ) : null}

      {/* Daily Scripture */}
      <Pressable onPress={() => router.push(`/study/${encodeURIComponent(VERSE_OF_THE_DAY.reference)}`)}>
        <HomewoodImage name="scripture" height={214} radius={20} overlay={0.5} accessibilityLabel="Verse of the day">
          <View style={styles.verseInner}>
            <View style={styles.verseLabel}>
              <Ionicons name="sunny-outline" size={13} color={palette.brass} />
              <AppText variant="overline" weight="bold" style={{ color: palette.brass, marginLeft: 5, letterSpacing: 1 }}>
                VERSE OF THE DAY
              </AppText>
            </View>
            <AppText serif variant="h5" style={{ color: '#FFF', lineHeight: 28 }} numberOfLines={4}>
              “{VERSE_OF_THE_DAY.text}”
            </AppText>
            <AppText variant="caption" weight="semibold" style={{ color: '#EBE6DD', marginTop: 8 }}>
              {VERSE_OF_THE_DAY.reference} · {VERSE_OF_THE_DAY.translation}
            </AppText>
          </View>
        </HomewoodImage>
      </Pressable>

      {/* Quick access grid */}
      <View style={styles.grid}>
        {QUICK_LINKS.map((q) => (
          <Pressable
            key={q.label}
            onPress={() => router.push(q.href)}
            accessibilityLabel={q.label}
            style={({ pressed }) => [styles.tile, pressed && { opacity: 0.65 }]}
          >
            <View style={[styles.tileIcon, { backgroundColor: `${q.tint}18` }]}>
              <Ionicons name={q.icon} size={24} color={q.tint} />
            </View>
            <AppText variant="caption" weight="semibold" center numberOfLines={2} style={{ marginTop: 6 }}>
              {q.label}
            </AppText>
          </Pressable>
        ))}
      </View>

      {/* Continue Reading */}
      <Card onPress={() => router.push('/(tabs)/bible')} style={{ marginTop: 22 }}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <AppText variant="overline" weight="bold" style={{ color: palette.pine, letterSpacing: 1 }}>
              CONTINUE READING
            </AppText>
            <AppText variant="h6" weight="bold" style={{ marginTop: 4 }}>
              Bible in a Year
            </AppText>
            <AppText variant="caption" tone="muted">
              Day {Math.min(bibleCompletedCount + 1, TOTAL_BIBLE_DAYS)} of {TOTAL_BIBLE_DAYS}
            </AppText>
          </View>
          <View style={[styles.readIcon, { backgroundColor: `${palette.pine}1A` }]}>
            <Ionicons name="book" size={24} color={palette.pine} />
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <ProgressBar value={bibleCompletedCount / TOTAL_BIBLE_DAYS} color={palette.pine} />
        </View>
      </Card>

      {/* Featured devotional */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Today’s Devotional" actionLabel="More" onAction={() => router.push('/(tabs)/plans')} />
        <Card onPress={() => router.push(`/devotional/${devotional.id}`)} padded={false} style={{ overflow: 'hidden' }}>
          <HomewoodImage name="prayer" height={128} overlay={0.25} accessibilityLabel={devotional.title} />
          <View style={{ padding: 16 }}>
            <AppText variant="h6" weight="bold" serif>
              {devotional.title}
            </AppText>
            <AppText variant="caption" tone="muted" style={{ marginTop: 4 }} numberOfLines={2}>
              {devotional.description}
            </AppText>
            <View style={{ marginTop: 12 }}>
              <Button label="Read devotional" size="sm" iconRight="arrow-forward" onPress={() => router.push(`/devotional/${devotional.id}`)} />
            </View>
          </View>
        </Card>
      </View>

      {/* Reading plan progress */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Your Reading Plan" actionLabel="All plans" onAction={() => router.push('/(tabs)/plans')} />
        <Card onPress={() => router.push(`/plan/${plan.id}`)}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <AppText variant="h6" weight="bold">{plan.title}</AppText>
              <AppText variant="caption" tone="muted">{plan.days}-day plan</AppText>
            </View>
            <View style={[styles.readIcon, { backgroundColor: `${palette.brass}1A` }]}>
              <Ionicons name="leaf" size={22} color={palette.brass} />
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <ProgressBar value={0.3} color={palette.brass} />
            <AppText variant="overline" tone="muted" style={{ marginTop: 6 }}>Day 3 of {plan.days}</AppText>
          </View>
        </Card>
      </View>

      {/* Upcoming event */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Upcoming Event" actionLabel="All events" onAction={() => router.push('/events')} />
        <Card onPress={() => router.push(`/events/${nextEvent.id}`)} padded={false} style={{ overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.dateChip, { backgroundColor: palette.navy }]}>
              <AppText variant="overline" weight="bold" style={{ color: palette.brass }}>
                {eventDate.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
              </AppText>
              <AppText variant="h4" weight="bold" style={{ color: '#FFF' }}>
                {eventDate.getDate()}
              </AppText>
            </View>
            <View style={{ flex: 1, padding: 14 }}>
              <AppText weight="bold" numberOfLines={1}>{nextEvent.title}</AppText>
              <View style={styles.eventMeta}>
                <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                <AppText variant="caption" tone="muted" style={{ marginLeft: 4 }} numberOfLines={1}>
                  {nextEvent.location}
                </AppText>
              </View>
              <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                {eventDate.toLocaleDateString(undefined, { weekday: 'long' })} · {eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </AppText>
            </View>
          </View>
        </Card>
      </View>

      {/* Featured media */}
      <View style={{ marginTop: 24, marginBottom: 8 }}>
        <SectionHeader title="Featured Teaching" actionLabel="Media" onAction={() => router.push('/(tabs)/media')} />
        <MediaCard item={featuredMedia} variant="feature" onPress={() => router.push(`/media/${featuredMedia.id}`)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 10 },
  verseInner: { flex: 1, padding: 18, justifyContent: 'center' },
  verseLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, marginHorizontal: -6 },
  tile: { width: '25%', paddingHorizontal: 6, marginBottom: 16, alignItems: 'center' },
  tileIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  readIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dateChip: { width: 72, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
});
