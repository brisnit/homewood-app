import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  Screen,
  AppText,
  Card,
  Button,
  Chip,
  SectionHeader,
  IconButton,
  Divider,
} from '../../src/components/ui';
import { STUDY_PASSAGE_SAMPLE } from '../../src/data/homewoodData';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

const THEME_ACCENTS = ['navy', 'brass', 'clay', 'pine', 'slate'] as const;

/** Study passage screen — the worked example of studying a passage in depth. */
export default function StudyPassageScreen() {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const passage = STUDY_PASSAGE_SAMPLE;
  const decoded = ref ? decodeURIComponent(ref) : passage.reference;

  const openReader = (reference: string) =>
    router.push(`/reader?ref=${encodeURIComponent(reference)}&translation=KJV`);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
      </View>

      <AppText variant="h4" weight="bold" serif>
        {decoded}
      </AppText>

      <Button
        label="Read full passage"
        icon="book-outline"
        onPress={() => openReader(passage.reference)}
        style={{ marginTop: 16 }}
      />

      {/* Background */}
      <View style={{ marginTop: 28 }}>
        <SectionHeader title="Background" />
      </View>
      <Card>
        <AppText style={{ lineHeight: 26 }}>{passage.background}</AppText>
      </Card>

      {/* Key Themes */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Key Themes" />
      </View>
      <View style={styles.chipRow}>
        {passage.keyThemes.map((theme, i) => (
          <Chip key={theme} label={theme} accent={THEME_ACCENTS[i % THEME_ACCENTS.length]} />
        ))}
      </View>

      {/* How to Study This Passage */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="How to Study This Passage" />
      </View>
      <Card>
        {passage.howToStudy.map((item, i) => {
          const idx = item.indexOf(': ');
          const label = idx > -1 ? item.slice(0, idx) : '';
          const rest = idx > -1 ? item.slice(idx + 2) : item;
          return (
            <View key={i} style={[styles.studyRow, i > 0 && { marginTop: 14 }]}>
              <AppText style={{ lineHeight: 26 }}>
                {label ? <AppText weight="bold">{label}: </AppText> : null}
                {rest}
              </AppText>
            </View>
          );
        })}
      </Card>

      {/* Cross References */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Cross References" />
      </View>
      <Card>
        {passage.crossReferences.map((cr, i) => (
          <View key={cr.ref}>
            {i > 0 ? <Divider /> : null}
            <Pressable
              onPress={() => openReader(cr.ref)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${cr.ref}`}
              style={({ pressed }) => [styles.crossRow, pressed && { opacity: 0.6 }]}
            >
              <AppText weight="bold" tone="link">
                {cr.ref}
              </AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: 3, lineHeight: 22 }}>
                {cr.note}
              </AppText>
            </Pressable>
          </View>
        ))}
      </Card>

      {/* Footnotes */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Footnotes" />
      </View>
      <Card>
        {passage.footnotes.map((fn, i) => (
          <View key={fn.marker} style={[styles.footnoteRow, i > 0 && { marginTop: 12 }]}>
            <AppText variant="overline" weight="bold" style={{ color: palette.brass, marginTop: 2 }}>
              {fn.marker}
            </AppText>
            <AppText style={{ flex: 1, lineHeight: 24 }}>{fn.text}</AppText>
          </View>
        ))}
      </Card>

      {/* Questions for Reflection */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Questions for Reflection" />
      </View>
      <Card>
        {passage.reflectionQuestions.map((q, i) => (
          <View key={i} style={[styles.questionRow, i > 0 && { marginTop: 14 }]}>
            <View style={[styles.questionNum, { backgroundColor: colors.surfaceAlt }]}>
              <AppText weight="bold" variant="caption" style={{ color: colors.primary }}>
                {i + 1}
              </AppText>
            </View>
            <AppText style={{ flex: 1, lineHeight: 26 }}>{q}</AppText>
          </View>
        ))}
      </Card>

      {/* Commentary */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Commentary" />
      </View>
      {passage.commentaryPreview.map((c, i) => (
        <Card key={c.source} style={i > 0 ? { marginTop: 12 } : undefined}>
          <AppText weight="bold" style={{ marginBottom: 8 }}>
            {c.source}
          </AppText>
          <AppText serif style={{ lineHeight: 26 }}>
            {c.text}
          </AppText>
        </Card>
      ))}

      {/* Related Resources */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Related Resources" />
      </View>
      <Button
        label="Browse resources"
        variant="secondary"
        icon="albums-outline"
        onPress={() => router.push('/resources')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  studyRow: {},
  crossRow: { paddingVertical: 14 },
  footnoteRow: { flexDirection: 'row', gap: 10 },
  questionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  questionNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
