import React, { useState } from 'react';
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

const TOTAL_DAYS = 365;

/**
 * "Read the Bible in a year." The 365-day schedule comes from the Bible provider
 * (Homewood-owned, never blocked on YouVersion). Passage text opens the reader.
 */
export default function Bible() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isBibleDayDone, toggleBibleDay, bibleCompletedCount } = useProgress();

  // Today's position in the plan (deterministic for the MVP).
  const [dayNumber] = useState(() => (bibleCompletedCount % TOTAL_DAYS) + 1);
  const [translation, setTranslation] = useState('KJV');
  const [redLetters, setRedLetters] = useState(true);
  const [showAudio, setShowAudio] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  const day = useAsync(() => bibleProvider.getReadingDay(dayNumber), [dayNumber]);
  const versions = useAsync(() => bibleProvider.getVersions(), []);
  const done = isBibleDayDone(dayNumber);
  const activeVersion = versions.data?.find((v) => v.id === translation);

  const openPassage = (reference: string) =>
    router.push(`/reader?ref=${encodeURIComponent(reference)}&translation=${translation}&red=${redLetters ? 1 : 0}`);

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
            {activeVersion?.supportsAudio && showAudio ? (
              <View style={[styles.audioPill, { backgroundColor: `${palette.pine}1A` }]}>
                <Ionicons name="headset-outline" size={14} color={palette.pine} />
                <AppText variant="overline" weight="semibold" style={{ color: palette.pine, marginLeft: 4 }}>
                  Audio
                </AppText>
              </View>
            ) : null}
          </View>

          <Divider spacing={4} />
          <ReadingRow label="Old Testament" passage={day.data.oldTestament} hasAudio={showAudio && activeVersion?.supportsAudio} onPress={() => openPassage(day.data!.oldTestament.reference)} />
          <Divider />
          <ReadingRow label="New Testament" passage={day.data.newTestament} hasAudio={showAudio && activeVersion?.supportsAudio} onPress={() => openPassage(day.data!.newTestament.reference)} />
          {day.data.psalmOrProverb ? (
            <>
              <Divider />
              <ReadingRow label="Psalm / Proverb" passage={day.data.psalmOrProverb} hasAudio={showAudio && activeVersion?.supportsAudio} onPress={() => openPassage(day.data!.psalmOrProverb!.reference)} />
            </>
          ) : null}

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
  progressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  audioPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,16,31,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, maxHeight: '70%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
});
