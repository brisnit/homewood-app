import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
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
import { usePreferences } from '../src/state/PreferencesProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { fonts } from '../src/theme/typography';

const RATE_PRESETS = [0.75, 0.9, 1.0, 1.25];

/** Bible passage reader with text-to-speech narration and live verse highlighting. */
export default function Reader() {
  const params = useLocalSearchParams<{ ref?: string; translation?: string; red?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isVerseHighlighted, toggleHighlight } = useProgress();

  const reference = params.ref ?? 'Psalm 23';
  const translation = params.translation ?? 'KJV';
  const redLettersOn = params.red !== '0';

  const [fontScale, setFontScale] = useState(1);
  const [activeKey, setActiveKey] = useState<string | null>(null);
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
          {passage.data.audioUrl ? (
            <AudioPlayer
              verses={passage.data.verses}
              translation={translation}
              onActiveVerse={(v) => setActiveKey(v ? verseKey(reference, v.chapter, v.number) : null)}
            />
          ) : null}

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
              activeKey={activeKey}
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

/**
 * Real audio player powered by text-to-speech (expo-speech). Reads the passage
 * verse-by-verse so it works everywhere (iOS, Android, web), tracks the verse
 * being read for live highlighting, and honors the user's voice + speed.
 */
function AudioPlayer({
  verses,
  translation,
  onActiveVerse,
}: {
  verses: BibleVerse[];
  translation: string;
  onActiveVerse: (verse: BibleVerse | null) => void;
}) {
  const router = useRouter();
  const { audio, setAudio } = usePreferences();
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);

  const playingRef = useRef(false);
  const indexRef = useRef(0);
  const total = verses.length;

  // Keep refs current values available to async speech callbacks.
  const audioRef = useRef(audio);
  audioRef.current = audio;

  // Stop narration if the screen unmounts.
  useEffect(() => () => { playingRef.current = false; Speech.stop(); }, []);

  const speakIndex = (i: number) => {
    if (i >= total) {
      finish();
      return;
    }
    indexRef.current = i;
    setIndex(i);
    onActiveVerse(verses[i]);
    Speech.speak(verses[i].text, {
      voice: audioRef.current.voiceId ?? undefined,
      rate: audioRef.current.rate,
      onDone: () => {
        if (playingRef.current) speakIndex(indexRef.current + 1);
      },
    });
  };

  const finish = () => {
    playingRef.current = false;
    setPlaying(false);
    indexRef.current = 0;
    setIndex(0);
    onActiveVerse(null);
    Speech.stop();
  };

  const play = () => {
    playingRef.current = true;
    setPlaying(true);
    speakIndex(indexRef.current);
  };

  const pause = () => {
    playingRef.current = false;
    setPlaying(false);
    Speech.stop();
  };

  const skip = (delta: number) => {
    const next = Math.max(0, Math.min(total - 1, indexRef.current + delta));
    indexRef.current = next;
    setIndex(next);
    if (playingRef.current) {
      Speech.stop();
      speakIndex(next);
    } else {
      onActiveVerse(verses[next]);
    }
  };

  const cycleRate = () => {
    const i = RATE_PRESETS.indexOf(audio.rate);
    setAudio({ rate: RATE_PRESETS[(i + 1) % RATE_PRESETS.length] });
  };

  const pct = total ? (index + (playing ? 0.5 : 0)) / total : 0;
  const current = verses[index];
  const verseLabel = current?.chapter ? `Verse ${current.chapter}:${current.number}` : `Verse ${current?.number ?? 1}`;

  return (
    <Card style={{ marginBottom: 16 }}>
      <View style={styles.audioHeader}>
        <View style={[styles.audioIcon, { backgroundColor: `${palette.pine}1A` }]}>
          <Ionicons name={playing ? 'volume-high' : 'headset'} size={20} color={palette.pine} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="semibold">Listen to this passage</AppText>
          <AppText variant="caption" tone="muted">
            {playing ? verseLabel : `Narrated · ${translation}`}
          </AppText>
        </View>
        <Pressable onPress={() => router.push('/settings/voice')} hitSlop={8} style={styles.voiceBtn}>
          <Ionicons name="options-outline" size={14} color={palette.pine} />
          <AppText variant="overline" weight="bold" style={{ color: palette.pine, marginLeft: 4 }}>
            VOICE
          </AppText>
        </Pressable>
      </View>

      {/* progress by verse */}
      <View style={styles.audioTrack}>
        <View style={[styles.audioFill, { width: `${Math.min(100, pct * 100)}%` }]} />
      </View>
      <View style={styles.audioTimes}>
        <AppText variant="overline" tone="muted">
          {playing || index > 0 ? `${index + 1}` : '1'} / {total}
        </AppText>
        <Pressable onPress={cycleRate} hitSlop={8}>
          <AppText variant="overline" weight="bold" style={{ color: palette.navy }}>
            {audio.rate.toFixed(2).replace(/0$/, '')}×
          </AppText>
        </Pressable>
      </View>

      {/* transport controls */}
      <View style={styles.audioControls}>
        <Pressable onPress={() => skip(-1)} hitSlop={8} accessibilityLabel="Previous verse">
          <Ionicons name="play-skip-back" size={22} color={palette.navy} />
        </Pressable>
        <Pressable onPress={playing ? pause : play} style={styles.playBtn} accessibilityRole="button" accessibilityLabel={playing ? 'Pause' : 'Play'}>
          <Ionicons name={playing ? 'pause' : 'play'} size={26} color="#FFF" style={{ marginLeft: playing ? 0 : 2 }} />
        </Pressable>
        <Pressable onPress={() => skip(1)} hitSlop={8} accessibilityLabel="Next verse">
          <Ionicons name="play-skip-forward" size={22} color={palette.navy} />
        </Pressable>
      </View>
    </Card>
  );
}

/** Renders verses grouped by chapter. Tap a verse to highlight; active = being read. */
function PassageBody({
  verses,
  fontScale,
  redLettersOn,
  textColor,
  headingColor,
  reference,
  isHighlighted,
  onToggleVerse,
  activeKey,
}: {
  verses: BibleVerse[];
  fontScale: number;
  redLettersOn: boolean;
  textColor: string;
  headingColor: string;
  reference: string;
  isHighlighted: (key: string) => boolean;
  onToggleVerse: (key: string) => void;
  activeKey: string | null;
}) {
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
              const active = key === activeKey;
              const bg = active ? READING_COLOR : isHighlighted(key) ? HIGHLIGHT_COLOR : 'transparent';
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
                    backgroundColor: bg,
                  }}
                >
                  <AppText style={{ fontFamily: fonts.bold, fontSize: 12 * fontScale, color: active ? palette.pine : palette.brass }}>
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

// Saved highlight = amber; currently-read verse = green.
const HIGHLIGHT_COLOR = 'rgba(201,162,75,0.34)';
const READING_COLOR = 'rgba(62,124,107,0.26)';

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  audioHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${palette.pine}1A`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  audioTrack: { height: 6, borderRadius: 6, backgroundColor: '#E5E8EC', marginTop: 16, marginBottom: 6, overflow: 'hidden' },
  audioFill: { height: 6, backgroundColor: palette.pine, borderRadius: 6 },
  audioTimes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  audioControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 12 },
  playBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: palette.pine, alignItems: 'center', justifyContent: 'center' },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
});
