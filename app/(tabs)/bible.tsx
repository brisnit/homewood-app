import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppHeader,
  AppText,
  Card,
  Button,
  ProgressBar,
  Divider,
  SettingsRow,
  LoadingState,
  ErrorState,
  IconButton,
} from '../../src/components/ui';
import { ReadingRow } from '../../src/components/content/ReadingRow';
import { useAsync } from '../../src/lib/useAsync';
import { bibleProvider } from '../../src/providers';
import { useProgress } from '../../src/state/ProgressProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { TOTAL_DAYS, planMeta } from '../../src/data/bibleReadingPlans';
import { BibleReadingPlanId } from '../../src/types/models';

/**
 * "Read the Bible in a year." Members choose one of three classic methods —
 * canonical, chronological or blended — and each method keeps its own progress.
 * The 365-day schedules come from the Bible provider (Homewood-owned, never
 * blocked on YouVersion). Passage text opens the reader.
 */
export default function Bible() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    isBibleDayDone,
    toggleBibleDay,
    bibleCompletedCount,
    activeBiblePlan,
    setActiveBiblePlan,
  } = useProgress();

  // Today's position in the plan (deterministic for the MVP). Held in state so
  // marking a day complete doesn't yank today's reading out from under you.
  const [dayNumber, setDayNumber] = useState(() => (bibleCompletedCount % TOTAL_DAYS) + 1);
  const [translation, setTranslation] = useState('KJV');
  const [redLetters, setRedLetters] = useState(true);
  const [showAudio, setShowAudio] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [planPickerOpen, setPlanPickerOpen] = useState(false);

  // Switching methods jumps to that method's own next unread day.
  const lastPlan = useRef(activeBiblePlan);
  useEffect(() => {
    if (lastPlan.current === activeBiblePlan) return;
    lastPlan.current = activeBiblePlan;
    setDayNumber((bibleCompletedCount % TOTAL_DAYS) + 1);
  }, [activeBiblePlan, bibleCompletedCount]);

  const day = useAsync(
    () => bibleProvider.getReadingDay(activeBiblePlan, dayNumber),
    [activeBiblePlan, dayNumber],
  );
  const versions = useAsync(() => bibleProvider.getVersions(), []);
  const plans = useAsync(() => bibleProvider.getReadingPlans(), []);
  const done = isBibleDayDone(dayNumber);
  const activeVersion = versions.data?.find((v) => v.id === translation);
  const activePlan = planMeta(activeBiblePlan);
  const hasAudio = showAudio && activeVersion?.supportsAudio;

  const openPassage = (reference: string) =>
    router.push(`/reader?ref=${encodeURIComponent(reference)}&translation=${translation}&red=${redLetters ? 1 : 0}`);

  const choosePlan = (planId: BibleReadingPlanId) => {
    setActiveBiblePlan(planId);
    setPlanPickerOpen(false);
  };

  return (
    <Screen>
      <AppHeader title="Bible" />

      <View style={styles.header}>
        <AppText tone="muted" style={{ flex: 1 }}>
          One year. The whole story.
        </AppText>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={[styles.versionBtn, { backgroundColor: colors.surfaceAlt }]}
        >
          <AppText weight="bold" style={{ color: colors.primary }}>
            {translation}
          </AppText>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {/* Reading method — how you'll make your way through the Bible this year */}
      <Pressable
        onPress={() => setPlanPickerOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Reading method: ${activePlan.method}. Tap to change.`}
        style={({ pressed }) => [pressed && { opacity: 0.8 }]}
      >
        <Card style={{ marginBottom: 16 }}>
          <View style={styles.planRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="overline" tone="muted" weight="semibold" style={{ letterSpacing: 1 }}>
                READING METHOD
              </AppText>
              <View style={styles.planTitleRow}>
                <AppText variant="h6" weight="bold">
                  {activePlan.method}
                </AppText>
                <View style={[styles.planChip, { backgroundColor: `${palette.brass}22` }]}>
                  <AppText variant="overline" weight="semibold" style={{ color: palette.brass }}>
                    CHANGE
                  </AppText>
                </View>
              </View>
              <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                {activePlan.summary}
              </AppText>
            </View>
            <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
          </View>
        </Card>
      </Pressable>

      {/* Progress toward the full year */}
      <Card style={{ marginBottom: 16 }}>
        <View style={styles.progressTop}>
          <AppText weight="bold">Your progress</AppText>
          <AppText variant="caption" tone="muted">
            {bibleCompletedCount} / {TOTAL_DAYS} days
          </AppText>
        </View>
        <View style={{ marginTop: 10 }}>
          <ProgressBar value={bibleCompletedCount / TOTAL_DAYS} color={palette.pine} />
        </View>
        <AppText variant="caption" tone="muted" style={{ marginTop: 8 }}>
          Keep today’s readings and you’ll finish the Bible in a year.
        </AppText>
      </Card>

      {/* Today's reading */}
      {day.loading ? (
        <LoadingState />
      ) : day.error || !day.data ? (
        <ErrorState onRetry={day.reload} />
      ) : (
        <Card>
          <View style={styles.dayHeader}>
            <View>
              <AppText variant="overline" weight="bold" style={{ color: palette.brass, letterSpacing: 1 }}>
                TODAY · DAY {day.data.dayNumber}
              </AppText>
              <AppText variant="h6" weight="bold" style={{ marginTop: 2 }}>
                Today’s Reading
              </AppText>
            </View>
            {hasAudio ? (
              <View style={[styles.audioPill, { backgroundColor: `${palette.pine}1A` }]}>
                <Ionicons name="headset-outline" size={14} color={palette.pine} />
                <AppText variant="overline" weight="semibold" style={{ color: palette.pine, marginLeft: 4 }}>
                  Audio
                </AppText>
              </View>
            ) : null}
          </View>

          <Divider spacing={4} />
          {day.data.segments.map((segment, i) => (
            <React.Fragment key={`${segment.label}-${segment.passage.reference}`}>
              {i > 0 ? <Divider /> : null}
              <ReadingRow
                label={segment.label}
                passage={segment.passage}
                hasAudio={hasAudio}
                onPress={() => openPassage(segment.passage.reference)}
              />
            </React.Fragment>
          ))}

          <View style={{ marginTop: 16 }}>
            <Button
              label={done ? 'Completed for today ✓' : 'Mark day complete'}
              variant={done ? 'secondary' : 'primary'}
              icon={done ? 'checkmark-circle' : 'ellipse-outline'}
              onPress={() => toggleBibleDay(dayNumber)}
            />
          </View>
        </Card>
      )}

      {/* Reading preferences */}
      <Card style={{ marginTop: 16 }}>
        <AppText weight="bold" style={{ marginBottom: 4 }}>
          Reading options
        </AppText>
        <SettingsRow
          icon="text-outline"
          label="Red letters"
          value={activeVersion?.supportsRedLetter ? undefined : 'Not in this version'}
          toggle
          toggleValue={redLetters && (activeVersion?.supportsRedLetter ?? false)}
          onToggle={setRedLetters}
        />
        <Divider />
        <SettingsRow
          icon="headset-outline"
          label="Show audio availability"
          toggle
          toggleValue={showAudio}
          onToggle={setShowAudio}
        />
      </Card>

      {/* Reading method picker */}
      <Modal visible={planPickerOpen} transparent animationType="slide" onRequestClose={() => setPlanPickerOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPlanPickerOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <AppText variant="h6" weight="bold">
                Choose your reading method
              </AppText>
              <IconButton icon="close" onPress={() => setPlanPickerOpen(false)} />
            </View>
            <AppText variant="caption" tone="muted" style={{ marginBottom: 8 }}>
              About 15–20 minutes a day. Every method covers the whole Bible in 365 days, and each
              keeps its own progress.
            </AppText>
            <ScrollView>
              {(plans.data ?? []).map((plan) => {
                const selected = plan.id === activeBiblePlan;
                return (
                  <Pressable
                    key={plan.id}
                    onPress={() => choosePlan(plan.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={({ pressed }) => [
                      styles.planOption,
                      {
                        borderColor: selected ? palette.brass : colors.border,
                        backgroundColor: selected ? `${palette.brass}14` : 'transparent',
                      },
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <View style={styles.planOptionTop}>
                      <View style={{ flex: 1 }}>
                        <AppText weight="bold">{plan.method}</AppText>
                        <AppText variant="caption" tone="muted">
                          {plan.name}
                        </AppText>
                      </View>
                      <Ionicons
                        name={selected ? 'radio-button-on' : 'radio-button-off'}
                        size={22}
                        color={selected ? palette.brass : colors.textMuted}
                      />
                    </View>
                    <AppText variant="caption" style={{ marginTop: 8 }}>
                      {plan.description}
                    </AppText>
                    <AppText variant="overline" tone="muted" weight="semibold" style={{ marginTop: 8 }}>
                      {plan.sample.toUpperCase()}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Translation picker */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPickerOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <AppText variant="h6" weight="bold">
                Choose translation
              </AppText>
              <IconButton icon="close" onPress={() => setPickerOpen(false)} />
            </View>
            <ScrollView>
              {(versions.data ?? []).map((v) => (
                <SettingsRow
                  key={v.id}
                  label={`${v.id} — ${v.name}`}
                  value={[v.supportsRedLetter ? 'Red letter' : null, v.supportsAudio ? 'Audio' : null].filter(Boolean).join(' · ')}
                  onPress={() => {
                    setTranslation(v.id);
                    setPickerOpen(false);
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4, marginBottom: 16 },
  versionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  planChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  planOption: { borderWidth: 1.5, borderRadius: 16, padding: 14, marginBottom: 10 },
  planOptionTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  audioPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,16,31,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, maxHeight: '70%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
});
