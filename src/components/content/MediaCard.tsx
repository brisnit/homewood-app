import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, HomewoodImage } from '../ui';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';
import { MediaItem } from '../../types/homewood';

const CATEGORY_LABEL: Record<MediaItem['category'], string> = {
  teaching: 'Teaching',
  live: 'Live',
  sermon: 'Sermon',
  entertainment: 'Worship & Music',
};

interface Props {
  item: MediaItem;
  onPress: () => void;
  variant?: 'row' | 'feature';
}

/** Media list card. `feature` = large hero; `row` = compact list row. */
export function MediaCard({ item, onPress, variant = 'row' }: Props) {
  const { colors } = useTheme();

  if (variant === 'feature') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.92 }}>
        <HomewoodImage name={item.image} height={200} radius={20} overlay={0.4} accessibilityLabel={item.title}>
          <View style={styles.featureInner}>
            <View style={styles.badgeRow}>
              {item.isLive ? (
                <View style={[styles.pill, { backgroundColor: palette.clay }]}>
                  <View style={styles.liveDot} />
                  <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>LIVE</AppText>
                </View>
              ) : (
                <View style={[styles.pill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                  <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>{CATEGORY_LABEL[item.category]}</AppText>
                </View>
              )}
            </View>
            <View>
              <AppText variant="h5" weight="bold" style={{ color: '#FFF' }} numberOfLines={2}>{item.title}</AppText>
              <AppText variant="caption" style={{ color: '#Ebe6dd', marginTop: 2 }}>
                {item.speaker} · {item.durationMinutes} min
              </AppText>
            </View>
          </View>
          <View style={styles.playFab}>
            <Ionicons name="play" size={22} color={palette.navy} style={{ marginLeft: 2 }} />
          </View>
        </HomewoodImage>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderColor: colors.border }, pressed && { opacity: 0.7 }]}>
      <HomewoodImage name={item.image} style={styles.thumb} radius={14} overlay={0.15}>
        <View style={styles.thumbPlay}>
          <Ionicons name="play" size={16} color="#FFF" style={{ marginLeft: 1 }} />
        </View>
      </HomewoodImage>
      <View style={{ flex: 1 }}>
        <View style={styles.metaRow}>
          <AppText variant="overline" weight="bold" style={{ color: item.isLive ? palette.clay : palette.slate }}>
            {item.isLive ? 'LIVE NOW' : CATEGORY_LABEL[item.category].toUpperCase()}
          </AppText>
          <AppText variant="overline" tone="muted"> · {item.durationMinutes} min</AppText>
        </View>
        <AppText weight="bold" numberOfLines={2} style={{ marginTop: 2 }}>{item.title}</AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>{item.speaker}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featureInner: { flex: 1, padding: 16, justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, alignSelf: 'flex-start' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  playFab: { position: 'absolute', top: '50%', left: '50%', width: 54, height: 54, borderRadius: 27, marginTop: -27, marginLeft: -27, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 12 },
  thumb: { width: 104, height: 74 },
  thumbPlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
});
