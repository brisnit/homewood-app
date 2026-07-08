import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Screen, AppText, Card, Button, IconButton, HomewoodImage, EmptyState } from '../../src/components/ui';
import { RESOURCE_CATEGORIES, RESOURCE_ITEMS, ACADEMY_MODULES } from '../../src/data/homewoodData';
import { AcademyModule, ResourceItem } from '../../src/types/homewood';
import { useSaved } from '../../src/state/SavedProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ResourceCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isSaved, toggleSave } = useSaved();

  const cat = RESOURCE_CATEGORIES.find((c) => c.key === category);

  if (!cat) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
        <EmptyState icon="help-circle-outline" title="Not found" message="This topic isn’t available." />
      </Screen>
    );
  }

  const isAcademy = cat.key === 'bible-academy';
  const items = RESOURCE_ITEMS.filter((r) => r.categoryKey === cat.key);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold" numberOfLines={1} style={styles.headerTitle}>{cat.title}</AppText>
        <View style={styles.headerSpacer} />
      </View>

      <AppText tone="muted" style={{ marginBottom: 20, lineHeight: 24 }}>{cat.description}</AppText>

      {isAcademy
        ? ACADEMY_MODULES.map((mod) => (
            <AcademyCard key={mod.id} mod={mod} colors={colors} />
          ))
        : items.length === 0
        ? <EmptyState icon="book-outline" title="No resources yet" message="Check back soon for new teaching in this topic." />
        : items.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
              saved={isSaved('resource', item.id)}
              onToggle={() => toggleSave({ kind: 'resource', refId: item.id, title: item.title })}
              colors={colors}
            />
          ))}
    </Screen>
  );
}

function AcademyCard({ mod, colors }: { mod: AcademyModule; colors: { textMuted: string } }) {
  const available = mod.status === 'available';
  return (
    <Card style={[styles.moduleCard, !available && styles.dimmed]}>
      <View style={styles.moduleTop}>
        <View style={styles.codeBadge}>
          <AppText variant="h6" weight="bold" style={{ color: palette.cream }}>{mod.code}</AppText>
        </View>
        <HomewoodImage name={mod.image} height={54} radius={12} style={styles.moduleThumb} accessibilityLabel={mod.title} />
      </View>

      <AppText weight="bold" style={{ marginTop: 12 }}>{mod.title}</AppText>
      <AppText variant="caption" tone="muted" style={{ marginTop: 4, lineHeight: 20 }}>{mod.summary}</AppText>
      <AppText variant="overline" tone="muted" style={{ marginTop: 8 }}>{`${mod.lessons} lessons`}</AppText>

      <View style={{ marginTop: 14 }}>
        {available ? (
          <Button
            label="Start"
            icon="play"
            size="sm"
            fullWidth={false}
            style={styles.startButton}
            onPress={() => Alert.alert('Bible Academy', 'Course starting soon.')}
          />
        ) : (
          <View style={styles.comingPill}>
            <AppText variant="caption" weight="semibold" style={{ color: colors.textMuted }}>Coming soon</AppText>
          </View>
        )}
      </View>
    </Card>
  );
}

function ResourceCard({
  item,
  saved,
  onToggle,
  colors,
}: {
  item: ResourceItem;
  saved: boolean;
  onToggle: () => void;
  colors: { link: string };
}) {
  return (
    <Card style={styles.resourceCard}>
      <HomewoodImage name={item.image} height={84} radius={12} style={styles.resourceThumb} accessibilityLabel={item.title} />
      <View style={styles.resourceBody}>
        <View style={styles.resourceHeadRow}>
          <AppText weight="bold" numberOfLines={2} style={{ flex: 1 }}>{item.title}</AppText>
          <IconButton
            icon={saved ? 'bookmark' : 'bookmark-outline'}
            onPress={onToggle}
            color={saved ? colors.link : undefined}
            size={20}
            accessibilityLabel={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
          />
        </View>
        <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>{item.author}</AppText>
        <AppText variant="overline" tone="muted" style={{ marginTop: 6 }}>
          {`${capitalize(item.format)} · ${item.minutes} min`}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 6, lineHeight: 20 }}>
          {item.description}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 12 },
  headerTitle: { flex: 1, textAlign: 'center' },
  headerSpacer: { width: 30 },

  moduleCard: { marginBottom: 14 },
  dimmed: { opacity: 0.6 },
  moduleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeBadge: {
    minWidth: 54,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: palette.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleThumb: { width: 72 },
  startButton: { backgroundColor: palette.brass, borderColor: palette.brass },
  comingPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: `${palette.muted}22`,
  },

  resourceCard: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  resourceThumb: { width: 84 },
  resourceBody: { flex: 1 },
  resourceHeadRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
});
