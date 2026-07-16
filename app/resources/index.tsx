import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  Chip,
  Field,
  SectionHeader,
  HomewoodImage,
  EmptyState,
} from '../../src/components/ui';
import { EpisodeCard } from '../../src/components/content/EpisodeCard';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_ITEMS,
  ACADEMY_MODULES,
  CURATED_MINISTRIES,
} from '../../src/data/homewoodData';
import { RJM_EPISODES } from '../../src/data/episodes';
import { ResourceCategoryKey } from '../../src/types/homewood';
import { ImageKey } from '../../src/lib/images';
import { useTheme } from '../../src/theme/ThemeProvider';

type Kind = 'all' | 'topics' | 'podcast' | 'ministries';

const KINDS: { key: Kind; label: string; accent: 'navy' | 'slate' | 'clay' | 'pine' }[] = [
  { key: 'all', label: 'All', accent: 'navy' },
  { key: 'topics', label: 'Topics', accent: 'slate' },
  { key: 'podcast', label: 'Podcast', accent: 'clay' },
  { key: 'ministries', label: 'Ministries', accent: 'pine' },
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Teaching {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  image: ImageKey;
  categoryKey: ResourceCategoryKey;
}

/**
 * Individual studies normally live one level deep, inside a topic. Flattening
 * them here is what makes search worth having — someone looking for "Psalms"
 * shouldn't have to already know it sits under Bible Studies.
 */
const TEACHING: Teaching[] = [
  ...RESOURCE_ITEMS.map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.author,
    meta: `${capitalize(r.format)} · ${r.minutes} min`,
    image: r.image,
    categoryKey: r.categoryKey,
  })),
  ...ACADEMY_MODULES.map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: 'Bible Academy',
    meta: `Course ${m.code} · ${m.lessons} lessons${m.status === 'coming-soon' ? ' · Coming soon' : ''}`,
    image: m.image,
    categoryKey: 'bible-academy' as ResourceCategoryKey,
  })),
];

const hit = (q: string, ...fields: (string | number)[]) =>
  fields.some((f) => String(f).toLowerCase().includes(q));

/** Resources hub — trusted teaching by topic, plus curated ministry partners. */
export default function ResourcesHub() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<Kind>('all');

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const { cats, teaching, episodes, ministries, total } = useMemo(() => {
    const show = (k: Kind) => kind === 'all' || kind === k;

    const cats = show('topics')
      ? RESOURCE_CATEGORIES.filter((c) => !q || hit(q, c.title, c.description))
      : [];
    // Only surfaced while searching — otherwise the topic cards are the way in.
    const teaching =
      show('topics') && searching
        ? TEACHING.filter((t) => hit(q, t.title, t.subtitle, t.meta))
        : [];
    const episodes = show('podcast')
      ? RJM_EPISODES.filter(
          (e) =>
            !q ||
            hit(q, e.title, e.provider, e.scripture, e.description, e.category, `episode ${e.episode}`),
        )
      : [];
    const ministries = show('ministries')
      ? CURATED_MINISTRIES.filter((m) => !q || hit(q, m.name, m.tagline))
      : [];

    return {
      cats,
      teaching,
      episodes,
      ministries,
      total: cats.length + teaching.length + episodes.length + ministries.length,
    };
  }, [q, searching, kind]);

  const narrowed = searching || kind !== 'all';

  const reset = () => {
    setQuery('');
    setKind('all');
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ marginTop: 4, marginBottom: 14 }}>
        <AppText variant="h3" weight="bold">Resources</AppText>
        <AppText tone="muted" style={{ marginTop: 4 }}>Trusted teaching to help you grow.</AppText>
      </View>

      <Field
        icon="search-outline"
        placeholder="Search resources, teachers, topics"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        value={query}
        onChangeText={setQuery}
        accessibilityLabel="Search resources"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={{ marginBottom: 16 }}
      >
        {KINDS.map((k) => (
          <Chip
            key={k.key}
            label={k.label}
            accent={k.accent}
            selected={kind === k.key}
            onPress={() => setKind(k.key)}
          />
        ))}
      </ScrollView>

      {narrowed ? (
        <AppText variant="caption" tone="muted" style={{ marginBottom: 14 }}>
          {total === 1 ? '1 result' : `${total} results`}
        </AppText>
      ) : null}

      {total === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Nothing found"
          message={
            searching
              ? `No resources match “${query.trim()}”. Try a different word, or browse all topics.`
              : 'Nothing in this filter yet.'
          }
          actionLabel="Show all resources"
          onAction={reset}
        />
      ) : null}

      {cats.length > 0 ? (
        <>
          <SectionHeader title="Browse by topic" />
          {cats.map((cat) => (
            <Card
              key={cat.key}
              onPress={() => router.push(`/resources/${cat.key}`)}
              style={styles.categoryCard}
            >
              <HomewoodImage
                name={cat.image}
                height={64}
                radius={14}
                style={styles.categoryThumb}
                accessibilityLabel={cat.title}
              />
              <View style={styles.categoryText}>
                <AppText weight="bold" numberOfLines={1}>{cat.title}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 3 }}>
                  {cat.description}
                </AppText>
                <AppText variant="overline" tone="muted" style={{ marginTop: 6 }}>
                  {`${cat.itemCount} resources`}
                </AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          ))}
        </>
      ) : null}

      {teaching.length > 0 ? (
        <View style={cats.length > 0 ? { marginTop: 26 } : undefined}>
          <SectionHeader title="Studies & guides" />
          {teaching.map((t) => (
            <Card
              key={t.id}
              onPress={() => router.push(`/resources/${t.categoryKey}`)}
              style={styles.categoryCard}
            >
              <HomewoodImage
                name={t.image}
                height={64}
                radius={14}
                style={styles.categoryThumb}
                accessibilityLabel={t.title}
              />
              <View style={styles.categoryText}>
                <AppText weight="bold" numberOfLines={2}>{t.title}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1} style={{ marginTop: 3 }}>
                  {t.subtitle}
                </AppText>
                <AppText variant="overline" tone="muted" style={{ marginTop: 6 }}>{t.meta}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          ))}
        </View>
      ) : null}

      {/* Podcast episodes (externally hosted on Captivate) */}
      {episodes.length > 0 ? (
        <>
          <View style={{ marginTop: 26 }}>
            <SectionHeader title="The Robert J. Morgan Podcast" />
          </View>
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </>
      ) : null}

      {ministries.length > 0 ? (
        <>
          <View style={{ marginTop: 26 }}>
            <SectionHeader title="Trusted Ministries" />
          </View>
          {/* TODO(api): several expose RSS/JSON feeds — pull content later. */}
          {ministries.map((m) => (
            <Card
              key={m.id}
              onPress={() => Linking.openURL(m.url)}
              style={styles.ministryCard}
            >
              <View style={styles.ministryText}>
                <AppText weight="bold" numberOfLines={1}>{m.name}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1} style={{ marginTop: 2 }}>
                  {m.tagline}
                </AppText>
              </View>
              <Ionicons name="open-outline" size={20} color={colors.link} />
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { gap: 8, paddingRight: 8 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  categoryThumb: { width: 64 },
  categoryText: { flex: 1 },
  ministryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  ministryText: { flex: 1 },
});
