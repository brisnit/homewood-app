import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  Button,
  IconButton,
  LoadingState,
  ErrorState,
} from '../../../src/components/ui';
import { useAsync } from '../../../src/lib/useAsync';
import { devotionalProvider } from '../../../src/providers';
import { useProgress } from '../../../src/state/ProgressProvider';
import { useTheme } from '../../../src/theme/ThemeProvider';
import { palette } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';
import { accentHex } from '../../../src/lib/format';
import { getReferenceVerses } from '../../../src/data/bibleText';
import { NO_OUTLINE } from '../../../src/lib/style';

export default function PlanDayLesson() {
  const { planId, day } = useLocalSearchParams<{ planId: string; day: string }>();
  const dayNumber = parseInt(day ?? '1', 10);
  const router = useRouter();
  const { colors } = useTheme();
  const { isPlanDayDone, togglePlanDay, savePlanNote, getPlanProgress } = useProgress();

  const plan = useAsync(() => devotionalProvider.getPlan(planId), [planId]);
  const days = useAsync(() => devotionalProvider.getPlanDays(planId), [planId]);

  const lesson = useMemo(() => days.data?.find((d) => d.dayNumber === dayNumber), [days.data, dayNumber]);
  const verses = useMemo(() => (lesson ? getReferenceVerses(lesson.scriptureRef) : null), [lesson]);

  const [note, setNote] = useState<string | null>(null);
  const savedNote = getPlanProgress(planId).notes[dayNumber] ?? '';
  const noteValue = note ?? savedNote;

  if (plan.loading || days.loading) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState />
      </Screen>
    );
  }
  if (plan.error || !plan.data || !lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorState onRetry={plan.reload} />
      </Screen>
    );
  }

  const p = plan.data;
  const accent = accentHex[p.coverColor];
  const done = isPlanDayDone(p.id, dayNumber);
  const totalDays = days.data?.length ?? p.days;

  const complete = () => {
    if (noteValue.trim()) savePlanNote(p.id, dayNumber, noteValue.trim());
    if (!done) togglePlanDay(p.id, dayNumber);
    if (dayNumber < totalDays) router.replace(`/plan-day/${p.id}/${dayNumber + 1}`);
    else router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="caption" weight="semibold" tone="muted">
          {p.title}
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      {/* Day banner */}
      <View style={[styles.banner, { backgroundColor: accent }]}>
        <AppText variant="overline" weight="bold" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: 1 }}>
          DAY {dayNumber} OF {totalDays}
        </AppText>
        <AppText variant="h3" weight="bold" serif style={{ color: '#FFF', marginTop: 4 }}>
          {lesson.title}
        </AppText>
      </View>

      {/* Scripture reference -> open full chapter */}
      <Card
        style={{ marginTop: 16, backgroundColor: `${accent}10`, borderColor: `${accent}40` }}
        onPress={() => router.push(`/reader?ref=${encodeURIComponent(lesson.scriptureRef)}&translation=KJV`)}
      >
        <View style={styles.refRow}>
          <Ionicons name="bookmarks-outline" size={16} color={accent} />
          <AppText weight="bold" style={{ color: accent, marginLeft: 8, flex: 1 }}>
            {lesson.scriptureRef}
          </AppText>
          <AppText variant="overline" weight="bold" style={{ color: accent }}>
            READ FULL CHAPTER
          </AppText>
          <Ionicons name="chevron-forward" size={13} color={accent} />
        </View>

        {/* The cited verses, from the bundled KJV */}
        {verses ? (
          <AppText serif style={{ marginTop: 12, fontSize: 18, lineHeight: 30 }}>
            {verses.map((v) => (
              <AppText key={v.verse} serif style={{ fontSize: 18, lineHeight: 30, color: colors.text }}>
                <AppText style={{ fontFamily: fonts.bold, fontSize: 11, color: accent }}> {v.verse} </AppText>
                {v.text}{' '}
              </AppText>
            ))}
          </AppText>
        ) : null}
        <AppText variant="overline" tone="muted" style={{ marginTop: 8 }}>
          King James Version
        </AppText>
      </Card>

      {/* Devotional reading */}
      <AppText variant="h6" weight="bold" style={{ marginTop: 22, marginBottom: 8 }}>
        Today’s Reflection
      </AppText>
      <AppText variant="bodyLarge" style={{ lineHeight: 30 }}>
        {lesson.devotionalBody}
      </AppText>

      {/* Prompt + journal */}
      <Card style={{ marginTop: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="create-outline" size={16} color={accent} />
          <AppText weight="bold" style={{ marginLeft: 8 }}>
            Reflect & respond
          </AppText>
        </View>
        <AppText tone="muted" serif style={{ lineHeight: 24, marginBottom: 12 }}>
          {lesson.prompt}
        </AppText>
        <View style={[styles.noteBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <TextInput
            value={noteValue}
            onChangeText={setNote}
            placeholder="Write your response…"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            style={[styles.noteInput, { color: colors.text, fontFamily: fonts.regular }, NO_OUTLINE]}
          />
        </View>
        <Button
          label="Save reflection"
          variant="secondary"
          size="sm"
          icon="checkmark"
          onPress={() => savePlanNote(p.id, dayNumber, noteValue.trim())}
          style={{ marginTop: 10 }}
        />
      </Card>

      {/* Complete + advance */}
      <View style={{ marginTop: 20 }}>
        <Button
          label={done ? (dayNumber < totalDays ? 'Next day' : 'Finish plan') : 'Mark complete & continue'}
          icon={done ? 'arrow-forward' : 'checkmark-circle'}
          onPress={complete}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  banner: { borderRadius: 20, padding: 22 },
  refRow: { flexDirection: 'row', alignItems: 'center' },
  noteBox: { borderWidth: 1.5, borderRadius: 12, padding: 12, minHeight: 90 },
  noteInput: { fontSize: 16, minHeight: 64 },
});
