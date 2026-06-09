import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  IconButton,
  Card,
  Button,
  LoadingState,
  ErrorState,
} from '../src/components/ui';
import { useAsync } from '../src/lib/useAsync';
import { bibleProvider } from '../src/providers';
import { BibleVerse } from '../src/providers/bible/types';
import { useProgress, verseKey } from '../src/state/ProgressProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { fonts } from '../src/theme/typography';

/**
 * Bible passage reader. Renders verses with optional red-letter (words of
 * Christ) styling and an audio-availability indicator. Text comes from the
 * active Bible provider; red letters honor both the version's support and the
 * user's toggle passed via the `red` param.
 */
export default function Reader() {
  const params = useLocalSearchParams<{ ref?: string; translation?: string; red?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isVerseHighlighted, toggleHighlight } = useProgress();

  const reference = params.ref ?? 'Psalm 23';
  const translation = params.translation ?? 'KJV';
  const redLettersOn = params.red !== '0';

  const [fontScale, setFontScale] = useState(1);
  const passage = useAsync(() => bibleProvider.getPassage(reference, translation), [reference, translation]);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
        <View style={{ alignItems: 'center' }}>
          <AppText weight="bold">{reference}</AppText>
          <AppText variant="overline" tone="muted">
            {translation}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="remove-circle-outline" onPress={() => setFontScale((s) => Math.max(0.85, s - 0.1))} accessibilityLabel="Smaller text" />
          <IconButton icon="add-circle-outline" onPress={() => setFontScale((s) => Math.min(1.5, s + 0.1))} accessibilityLabel="Larger text" />
        </View>
      </View>

      {passage.loading ? (
        <LoadingState />
      ) : passage.error || !passage.data ? (
        <ErrorState onRetry={passage.reload} />
      ) : (
        <>
          {passage.data.audioUrl ? <AudioPlayer reference={reference} translation={translation} /> : null}

          <View style={styles.hintRow}>
            <Ionicons name="color-wand-outline" size={13} color={colors.textMuted} />
            <AppText variant="overline" tone="muted" style={{ marginLeft: 6 }}>
              Tap a verse to highlight it
            </AppText>
          </View>

          <View style={{ marginTop: 4 }}>
            <PassageBody
              verses={passage.data.verses}
              fontScale={fontScale}
              redLettersOn={redLettersOn}
              textColor={colors.text}
              headingColor={colors.primary}
              reference={reference}
              isHighlighted={isVerseHighlighted}
              onToggleVerse={toggleHighlight}
            />
          </View>

          <AppText variant="overline" tone="muted" style={{ marginTop: 24 }}>
            {passage.data.copyright}
          </AppText>

          {redLettersOn && passage.data.verses.some((v) => v.redLetter) ? (
            <View style={styles.legend}>
              <View style={[styles.legendDot, { backgroundColor: palette.clay }]} />
              <AppText variant="caption" tone="muted">
                Red letters indicate the words of Christ.
              </AppText>
            </View>
          ) : null}

          <View style={{ marginTop: 20 }}>
            <Button
              label="Add note"
              icon="create-outline"
              variant="secondary"
              size="sm"
              onPress={() => router.push(`/journal/new?ref=${encodeURIComponent(reference)}`)}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Prototype audio player — visual only. The progress bar animates while
 * "playing" so the affordance feels real, but no audio is loaded yet.
 * TODO(audio): connect to a real narration source via expo-av.
 */
function AudioPlayer({ reference, translation }: { reference: string; translation: string }) {
  // Deterministic fake duration per passage (2:30–5:00).
  const duration = 150 + (reference.length * 17) % 150;
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= duration) {
          setPlaying(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, duration]);

  const pct = position / duration;

  return (
    <Card style={{ marginBottom: 16 }}>
      <View style={styles.audioHeader}>
        <View style={[styles.audioIcon, { backgroundColor: `${palette.pine}1A` }]}>
          <Ionicons name="headset" size={20} color={palette.pine} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="semibold">Listen to this passage</AppText>
          <AppText variant="caption" tone="muted">
            Narrated audio · {translation}
          </AppText>
        </View>
        <View style={styles.previewPill}>
          <AppText variant="overline" weight="bold" style={{ color: palette.pine }}>
            PREVIEW
          </AppText>
        </View>
      </View>

      {/* scrubber */}
      <View style={styles.audioTrack}>
        <View style={[styles.audioFill, { width: `${pct * 100}%` }]} />
        <View style={[styles.audioThumb, { left: `${pct * 100}%` }]} />
      </View>
      <View style={styles.audioTimes}>
        <AppText variant="overline" tone="muted">
          {formatTime(position)}
        </AppText>
        <AppText variant="overline" tone="muted">
          {formatTime(duration)}
        </AppText>
      </View>

      {/* transport controls */}
      <View style={styles.audioControls}>
        <Pressable onPress={() => setPosition((p) => Math.max(0, p - 15))} hitSlop={8}>
          <Ionicons name="play-back" size={22} color={palette.navy} />
        </Pressable>
        <Pressable onPress={() => setPlaying((v) => !v)} style={styles.playBtn} accessibilityRole="button" accessibilityLabel={playing ? 'Pause' : 'Play'}>
          <Ionicons name={playing ? 'pause' : 'play'} size={26} color="#FFF" style={{ marginLeft: playing ? 0 : 2 }} />
        </Pressable>
        <Pressable onPress={() => setPosition((p) => Math.min(duration, p + 15))} hitSlop={8}>
          <Ionicons name="play-forward" size={22} color={palette.navy} />
        </Pressable>
      </View>
    </Card>
  );
}

/** Renders verses grouped by chapter. Tap a verse to toggle a highlight. */
function PassageBody({
  verses,
  fontScale,
  redLettersOn,
  textColor,
  headingColor,
  reference,
  isHighlighted,
  onToggleVerse,
}: {
  verses: BibleVerse[];
  fontScale: number;
  redLettersOn: boolean;
  textColor: string;
  headingColor: string;
  reference: string;
  isHighlighted: (key: string) => boolean;
  onToggleVerse: (key: string) => void;
}) {
  // Group consecutive verses by chapter.
  const groups: { chapter: number | undefined; verses: BibleVerse[] }[] = [];
  for (const v of verses) {
    const last = groups[groups.length - 1];
    if (last && last.chapter === v.chapter) last.verses.push(v);
    else groups.push({ chapter: v.chapter, verses: [v] });
  }
  const showHeadings = groups.length > 1;

  return (
    <>
      {groups.map((group, gi) => (
        <View key={group.chapter ?? gi} style={{ marginBottom: showHeadings ? 20 : 0 }}>
          {showHeadings && group.chapter != null ? (
            <AppText weight="bold" variant="h5" style={{ marginBottom: 8, color: headingColor }}>
              Chapter {group.chapter}
            </AppText>
          ) : null}
          <AppText serif style={{ fontSize: 20 * fontScale, lineHeight: 34 * fontScale }}>
            {group.verses.map((v) => {
              const red = redLettersOn && v.redLetter;
              const key = verseKey(reference, group.chapter, v.number);
              const highlighted = isHighlighted(key);
              return (
                <AppText
                  key={`${group.chapter}-${v.number}`}
                  serif
                  onPress={() => onToggleVerse(key)}
                  suppressHighlighting
                  style={{
                    fontSize: 20 * fontScale,
                    lineHeight: 34 * fontScale,
                    color: red ? palette.clay : textColor,
                    backgroundColor: highlighted ? HIGHLIGHT_COLOR : 'transparent',
                  }}
                >
                  <AppText style={{ fontFamily: fonts.bold, fontSize: 12 * fontScale, color: palette.brass }}>
                    {' '}
                    {v.number}{' '}
                  </AppText>
                  {v.text}{' '}
                </AppText>
              );
            })}
          </AppText>
        </View>
      ))}
    </>
  );
}

// Soft amber highlighter, on-brand with the brass accent.
const HIGHLIGHT_COLOR = 'rgba(201,162,75,0.34)';

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  audioHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  previewPill: { backgroundColor: `${palette.pine}1A`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  audioTrack: { height: 6, borderRadius: 6, backgroundColor: '#E5E8EC', marginTop: 16, marginBottom: 6, position: 'relative' },
  audioFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: palette.pine, borderRadius: 6 },
  audioThumb: { position: 'absolute', top: -4, width: 14, height: 14, borderRadius: 7, marginLeft: -7, backgroundColor: palette.pine, borderWidth: 2, borderColor: '#FFF' },
  audioTimes: { flexDirection: 'row', justifyContent: 'space-between' },
  audioControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 12 },
  playBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: palette.pine, alignItems: 'center', justifyContent: 'center' },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
});
