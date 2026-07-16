import React from 'react';
import { View, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, AppText, Button, HomewoodImage } from '../ui';
import { palette } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';
import { Episode, PODCAST_NAME } from '../../data/episodes';

/**
 * Podcast episode card (The Robert J. Morgan Podcast). Clearly labeled as
 * externally hosted — the app links out to the player, it doesn't host it.
 */
export function EpisodeCard({ episode }: { episode: Episode }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.card} padded={false}>
      <HomewoodImage name={episode.image} height={120} overlay={0.28} accessibilityLabel={episode.title}>
        <View style={[styles.badge, styles.badgeLeft]}>
          <Ionicons name="headset-outline" size={12} color="#FFF" />
          <AppText variant="overline" weight="bold" style={{ color: '#FFF', marginLeft: 4 }}>
            PODCAST · EPISODE {episode.episode}
          </AppText>
        </View>
        {episode.featured ? (
          <View style={[styles.badge, styles.badgeRight]}>
            <Ionicons name="star" size={11} color={palette.navy} />
            <AppText variant="overline" weight="bold" style={{ color: palette.navy, marginLeft: 4 }}>FEATURED</AppText>
          </View>
        ) : null}
      </HomewoodImage>
      <View style={{ padding: 16 }}>
        <AppText variant="h6" weight="bold" numberOfLines={2}>{episode.title}</AppText>
        <View style={styles.providerRow}>
          <Ionicons name="person-circle-outline" size={15} color={colors.textMuted} />
          <AppText variant="caption" tone="muted" style={{ marginLeft: 4 }} numberOfLines={1}>
            {episode.provider} · {episode.scripture}
          </AppText>
        </View>
        <AppText variant="caption" tone="muted" style={{ marginTop: 6 }} numberOfLines={2}>
          {episode.description}
        </AppText>
        <AppText variant="overline" tone="muted" style={{ marginTop: 8 }}>
          {PODCAST_NAME} — opens outside Homewood Living
        </AppText>
        <View style={{ marginTop: 12 }}>
          <Button
            label="Listen"
            icon="play"
            iconRight="open-outline"
            size="sm"
            onPress={() => Linking.openURL(episode.url)}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14, overflow: 'hidden' },
  // NOTE: keep `left`/`right` out of the base style — setting `left: undefined`
  // in an override does NOT reset it in RN, which stretched the badge full-width.
  badge: { position: 'absolute', top: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(11,28,63,0.72)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeLeft: { left: 12 },
  badgeRight: { right: 12, backgroundColor: '#E9DCC4' },
  providerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});
