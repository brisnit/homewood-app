import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  Button,
  ProgressBar,
  IconButton,
  Chip,
  Divider,
  LoadingState,
  ErrorState,
} from '../../src/components/ui';
import { useAsync } from '../../src/lib/useAsync';
import { devotionalProvider } from '../../src/providers';
import { useProgress } from '../../src/state/ProgressProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { CATEGORY_LABEL, CATEGORIES } from '../../src/data/mockData';
import { accentHex, pluralize } from '../../src/lib/format';
import { fonts } from '../../src/theme/typography';
import { NO_OUTLINE } from '../../src/lib/style';
import { useSaved } from '../../src/state/SavedProvider';

export default function PlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isPlanDayDone, togglePlanDay, getPlanProgress, savePlanNote } = useProgress();
  const { isSaved, toggleSave } = useSaved();

  const plan = useAsync(() => devotionalProvider.getPlan(id), [id]);
  const days = useAsync(() => devotionalProvider.getPlanDays(id), [id]);

  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  if (plan.loading || days.loading) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState />
      </Screen>
    );
  }
  if (plan.error || !plan.data) {
    return (
      <Screen>
        <ErrorState onRetry={plan.reload} />
      </Screen>
    );
  }

  const p = plan.data;
  const progress = getPlanProgress(p.id);
  const completion = progress.completedDays.length / p.days;
  const accent = accentHex[p.coverColor];
  const categoryAccent = CATEGORIES.find((c) => c.key === p.category)?.accent ?? 'navy';
  const nextDay = (days.data ?? []).find((d) => !isPlanDayDone(p.id, d.dayNumber));

  const openNote = (day: number) => {
    setNoteFor(day);
    setNoteText(progress.notes[day] ?? '');
  };
  const commitNote = () => {
    if (noteFor != null) savePlanNote(p.id, noteFor, noteText);
    setNoteFor(null);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
        <IconButton
          icon={isSaved('plan', p.id) ? 'bookmark' : 'bookmark-outline'}
          color={isSaved('plan', p.id) ? accent : undefined}
          onPress={() => toggleSave({ kind: 'plan', refId: p.id, title: p.title })}
          accessibilityLabel="Save plan"
        />
      </View>

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: accent }]}>
        {p.image ? (
          <>
            <Image source={p.image} style={styles.heroImage} resizeMode="cover" />
            <View style={[styles.heroImage, { backgroundColor: accent, opacity: 0.4 }]} />
            <View style={[styles.heroImage, { backgroundColor: 'rgba(7,16,31,0.3)' }]} />
          </>
        ) : null}
        <Ionicons name="leaf-outline" size={28} color="#FFF" style={{ opacity: 0.9 }} />
        <AppText variant="h3" weight="bold" serif style={{ color: '#FFF', marginTop: 10 }}>
          {p.title}
        </AppText>
        <View style={styles.heroMeta}>
          <View style={styles.heroPill}>
            <Ionicons name="calendar-outline" size={13} color="#FFF" />
            <AppText variant="overline" weight="semibold" style={{ color: '#FFF', marginLeft: 4 }}>
              {pluralize(p.days, 'day')}
            </AppText>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <Chip label={CATEGORY_LABEL[p.category]} accent={categoryAccent} />
        <AppText style={{ marginTop: 12, lineHeight: 24 }} tone="muted">
          {p.description}
        </AppText>
      </View>

      {/* Progress + CTA */}
      <Card style={{ marginTop: 16 }}>
        <View style={styles.progressTop}>
          <AppText weight="bold">{progress.completedDays.length} of {p.days} days</AppText>
          <AppText variant="caption" tone="muted">
            {Math.round(completion * 100)}%
          </AppText>
        </View>
        <View style={{ marginTop: 10 }}>
          <ProgressBar value={completion} color={accent} />
        </View>
        {nextDay ? (
          <View style={{ marginTop: 14 }}>
            <Button
              label={completion > 0 ? `Continue · Day ${nextDay.dayNumber}` : 'Start plan'}
              icon="play"
              onPress={() => router.push(`/plan-day/${p.id}/${nextDay.dayNumber}`)}
            />
          </View>
        ) : (
          <View style={[styles.complete, { backgroundColor: `${accent}1A` }]}>
            <Ionicons name="trophy" size={18} color={accent} />
            <AppText weight="semibold" style={{ color: accent, marginLeft: 8 }}>
              Plan complete — well done!
            </AppText>
          </View>
        )}
      </Card>

      {/* Days */}
      <AppText variant="h6" weight="bold" style={{ marginTop: 20, marginBottom: 10 }}>
        Daily readings
      </AppText>
      <Card>
        {(days.data ?? []).map((d, i) => {
          const done = isPlanDayDone(p.id, d.dayNumber);
          const hasNote = !!progress.notes[d.dayNumber];
          return (
            <View key={d.id}>
              {i > 0 ? <Divider spacing={2} /> : null}
              <View style={styles.dayRow}>
                <Pressable onPress={() => togglePlanDay(p.id, d.dayNumber)} hitSlop={8}>
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={done ? accent : colors.textMuted}
                  />
                </Pressable>
                <Pressable
                  style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.6 }]}
                  onPress={() => router.push(`/plan-day/${p.id}/${d.dayNumber}`)}
                >
                  <AppText weight="semibold" style={{ textDecorationLine: done ? 'line-through' : 'none' }} numberOfLines={1}>
                    Day {d.dayNumber}: {d.title}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {d.scriptureRef}
                  </AppText>
                </Pressable>
                <IconButton
                  icon={hasNote ? 'document-text' : 'document-text-outline'}
                  color={hasNote ? accent : colors.textMuted}
                  size={20}
                  onPress={() => openNote(d.dayNumber)}
                  accessibilityLabel="Add note"
                />
              </View>
            </View>
          );
        })}
      </Card>

      {/* Note editor */}
      <Modal visible={noteFor != null} transparent animationType="slide" onRequestClose={() => setNoteFor(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setNoteFor(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <AppText variant="h6" weight="bold">
                Day {noteFor} note
              </AppText>
              <IconButton icon="close" onPress={() => setNoteFor(null)} />
            </View>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="What is God showing you today?"
              placeholderTextColor={colors.textMuted}
              multiline
              style={[styles.noteInput, { color: colors.text, borderColor: colors.border, fontFamily: fonts.regular }, NO_OUTLINE]}
            />
            <Button label="Save note" onPress={commitNote} style={{ marginTop: 12 }} />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  hero: { borderRadius: 24, padding: 24, overflow: 'hidden' },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroMeta: { flexDirection: 'row', marginTop: 14 },
  heroPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  progressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  complete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingVertical: 12, borderRadius: 14 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,16,31,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, paddingBottom: 32 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  noteInput: { borderWidth: 1.5, borderRadius: 14, padding: 14, minHeight: 120, textAlignVertical: 'top', fontSize: 16 },
});
