import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, AppText, Chip, Button } from '../ui';
import { Devotional } from '../../types/models';
import { CATEGORY_LABEL } from '../../data/mockData';
import { accentHex } from '../../lib/format';
import { CATEGORIES } from '../../data/mockData';

interface Props {
  devotional: Devotional;
  inProgress?: boolean;
  onPress: () => void;
}

/** "More for You" devotional recommendation card. */
export function DevotionalCard({ devotional, inProgress = false, onPress }: Props) {
  const accent = devotional.imageColor;
  const categoryAccent = CATEGORIES.find((c) => c.key === devotional.category)?.accent ?? 'navy';

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.thumb, { backgroundColor: `${accentHex[accent]}1A`, borderColor: `${accentHex[accent]}40` }]}>
          {devotional.image ? (
            <Image source={devotional.image} style={styles.thumbImage} resizeMode="cover" />
          ) : (
            <Ionicons name="book-outline" size={26} color={accentHex[accent]} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.metaRow}>
            <Chip label={CATEGORY_LABEL[devotional.category]} accent={categoryAccent} />
            <View style={styles.time}>
              <Ionicons name="time-outline" size={13} color="#6B7385" />
              <AppText variant="overline" tone="muted" style={{ marginLeft: 3 }}>
                {devotional.estimatedMinutes} min
              </AppText>
            </View>
          </View>
          <AppText variant="h6" weight="bold" style={{ marginTop: 8 }} numberOfLines={1}>
            {devotional.title}
          </AppText>
          <AppText variant="caption" tone="muted" style={{ marginTop: 2 }} numberOfLines={2}>
            {devotional.description}
          </AppText>
        </View>
      </View>
      <View style={{ marginTop: 14 }}>
        <Button
          label={inProgress ? 'Continue' : 'Start'}
          variant={inProgress ? 'secondary' : 'primary'}
          size="sm"
          iconRight="arrow-forward"
          onPress={onPress}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 14 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: { width: '100%', height: '100%' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { flexDirection: 'row', alignItems: 'center' },
});
