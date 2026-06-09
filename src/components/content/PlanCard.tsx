import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, AppText, Chip, Button, ProgressBar } from '../ui';
import { Plan } from '../../types/models';
import { CATEGORY_LABEL, CATEGORIES } from '../../data/mockData';
import { accentHex, pluralize } from '../../lib/format';

interface Props {
  plan: Plan;
  /** 0..1 completion; undefined means not started. */
  progress?: number;
  onPress: () => void;
}

export function PlanCard({ plan, progress, onPress }: Props) {
  const accent = plan.coverColor;
  const categoryAccent = CATEGORIES.find((c) => c.key === plan.category)?.accent ?? 'navy';
  const started = progress != null && progress > 0;

  return (
    <Card onPress={onPress} style={styles.card} padded={false}>
      <View style={[styles.cover, { backgroundColor: accentHex[accent] }]}>
        <Ionicons name="leaf-outline" size={22} color="#FFFFFF" style={{ opacity: 0.85 }} />
        <View style={styles.coverMeta}>
          <Ionicons name="calendar-outline" size={13} color="#FFFFFF" />
          <AppText variant="overline" weight="semibold" style={{ color: '#FFF', marginLeft: 4 }}>
            {pluralize(plan.days, 'day')}
          </AppText>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Chip label={CATEGORY_LABEL[plan.category]} accent={categoryAccent} />
        <AppText variant="h6" weight="bold" style={{ marginTop: 8 }} numberOfLines={1}>
          {plan.title}
        </AppText>
        <AppText variant="caption" tone="muted" style={{ marginTop: 2 }} numberOfLines={2}>
          {plan.description}
        </AppText>

        {started ? (
          <View style={{ marginTop: 12 }}>
            <ProgressBar value={progress!} color={accentHex[accent]} />
            <AppText variant="overline" tone="muted" style={{ marginTop: 6 }}>
              {Math.round(progress! * plan.days)} of {plan.days} days complete
            </AppText>
          </View>
        ) : null}

        <View style={{ marginTop: 14 }}>
          <Button
            label={started ? 'Continue plan' : 'Start plan'}
            variant={started ? 'secondary' : 'primary'}
            size="sm"
            iconRight="arrow-forward"
            onPress={onPress}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14, overflow: 'hidden' },
  cover: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
});
