import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  SectionHeader,
  HomewoodImage,
} from '../../src/components/ui';
import { COMMENTARY_SOURCES } from '../../src/data/homewoodData';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

const FEATURED_REF = 'Philippians 4:6-7';
const FEATURED_ROUTE = `/study/${encodeURIComponent(FEATURED_REF)}` as const;

// The Observe / Interpret / Apply study method.
const OIA_STEPS: { icon: keyof typeof Ionicons.glyphMap; label: string; description: string }[] = [
  { icon: 'eye-outline', label: 'Observe', description: 'What does the passage actually say?' },
  { icon: 'bulb-outline', label: 'Interpret', description: 'What did it mean to its first readers?' },
  { icon: 'walk-outline', label: 'Apply', description: 'How does it change how I live today?' },
];

// Study tool tiles rendered as a 2-column grid.
const STUDY_TOOLS: { icon: keyof typeof Ionicons.glyphMap; label: string; kind: 'passage' | 'guide' }[] = [
  { icon: 'library-outline', label: 'Commentary', kind: 'passage' },
  { icon: 'git-compare-outline', label: 'Cross References', kind: 'passage' },
  { icon: 'document-text-outline', label: 'Footnotes', kind: 'passage' },
  { icon: 'school-outline', label: 'Hermeneutics Guide', kind: 'guide' },
];

/** Study Bible hub — a warm entry point into passage study, tools, and commentary. */
export default function StudyHub() {
  const router = useRouter();
  const { colors } = useTheme();

  const openFeatured = () => router.push(FEATURED_ROUTE);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <AppText variant="h3" weight="bold" serif style={{ marginTop: 4 }}>
        Study Bible
      </AppText>
      <AppText tone="muted" style={{ marginTop: 4 }}>
        Understand the Word, verse by verse.
      </AppText>

      {/* Hero */}
      <Card onPress={openFeatured} padded={false} style={styles.heroCard}>
        <HomewoodImage
          name="scripture"
          height={160}
          radius={20}
          overlay={0.4}
          accessibilityLabel="How to study this passage"
        >
          <View style={styles.heroInner}>
            <AppText variant="h5" weight="bold" tone="inverse" serif>
              How to Study This Passage
            </AppText>
            <AppText variant="caption" tone="inverse" style={{ marginTop: 6, opacity: 0.92 }}>
              A guided walk through Philippians 4:6-7
            </AppText>
          </View>
        </HomewoodImage>
      </Card>

      {/* O-I-A Method */}
      <Card style={{ marginTop: 20 }}>
        <AppText weight="bold" style={{ marginBottom: 4 }}>
          The O-I-A Method
        </AppText>
        <AppText variant="caption" tone="muted" style={{ marginBottom: 14 }}>
          A simple, faithful way to study any passage.
        </AppText>
        {OIA_STEPS.map((step, i) => (
          <View key={step.label} style={[styles.oiaRow, i > 0 && { marginTop: 14 }]}>
            <View style={[styles.oiaIcon, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name={step.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="bold">{step.label}</AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                {step.description}
              </AppText>
            </View>
          </View>
        ))}
      </Card>

      {/* Featured passage */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Featured passage" />
      </View>
      <Card onPress={openFeatured}>
        <View style={styles.featuredRow}>
          <View style={[styles.featuredIcon, { backgroundColor: `${palette.brass}1A` }]}>
            <Ionicons name="bookmark" size={20} color={palette.brass} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bold" serif variant="h6">
              Philippians 4:6-7
            </AppText>
            <AppText tone="muted" style={{ marginTop: 4 }} numberOfLines={2}>
              Do not be anxious about anything…
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </Card>

      {/* Study Tools */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Study Tools" />
      </View>
      <View style={styles.grid}>
        {STUDY_TOOLS.map((tool) => (
          // Sizing wrapper: a pressable Card puts `style` on its inner view, so
          // the 48% width must live on an outer View to actually constrain it.
          <View key={tool.label} style={styles.toolCard}>
            <Card
              style={styles.toolCardBody}
              onPress={() =>
                tool.kind === 'passage'
                  ? openFeatured()
                  : Alert.alert('Study Bible', 'Guide coming soon.')
              }
            >
              <View style={[styles.toolIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={tool.icon} size={22} color={colors.primary} />
              </View>
              <AppText weight="semibold" style={styles.toolLabel} numberOfLines={2}>
                {tool.label}
              </AppText>
            </Card>
          </View>
        ))}
      </View>

      {/* Commentary Library */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Commentary Library" />
      </View>
      {/* TODO(api): integrate public-domain commentary corpora (Matthew Henry, TSK, etc.) via a content service. */}
      <Card>
        {COMMENTARY_SOURCES.map((source, i) => (
          <View
            key={source.id}
            style={[styles.commentaryRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
          >
            <View style={{ flex: 1 }}>
              <AppText weight="bold">{source.name}</AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                {source.era}
              </AppText>
            </View>
            {source.available ? (
              <View style={[styles.pill, { backgroundColor: `${palette.pine}1A` }]}>
                <AppText variant="overline" weight="bold" style={{ color: palette.pine }}>
                  Available
                </AppText>
              </View>
            ) : (
              <View style={[styles.pill, { backgroundColor: colors.surfaceAlt }]}>
                <AppText variant="overline" weight="bold" tone="muted">
                  Coming soon
                </AppText>
              </View>
            )}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: { marginTop: 18, overflow: 'hidden' },
  heroInner: { flex: 1, justifyContent: 'flex-end', padding: 18 },
  oiaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  oiaIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featuredRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featuredIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  toolCard: { width: '48%', marginBottom: 12 },
  // Uniform height so single-line (Commentary/Footnotes) and two-line
  // (Cross References/Hermeneutics Guide) cards match.
  toolCardBody: { minHeight: 132 },
  toolIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toolLabel: { marginTop: 10 },
  commentaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
});
