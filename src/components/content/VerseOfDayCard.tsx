import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, AppText, StatItem, Button, IconButton } from '../ui';
import { VerseOfTheDay } from '../../types/models';
import { palette } from '../../theme/colors';
import { compact } from '../../lib/format';

interface Props {
  verse: VerseOfTheDay;
}

/** Card 1 on Home → Today: Verse of the Day with social stats and CTA. */
export function VerseOfDayCard({ verse }: Props) {
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <Card style={styles.card} padded={false}>
      <View style={[styles.inner, { backgroundColor: palette.navy }]}>
        <View style={styles.topRow}>
          <View style={styles.label}>
            <AppText variant="overline" weight="bold" style={{ color: palette.brass, letterSpacing: 1 }}>
              VERSE OF THE DAY
            </AppText>
          </View>
          <IconButton
            icon="ellipsis-horizontal"
            color="#C9D2E3"
            onPress={() => Alert.alert('Verse options', 'Share, copy, or save this verse.')}
            accessibilityLabel="More options"
          />
        </View>

        <AppText variant="caption" style={{ color: '#9FB0CC', marginTop: 10 }}>
          {verse.book} {verse.chapter} · {verse.translation}
        </AppText>
        <AppText serif variant="h5" style={{ color: palette.cream, marginTop: 6, lineHeight: 30 }} numberOfLines={4}>
          “{verse.text}”
        </AppText>
        <AppText variant="caption" weight="semibold" style={{ color: palette.brass, marginTop: 10 }}>
          {verse.reference}
        </AppText>

        <View style={styles.statsRow}>
          <View style={styles.stats}>
            <StatItem icon={liked ? 'heart' : 'heart-outline'} count={compact(verse.likes + (liked ? 1 : 0))} active={liked} onPress={() => setLiked((v) => !v)} />
            <StatItem icon="chatbubble-outline" count={compact(verse.comments)} onPress={() => Alert.alert('Reflections', 'Community reflections coming soon.')} />
            <StatItem icon="download-outline" count={compact(verse.downloads)} onPress={() => Alert.alert('Saved', 'Verse image saved to your device.')} />
          </View>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <Button
          label={subscribed ? 'You’ll get this daily ✓' : 'Send me this daily'}
          variant={subscribed ? 'secondary' : 'primary'}
          icon={subscribed ? 'checkmark' : 'notifications-outline'}
          size="sm"
          onPress={() => setSubscribed((v) => !v)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  inner: { padding: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { },
  statsRow: { marginTop: 16 },
  stats: { flexDirection: 'row', gap: 20 },
  ctaWrap: { padding: 14 },
});
