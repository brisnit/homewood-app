import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Screen,
  AppText,
  Chip,
  Field,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../../src/components/ui';
import { CondensedPlanCard } from '../../src/components/content/CondensedPlanCard';
import { useAsync } from '../../src/lib/useAsync';
import { devotionalProvider } from '../../src/providers';
import { CATEGORIES, CATEGORY_LABEL } from '../../src/data/mockData';
import { useProgress } from '../../src/state/ProgressProvider';
import { DevotionalCategoryKey } from '../../src/types/models';

type Filter = 'all' | DevotionalCategoryKey;

/** Discover-style plans grid: filter chips + condensed 2-column topic cards. */
export default function Plans() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const { getPlanProgress } = useProgress();
  const plans = useAsync(() => devotionalProvider.getPlans(), []);

  const filtered = useMemo(() => {
    if (!plans.data) return [];
    const q = query.trim().toLowerCase();
    return plans.data
      .filter((p) => (filter === 'all' ? true : p.category === filter))
      .filter((p) => (q ? p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) : true));
  }, [plans.data, filter, query]);

  return (
    <Screen>
      <View style={{ marginTop: 4, marginBottom: 14 }}>
        <AppText variant="h3" weight="bold">
          Discover
        </AppText>
      </View>

      <Field icon="search-outline" placeholder="Search plans" autoCapitalize="none" value={query} onChangeText={setQuery} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={{ marginBottom: 18 }}
      >
        <Chip label="All" accent="navy" selected={filter === 'all'} onPress={() => setFilter('all')} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            label={c.label}
            accent={c.accent}
            selected={filter === c.key}
            onPress={() => setFilter(c.key)}
          />
        ))}
      </ScrollView>

      {plans.loading ? (
        <LoadingState />
      ) : plans.error ? (
        <ErrorState onRetry={plans.reload} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="search-outline" title="No plans found" message="Try another topic or search term." />
      ) : (
        <>
          <AppText variant="caption" tone="muted" weight="semibold" style={{ marginBottom: 12 }}>
            {filter === 'all' ? `${filtered.length} plans` : `${CATEGORY_LABEL[filter]} · ${filtered.length} plans`}
          </AppText>
          <View style={styles.grid}>
            {filtered.map((plan) => {
              const completion = getPlanProgress(plan.id).completedDays.length / plan.days;
              return (
                <CondensedPlanCard
                  key={plan.id}
                  plan={plan}
                  progress={completion > 0 ? completion : undefined}
                  onPress={() => router.push(`/plan/${plan.id}`)}
                />
              );
            })}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { gap: 8, paddingVertical: 2, paddingRight: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
