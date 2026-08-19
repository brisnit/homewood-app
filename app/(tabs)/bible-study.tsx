import React, { useMemo, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen, AppHeader, AppText, Card, Chip, Button, HomewoodImage, EmptyState, SegmentedTabs,
} from '../../src/components/ui';
import { BIBLE_STUDIES } from '../../src/data/homewoodData';
import { BibleStudy } from '../../src/types/homewood';
import { useStudy } from '../../src/state/StudyProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

type Tab = 'current' | 'past' | 'mine';
type Sort = 'soonest' | 'title' | 'size';

const SORT_LABEL: Record<Sort, string> = {
  soonest: 'Starting soonest',
  title: 'A–Z',
  size: 'Most members',
};
const SORT_ORDER: Sort[] = ['soonest', 'title', 'size'];

/**
 * Bible Study — the groups people meet in, as opposed to the solo reading in
 * Plans and Bible. Current studies can be joined or opened; past ones stay
 * readable so someone who missed a run can still work the curriculum.
 */
export default function BibleStudyTab() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isJoined, count: joinedCount } = useStudy();

  const [tab, setTab] = useState<Tab>('current');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('soonest');

  const studies = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = BIBLE_STUDIES.filter((s) => {
      if (tab === 'mine') return isJoined(s.id);
      if (tab === 'past') return s.status === 'completed';
      return s.status !== 'completed';
    });

    if (q) {
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.leader.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.scriptureFocus.toLowerCase().includes(q) ||
        s.campus.toLowerCase().includes(q) ||
        s.topics.some((t) => t.toLowerCase().includes(q)));
    }

    const sorted = [...list];
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'size') sorted.sort((a, b) => b.memberCount - a.memberCount);
    // Past studies read best most-recent-first; upcoming, soonest-first.
    else if (tab === 'past') sorted.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
    else sorted.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

    return sorted;
  }, [tab, query, sort, isJoined]);

  const cycleSort = () => setSort(SORT_ORDER[(SORT_ORDER.indexOf(sort) + 1) % SORT_ORDER.length]);

  return (
    <Screen contentStyle={{ paddingBottom: 48 }}>
      <AppHeader title="Bible Study" />

      <AppText tone="muted" style={{ marginTop: -8, marginBottom: 16, lineHeight: 24 }}>
        Study Scripture together — join a group, follow the curriculum, and pick up
        the materials for each week.
      </AppText>

      {/* ── Search + sort ───────────────────────────────────────── */}
      <View style={styles.searchRow}>
        <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search studies, leaders, or books"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
            accessibilityLabel="Search Bible studies"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          onPress={cycleSort}
          accessibilityRole="button"
          accessibilityLabel={`Sort: ${SORT_LABEL[sort]}. Tap to change.`}
          style={({ pressed }) => [
            styles.sortBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="swap-vertical" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <Pressable onPress={cycleSort} hitSlop={6} style={styles.sortLabel}>
        <AppText variant="caption" tone="muted">Sorted by </AppText>
        <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>
          {SORT_LABEL[sort]}
        </AppText>
      </Pressable>

      <View style={{ marginTop: 12, marginBottom: 4 }}>
        <SegmentedTabs<Tab>
          tabs={[
            { key: 'current', label: 'Current' },
            { key: 'past', label: 'Past' },
            { key: 'mine', label: joinedCount ? `Mine (${joinedCount})` : 'Mine' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      <AppText variant="caption" tone="muted" style={{ marginTop: 10, marginBottom: 8 }}>
        {studies.length} {studies.length === 1 ? 'study' : 'studies'}
      </AppText>

      {studies.length === 0 ? (
        <EmptyState
          icon={tab === 'mine' ? 'people-outline' : 'search-outline'}
          title={
            query
              ? 'No studies match your search'
              : tab === 'mine'
                ? 'You haven’t joined a study yet'
                : tab === 'past'
                  ? 'No past studies yet'
                  : 'No studies running right now'
          }
          message={
            query
              ? 'Try a different word, or clear the search to see everything.'
              : tab === 'mine'
                ? 'Join one from the Current tab and it will show up here.'
                : 'Check back soon — new studies are added each season.'
          }
        />
      ) : (
        studies.map((s) => (
          <StudyCard key={s.id} study={s} joined={isJoined(s.id)} onPress={() => router.push(`/bible-study/${s.id}`)} />
        ))
      )}
    </Screen>
  );
}

function StudyCard({ study, joined, onPress }: { study: BibleStudy; joined: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const full = study.capacity != null && study.memberCount >= study.capacity;
  const start = new Date(study.startDate);
  const startLabel = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const statusMeta =
    study.status === 'completed'
      ? { label: 'Completed', tint: colors.textMuted }
      : study.status === 'in-progress'
        ? { label: 'In progress', tint: palette.pine }
        : { label: `Starts ${startLabel}`, tint: palette.brass };

  return (
    <Card onPress={onPress} style={styles.card} padded={false}>
      <HomewoodImage name={study.image} height={128} radius={0} overlay={0.4} accessibilityLabel={study.title}>
        <View style={styles.heroInner}>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
              <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>
                {statusMeta.label.toUpperCase()}
              </AppText>
            </View>
            {joined ? (
              <View style={[styles.badge, { backgroundColor: palette.pine }]}>
                <Ionicons name="checkmark" size={11} color="#FFF" />
                <AppText variant="overline" weight="bold" style={{ color: '#FFF', marginLeft: 3 }}>JOINED</AppText>
              </View>
            ) : null}
          </View>
        </View>
      </HomewoodImage>

      <View style={styles.cardBody}>
        <AppText variant="h6" weight="bold" serif numberOfLines={2}>{study.title}</AppText>
        <AppText variant="caption" tone="muted" style={{ marginTop: 3 }}>
          {study.leader} · {study.scriptureFocus}
        </AppText>

        <View style={styles.factRow}>
          <Fact icon="time-outline" text={study.schedule} />
          <Fact icon="albums-outline" text={`${study.sessionCount} sessions`} />
        </View>
        <View style={styles.factRow}>
          <Fact icon="location-outline" text={study.location} />
          <Fact
            icon="people-outline"
            text={study.capacity != null ? `${study.memberCount}/${study.capacity}` : `${study.memberCount} members`}
          />
        </View>

        <View style={styles.chips}>
          {study.topics.slice(0, 3).map((t) => <Chip key={t} label={t} accent="slate" />)}
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            label={
              joined ? 'Open study'
                : study.status === 'completed' ? 'View study'
                  : full ? 'Study is full — view'
                    : 'Join study'
            }
            icon={joined ? 'arrow-forward' : study.status === 'completed' ? 'eye-outline' : 'person-add-outline'}
            variant={joined || study.status === 'completed' ? 'secondary' : 'primary'}
            onPress={onPress}
          />
        </View>
      </View>
    </Card>
  );
}

function Fact({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <AppText variant="caption" tone="muted" numberOfLines={1} style={{ marginLeft: 5, flex: 1 }}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  search: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, height: 48,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  sortBtn: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sortLabel: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  card: { marginTop: 12, overflow: 'hidden' },
  heroInner: { flex: 1, justifyContent: 'flex-start', padding: 12 },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  cardBody: { padding: 16 },
  factRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  fact: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
});
