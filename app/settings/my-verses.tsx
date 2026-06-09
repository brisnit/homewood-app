import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, IconButton, EmptyState } from '../../src/components/ui';
import { useProgress } from '../../src/state/ProgressProvider';
import { getVerseText } from '../../src/data/bibleText';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

interface VerseItem {
  key: string;
  reference: string; // original passage ref (for opening the reader)
  label: string; // e.g. "Genesis 1:3"
  text: string;
}

/** Parse a highlight key `${reference}#${chapter}:${verse}` into display data. */
function parseKey(key: string): VerseItem | null {
  const hash = key.lastIndexOf('#');
  if (hash < 0) return null;
  const reference = key.slice(0, hash);
  const [chapter, verse] = key.slice(hash + 1).split(':').map(Number);
  if (!chapter || !verse) return null;
  const book = /^(.+?)\s+\d+/.exec(reference)?.[1] ?? reference;
  return {
    key,
    reference,
    label: `${book} ${chapter}:${verse}`,
    text: getVerseText(book, chapter, verse) ?? '',
  };
}

/** "My Verses" — every verse the reader has highlighted. */
export default function MyVerses() {
  const router = useRouter();
  const { colors } = useTheme();
  const { highlights, toggleHighlight } = useProgress();

  const items = useMemo(
    () => highlights.map(parseKey).filter((v): v is VerseItem => v !== null).reverse(),
    [highlights],
  );

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">
          My Verses
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="bookmarks-outline"
          title="No saved verses yet"
          message="Open the Bible, tap a verse to highlight it, and it’ll be saved here."
          actionLabel="Go to Bible"
          onAction={() => router.replace('/(tabs)/bible')}
        />
      ) : (
        <>
          <AppText variant="caption" tone="muted" weight="semibold" style={{ marginBottom: 12 }}>
            {items.length} highlighted {items.length === 1 ? 'verse' : 'verses'}
          </AppText>
          {items.map((item) => (
            <Card
              key={item.key}
              style={styles.card}
              onPress={() => router.push(`/reader?ref=${encodeURIComponent(item.reference)}&translation=KJV`)}
            >
              <View style={[styles.accent, { backgroundColor: palette.brass }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <AppText weight="bold" style={{ color: colors.primary }}>
                    {item.label}
                  </AppText>
                  <IconButton
                    icon="close-circle"
                    size={20}
                    color={colors.textMuted}
                    onPress={() => toggleHighlight(item.key)}
                    accessibilityLabel="Remove highlight"
                  />
                </View>
                <AppText serif style={{ marginTop: 4, lineHeight: 24 }}>
                  “{item.text}”
                </AppText>
                <View style={styles.openRow}>
                  <Ionicons name="book-outline" size={13} color={colors.link} />
                  <AppText variant="overline" weight="semibold" style={{ color: colors.link, marginLeft: 4 }}>
                    Open in reader
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  card: { marginBottom: 12, padding: 0, overflow: 'hidden', flexDirection: 'row' },
  accent: { width: 5 },
  cardBody: { flex: 1, padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  openRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
});
