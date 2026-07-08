import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, Button, HomewoodImage } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { greeting } from '../../src/lib/format';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { VERSE_OF_THE_DAY, DEVOTIONALS, PLANS } from '../../src/data/mockData';

const TOTAL_BIBLE_DAYS = 365;

// A small, calm set of secondary entry points (not the 8-tile grid).
const EXPLORE: { label: string; icon: keyof typeof Ionicons.glyphMap; href: Href; tint: string }[] = [
  { label: 'Study Bible', icon: 'library', href: '/study', tint: palette.slate },
  { label: 'Media', icon: 'play-circle', href: '/(tabs)/media', tint: palette.clay },
  { label: 'Events', icon: 'people', href: '/events', tint: palette.pine },
  { label: 'Resources', icon: 'school', href: '/resources', tint: palette.brass },
];

/**
 * Home — calm and focused. One primary action (continue today's reading) leads;
 * everything else is quietly secondary. Badges/stats/featured cards were moved
 * off Home to reduce cognitive load.
 */
export default function Home() {
  const router = useRouter();
  const { profile } = useAuth();
  const { bibleCompletedCount } = useProgress();
  const { colors } = useTheme();

  const devotional = DEVOTIONALS[0];
  const plan = PLANS.find((p) => p.category === 'peace') ?? PLANS[0];
  const day = Math.min(bibleCompletedCount + 1, TOTAL_BIBLE_DAYS);

  return (
    <Screen contentStyle={{ paddingBottom: 48 }}>
      {/* Greeting */}
      <View style={{ marginTop: 8, marginBottom: 22 }}>
        <AppText variant="body" tone="muted">{greeting()},</AppText>
        <AppText variant="h2" weight="bold" numberOfLines={1}>{profile?.displayName ?? 'Friend'}</AppText>
      </View>

      {/* ── PRIMARY: the one action ─────────────────────────────── */}
      <Pressable onPress={() => router.push('/(tabs)/bible')} accessibilityRole="button" accessibilityLabel="Continue today's Bible reading">
        <HomewoodImage name="scripture" height={280} radius={24} overlay={0.52} accessibilityLabel="Today's reading">
          <View style={styles.primaryInner}>
            <View style={styles.eyebrow}>
              <Ionicons name="sunny-outline" size={14} color={palette.brass} />
              <AppText variant="overline" weight="bold" style={{ color: palette.brass, marginLeft: 6, letterSpacing: 1.2 }}>
                TODAY · DAY {day}
              </AppText>
            </View>
            <AppText serif variant="h4" style={{ color: '#FFF', lineHeight: 32 }} numberOfLines={4}>
              “{VERSE_OF_THE_DAY.text}”
            </AppText>
            <AppText variant="caption" weight="semibold" style={{ color: '#EBE6DD', marginTop: 10 }}>
              {VERSE_OF_THE_DAY.reference}
            </AppText>
            <View style={{ marginTop: 18 }}>
              <Button label="Continue Reading" icon="book" onPress={() => router.push('/(tabs)/bible')} />
            </View>
          </View>
        </HomewoodImage>
      </Pressable>

      {/* ── SECONDARY: keep going ───────────────────────────────── */}
      <AppText variant="h6" weight="bold" style={styles.sectionLabel}>Keep going</AppText>

      <Card onPress={() => router.push(`/devotional/${devotional.id}`)} style={styles.rowCard} padded={false}>
        <View style={styles.rowCardInner}>
          <HomewoodImage name="prayer" style={styles.rowThumb} radius={14} overlay={0.2} />
          <View style={{ flex: 1 }}>
            <AppText variant="overline" weight="bold" style={{ color: palette.clay }}>DEVOTIONAL</AppText>
            <AppText variant="h6" weight="bold" serif numberOfLines={1} style={{ marginTop: 2 }}>{devotional.title}</AppText>
            <AppText variant="caption" tone="muted">{devotional.estimatedMinutes} min read</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </Card>

      <Card onPress={() => router.push(`/plan/${plan.id}`)} style={styles.rowCard} padded={false}>
        <View style={styles.rowCardInner}>
          <HomewoodImage name="nature" style={styles.rowThumb} radius={14} overlay={0.2} />
          <View style={{ flex: 1 }}>
            <AppText variant="overline" weight="bold" style={{ color: palette.pine }}>READING PLAN</AppText>
            <AppText variant="h6" weight="bold" serif numberOfLines={1} style={{ marginTop: 2 }}>{plan.title}</AppText>
            <AppText variant="caption" tone="muted">Day 3 of {plan.days}</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </Card>

      {/* ── SECONDARY: explore (quiet) ──────────────────────────── */}
      <View style={styles.exploreHead}>
        <AppText variant="h6" weight="bold">Explore</AppText>
        <Pressable onPress={() => router.push('/more')} hitSlop={8}>
          <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>See all</AppText>
        </Pressable>
      </View>
      <View style={styles.exploreRow}>
        {EXPLORE.map((e) => (
          <Pressable
            key={e.label}
            onPress={() => router.push(e.href)}
            accessibilityLabel={e.label}
            style={({ pressed }) => [styles.exploreTile, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.7 }]}
          >
            <View style={[styles.exploreIcon, { backgroundColor: `${e.tint}18` }]}>
              <Ionicons name={e.icon} size={22} color={e.tint} />
            </View>
            <AppText variant="caption" weight="semibold" center numberOfLines={1} style={{ marginTop: 6 }}>{e.label}</AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  primaryInner: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  eyebrow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionLabel: { marginTop: 34, marginBottom: 14 },
  rowCard: { marginBottom: 12, overflow: 'hidden' },
  rowCardInner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 },
  rowThumb: { width: 66, height: 66 },
  exploreHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 34, marginBottom: 14 },
  exploreRow: { flexDirection: 'row', gap: 10 },
  exploreTile: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 18, borderWidth: 1 },
  exploreIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
