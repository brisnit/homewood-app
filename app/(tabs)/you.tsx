import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Avatar,
  Card,
  Button,
  Divider,
  BadgeTile,
  IconButton,
  SegmentedTabs,
  EmptyState,
} from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { useSaved } from '../../src/state/SavedProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import {
  BADGES,
  USER_BADGES,
  ACTIVITY,
  HIGHLIGHTS,
  NOTES,
} from '../../src/data/mockData';
import { ActivityKind } from '../../src/types/models';
import { DEFAULT_AVATAR } from '../../src/lib/assets';

type ActivityTab = 'all' | 'highlights' | 'notes' | 'plans' | 'badges';

const ACTIVITY_ICON: Record<ActivityKind, keyof typeof Ionicons.glyphMap> = {
  highlight: 'color-wand-outline',
  note: 'document-text-outline',
  plan: 'calendar-outline',
  badge: 'ribbon-outline',
};

export default function You() {
  const router = useRouter();
  const { profile } = useAuth();
  const { streak } = useProgress();
  const { count: savedCount } = useSaved();
  const { colors } = useTheme();
  const [tab, setTab] = useState<ActivityTab>('all');

  const earnedBadges = BADGES.filter((b) =>
    USER_BADGES.find((u) => u.badgeId === b.id && u.earned),
  );

  return (
    <Screen>
      <View style={styles.topBar}>
        <AppText variant="h3" weight="bold">
          You
        </AppText>
        <IconButton icon="settings-outline" onPress={() => router.push('/settings')} accessibilityLabel="Settings" />
      </View>

      {/* Profile header */}
      <View style={styles.profile}>
        <Avatar name={profile?.displayName ?? 'Friend'} uri={profile?.avatarUrl ?? DEFAULT_AVATAR} size={84} ring />
        <AppText variant="h4" weight="bold" style={{ marginTop: 12 }}>
          {profile?.displayName ?? 'Friend'}
        </AppText>
        <AppText variant="caption" tone="muted">
          @{profile?.username ?? 'friend'}
        </AppText>

        <View style={styles.tagRow}>
          <Tag icon="people-outline" label={`${profile?.friendsCount ?? 0} Friends`} />
          <Tag icon="person-add-outline" label={`${profile?.followingCount ?? 0} Following`} />
        </View>

        {profile?.personalStatement ? (
          <AppText center tone="muted" style={{ marginTop: 12, maxWidth: 320 }}>
            “{profile.personalStatement}”
          </AppText>
        ) : null}

        <View style={{ marginTop: 14 }}>
          <Button
            label="Edit Profile"
            icon="create-outline"
            variant="ghost"
            size="sm"
            fullWidth={false}
            onPress={() => router.push('/settings/edit-profile')}
          />
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.actionRow}>
        <QuickAction icon="bookmark-outline" label="Saved" badge={savedCount} onPress={() => router.push('/saved')} />
        <QuickAction icon="hand-left-outline" label="Prayer" onPress={() => router.push('/settings?section=prayer')} />
        <QuickAction icon="gift-outline" label="Giving" onPress={() => router.push('/settings?section=giving')} />
      </View>

      {/* Streak */}
      <Card style={{ marginTop: 16 }}>
        <View style={styles.streakRow}>
          <View style={[styles.flame, { backgroundColor: `${palette.clay}1A` }]}>
            <Ionicons name="flame" size={26} color={palette.clay} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="h4" weight="bold">
              {streak} days
            </AppText>
            <AppText variant="caption" tone="muted">
              Your current app streak — keep it going!
            </AppText>
          </View>
        </View>
      </Card>

      {/* Badges */}
      <View style={{ marginTop: 20 }}>
        <View style={styles.sectionHead}>
          <AppText variant="h5" weight="bold">
            Badges
          </AppText>
          <AppText variant="caption" tone="muted">
            {earnedBadges.length} of {BADGES.length} earned
          </AppText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
          {BADGES.map((badge) => {
            const state =
              USER_BADGES.find((b) => b.badgeId === badge.id) ?? {
                badgeId: badge.id,
                userId: 'me',
                earned: false,
                earnedAt: null,
              };
            return <BadgeTile key={badge.id} badge={badge} state={state} />;
          })}
        </ScrollView>
      </View>

      {/* Activity */}
      <View style={{ marginTop: 24 }}>
        <AppText variant="h5" weight="bold" style={{ marginBottom: 12 }}>
          Activity
        </AppText>
        <SegmentedTabs
          tabs={[
            { key: 'all', label: 'All' },
            { key: 'highlights', label: 'Highlights' },
            { key: 'notes', label: 'Notes' },
            { key: 'plans', label: 'Plans' },
            { key: 'badges', label: 'Badges' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <View style={{ marginTop: 14 }}>
          <ActivityList tab={tab} />
        </View>
      </View>
    </Screen>
  );
}

function ActivityList({ tab }: { tab: ActivityTab }) {
  const { colors } = useTheme();

  if (tab === 'highlights') {
    return HIGHLIGHTS.length ? (
      <Card padded>
        {HIGHLIGHTS.map((h, i) => (
          <View key={h.id}>
            {i > 0 ? <Divider spacing={6} /> : null}
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${palette.brass}1A` }]}>
                <Ionicons name="color-wand-outline" size={18} color={palette.brass} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold">{h.reference}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={2}>
                  {h.snippet}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </Card>
    ) : (
      <EmptyState icon="color-wand-outline" title="No highlights yet" message="Highlight a verse while reading to see it here." />
    );
  }

  if (tab === 'notes') {
    return NOTES.length ? (
      <Card>
        {NOTES.map((n, i) => (
          <View key={n.id}>
            {i > 0 ? <Divider spacing={6} /> : null}
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${palette.slate}1A` }]}>
                <Ionicons name="document-text-outline" size={18} color={palette.slate} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold">{n.reference}</AppText>
                <AppText variant="caption" tone="muted">
                  {n.text}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </Card>
    ) : (
      <EmptyState icon="document-text-outline" title="No notes yet" message="Notes you write on plans and verses appear here." />
    );
  }

  if (tab === 'badges') {
    const earned = ACTIVITY.filter((a) => a.kind === 'badge');
    return <ActivityFeed items={earned} />;
  }

  if (tab === 'plans') {
    const plans = ACTIVITY.filter((a) => a.kind === 'plan');
    return plans.length ? <ActivityFeed items={plans} /> : (
      <EmptyState icon="calendar-outline" title="No plan activity" message="Start a plan to track your journey." />
    );
  }

  return <ActivityFeed items={ACTIVITY} />;
}

function ActivityFeed({ items }: { items: typeof ACTIVITY }) {
  if (!items.length) {
    return <EmptyState icon="time-outline" title="Nothing here yet" message="Your recent activity will show up here." />;
  }
  return (
    <Card>
      {items.map((a, i) => (
        <View key={a.id}>
          {i > 0 ? <Divider spacing={6} /> : null}
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: `${palette.pine}1A` }]}>
              <Ionicons name={ACTIVITY_ICON[a.kind]} size={18} color={palette.pine} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold">{a.title}</AppText>
              <AppText variant="caption" tone="muted">
                {a.reference ? `${a.reference} · ` : ''}
                {a.subtitle}
              </AppText>
            </View>
          </View>
        </View>
      ))}
    </Card>
  );
}

function Tag({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
      <Ionicons name={icon} size={14} color={colors.primary} />
      <AppText variant="caption" weight="semibold" style={{ marginLeft: 5 }}>
        {label}
      </AppText>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  badge,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <AppText variant="caption" weight="semibold" style={{ marginTop: 6 }}>
        {label}
      </AppText>
      {badge ? (
        <View style={[styles.quickBadge, { backgroundColor: palette.clay }]}>
          <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>
            {badge}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  profile: { alignItems: 'center', marginTop: 8 },
  tagRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  quick: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  quickBadge: { position: 'absolute', top: 8, right: 12, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  flame: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  badgeRow: { gap: 8, paddingVertical: 4, paddingRight: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  activityIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
