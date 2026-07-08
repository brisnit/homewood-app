import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, Chip, HomewoodImage } from '../ui';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';
import { MinistryEvent } from '../../types/homewood';

/** Map an event category to a warm chip accent. */
const CATEGORY_ACCENT: Record<string, 'navy' | 'brass' | 'clay' | 'pine' | 'slate'> = {
  'Bible Study': 'navy',
  Worship: 'brass',
  Fellowship: 'pine',
  Support: 'clay',
};

interface Props {
  event: MinistryEvent;
  onPress: () => void;
  compact?: boolean;
}

/**
 * Reusable event card. Shows a date "chip" (month + day), the category, title,
 * location and time. Non-compact cards lead with a small photo hero.
 */
export function EventCard({ event, onPress, compact = false }: Props) {
  const { colors } = useTheme();
  const accent = CATEGORY_ACCENT[event.category] ?? 'slate';

  const when = new Date(event.date);
  const month = when.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
  const day = when.toLocaleDateString(undefined, { day: 'numeric' });
  const weekday = when.toLocaleDateString(undefined, { weekday: 'long' });
  const time = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <Card onPress={onPress} style={styles.card} padded={false}>
      {!compact ? (
        <HomewoodImage
          name={event.image}
          height={120}
          radius={16}
          overlay={0.3}
          accessibilityLabel={event.title}
          style={styles.hero}
        >
          <View style={styles.heroInner}>
            <AppText variant="h6" weight="bold" numberOfLines={2} style={{ color: palette.white }}>
              {event.title}
            </AppText>
          </View>
        </HomewoodImage>
      ) : null}

      <View style={styles.body}>
        {/* Date chip */}
        <View style={[styles.dateChip, { backgroundColor: `${palette.navy}0D`, borderColor: `${palette.brass}66` }]}>
          <AppText variant="overline" weight="bold" style={{ color: palette.brass }}>
            {month}
          </AppText>
          <AppText variant="h5" weight="bold" style={{ color: palette.navy, marginTop: 2 }}>
            {day}
          </AppText>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.chipRow}>
            <Chip label={event.category} accent={accent} />
          </View>

          {compact ? (
            <AppText weight="bold" numberOfLines={2} style={{ marginTop: 8 }}>
              {event.title}
            </AppText>
          ) : null}

          <View style={[styles.metaRow, { marginTop: compact ? 8 : 6 }]}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <AppText variant="caption" tone="muted" numberOfLines={1} style={styles.metaText}>
              {event.location}
            </AppText>
          </View>

          <View style={[styles.metaRow, { marginTop: 4 }]}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <AppText variant="caption" tone="muted" numberOfLines={1} style={styles.metaText}>
              {weekday} · {time}
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14, overflow: 'hidden' },
  hero: {},
  heroInner: { flex: 1, padding: 14, justifyContent: 'flex-end' },
  body: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 16 },
  dateChip: {
    width: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  details: { flex: 1 },
  chipRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { flex: 1 },
});
