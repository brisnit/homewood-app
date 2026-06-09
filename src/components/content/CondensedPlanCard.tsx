import React from 'react';
import { Pressable, View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { Plan } from '../../types/models';
import { accentHex } from '../../lib/format';

interface Props {
  plan: Plan;
  /** 0..1 completion; shows a thin progress bar + check when started. */
  progress?: number;
  onPress: () => void;
}

/**
 * Compact 2-column topic tile (Discover-grid style): solid brand color with the
 * title overlaid and a small day-count pill. Much denser than the stacked card.
 */
export function CondensedPlanCard({ plan, progress, onPress }: Props) {
  const color = accentHex[plan.coverColor];
  const started = progress != null && progress > 0;
  const complete = progress != null && progress >= 1;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: color }, pressed && styles.pressed]}>
      {/* cover image + dark scrim for legible text */}
      {plan.image ? (
        <>
          <Image source={plan.image} style={styles.image} resizeMode="cover" />
          <View style={[styles.scrim, { backgroundColor: color }]} />
          <View style={styles.scrimDark} />
        </>
      ) : null}

      {/* top pills */}
      <View style={styles.top}>
        <View style={styles.daysPill}>
          <Ionicons name="calendar-outline" size={11} color="#FFF" />
          <AppText variant="overline" weight="bold" style={{ color: '#FFF', marginLeft: 3 }}>
            {plan.days}d
          </AppText>
        </View>
        {complete ? (
          <Ionicons name="checkmark-circle" size={18} color="#FFF" />
        ) : started ? (
          <View style={styles.daysPill}>
            <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>
              {Math.round(progress! * 100)}%
            </AppText>
          </View>
        ) : null}
      </View>

      {/* title */}
      <AppText variant="h6" weight="bold" style={styles.title} numberOfLines={2}>
        {plan.title}
      </AppText>

      {started ? (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, progress! * 100)}%` }]} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 122,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  // Brand-color wash (keeps each topic tinted) + dark gradient-ish scrim for text.
  scrim: { ...StyleSheet.absoluteFillObject, opacity: 0.42 },
  scrimDark: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,16,31,0.28)' },
  pressed: { opacity: 0.9 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  daysPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  title: { color: '#FFFFFF', marginTop: 8 },
  track: { height: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 8, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 4, backgroundColor: '#FFFFFF' },
});
