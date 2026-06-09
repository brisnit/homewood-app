import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Avatar,
  SegmentedTabs,
  SectionHeader,
  BadgeTile,
  Button,
  Card,
  LoadingState,
  ErrorState,
} from '../../src/components/ui';
import { VerseOfDayCard } from '../../src/components/content/VerseOfDayCard';
import { DevotionalCard } from '../../src/components/content/DevotionalCard';
import { useAuth } from '../../src/auth/AuthProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { useAsync } from '../../src/lib/useAsync';
import { devotionalProvider } from '../../src/providers';
import { BADGES, USER_BADGES } from '../../src/data/mockData';
import { greeting } from '../../src/lib/format';
import { DEFAULT_AVATAR } from '../../src/lib/assets';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

type HomeTab = 'today' | 'community';

export default function Home() {
  const [tab, setTab] = useState<HomeTab>('today');
  const { profile } = useAuth();
  const { streak } = useProgress();
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" tone="muted">
            {greeting()},
          </AppText>
          <AppText variant="h4" weight="bold" numberOfLines={1}>
            {profile?.displayName ?? 'Friend'}
          </AppText>
        </View>
        <View style={[styles.streakPill, { backgroundColor: `${palette.clay}1A` }]}>
          <Ionicons name="flame" size={16} color={palette.clay} />
          <AppText variant="caption" weight="bold" style={{ color: palette.clay, marginLeft: 4 }}>
            {streak}
          </AppText>
        </View>
        <Avatar name={profile?.displayName ?? 'Friend'} uri={profile?.avatarUrl ?? DEFAULT_AVATAR} size={44} ring />
      </View>

      <View style={{ marginBottom: 18 }}>
        <SegmentedTabs
          tabs={[
            { key: 'today', label: 'Today' },
            { key: 'community', label: 'Community' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {tab === 'today' ? <TodayTab /> : <CommunityTab />}
    </Screen>
  );
}

function TodayTab() {
  const router = useRouter();
  const verse = useAsync(() => devotionalProvider.getVerseOfTheDay(), []);
  const devos = useAsync(() => devotionalProvider.getRecommendedDevotionals(3), []);

  return (
    <View>
      {verse.loading ? (
        <LoadingState />
      ) : verse.error || !verse.data ? (
        <ErrorState onRetry={verse.reload} />
      ) : (
        <VerseOfDayCard verse={verse.data} />
      )}

      <View style={{ height: 24 }} />
      <SectionHeader title="More for You" actionLabel="See all" onAction={() => router.push('/(tabs)/plans')} />
      {devos.loading ? (
        <LoadingState />
      ) : devos.error || !devos.data ? (
        <ErrorState onRetry={devos.reload} />
      ) : (
        devos.data.map((d) => (
          <DevotionalCard key={d.id} devotional={d} onPress={() => router.push(`/devotional/${d.id}`)} />
        ))
      )}

      <View style={{ height: 24 }} />
      <SectionHeader title="Badges" actionLabel="View all" onAction={() => router.push('/(tabs)/you')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
        {BADGES.map((badge) => {
          const state = USER_BADGES.find((b) => b.badgeId === badge.id) ?? {
            badgeId: badge.id,
            userId: 'me',
            earned: false,
            earnedAt: null,
          };
          return <BadgeTile key={badge.id} badge={badge} state={state} />;
        })}
      </ScrollView>
    </View>
  );
}

function CommunityTab() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View>
      <Card style={{ marginBottom: 16 }}>
        <View style={[styles.communityIcon, { backgroundColor: `${palette.pine}1A` }]}>
          <Ionicons name="people" size={28} color={palette.pine} />
        </View>
        <AppText variant="h4" weight="bold" serif style={{ marginTop: 16 }}>
          Surround Yourself with Wisdom
        </AppText>
        <AppText style={{ marginTop: 10, lineHeight: 24 }} tone="muted">
          Scripture teaches that wise and faithful friends help us grow in character and faith. Choose
          relationships that encourage you, support you, and draw you closer to God.
        </AppText>
        <View style={{ marginTop: 18 }}>
          <Button label="Add Friends" icon="person-add-outline" onPress={() => router.push('/friends/add')} />
        </View>
      </Card>

      <Card>
        <AppText variant="h6" weight="bold">
          Friend activity
        </AppText>
        <View style={styles.emptyActivity}>
          <Ionicons name="sparkles-outline" size={28} color={colors.textMuted} />
          <AppText tone="muted" center style={{ marginTop: 8 }}>
            When you connect with friends, their highlights and milestones will appear here.
          </AppText>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 18 },
  streakPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeRow: { gap: 8, paddingVertical: 4, paddingRight: 12 },
  communityIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  emptyActivity: { alignItems: 'center', paddingVertical: 24 },
});
