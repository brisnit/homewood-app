import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, IconButton } from '../src/components/ui';
import { useAuth } from '../src/auth/AuthProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import {
  STANDARDS_VERSION, STANDARDS_INTRO, STANDARDS_SECTIONS, STANDARDS_CLOSING, STANDARDS_SUMMARY,
} from '../src/data/standards';

/**
 * Standards of Conduct.
 *
 * Serves two jobs from one copy of the text:
 *   • Signup gate — reached by the router guard after Privacy, with an explicit
 *     "I have read and agree" checkbox before the accept button unlocks.
 *   • Reference — opened from the small print at the bottom of Profile, where it
 *     is read-only with a back button.
 */
export default function Standards() {
  const router = useRouter();
  const { standardsAccepted, acceptStandards, declineStandards } = useAuth();
  const { colors } = useTheme();
  const [agreed, setAgreed] = useState(false);

  const gate = !standardsAccepted;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {!gate ? (
        <View style={styles.topBar}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.crest, { backgroundColor: `${palette.navy}12` }]}>
            <Ionicons name="shield-checkmark-outline" size={26} color={palette.navy} />
          </View>
          <AppText variant="h4" weight="bold" serif center style={{ marginTop: 12 }}>
            Standards of Conduct
          </AppText>
          <AppText tone="muted" center style={{ marginTop: 8, lineHeight: 24 }}>
            {STANDARDS_INTRO}
          </AppText>
        </View>

        {/* At-a-glance summary — the full text follows. */}
        {gate ? (
          <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {STANDARDS_SUMMARY.map((s, i) => (
              <View
                key={s.text}
                style={[
                  styles.summaryRow,
                  i < STANDARDS_SUMMARY.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={[styles.summaryIcon, { backgroundColor: `${palette.pine}1A` }]}>
                  <Ionicons name={s.icon as keyof typeof Ionicons.glyphMap} size={18} color={palette.pine} />
                </View>
                <AppText style={{ flex: 1 }}>{s.text}</AppText>
              </View>
            ))}
          </View>
        ) : null}

        {STANDARDS_SECTIONS.map((section) => (
          <View key={section.id} style={styles.section}>
            <AppText variant="h6" weight="bold" serif>{section.heading}</AppText>
            {section.body.map((p, i) => (
              <AppText key={i} tone="muted" style={{ marginTop: 8, lineHeight: 26 }}>{p}</AppText>
            ))}
            {section.points ? (
              <View style={{ marginTop: 12, gap: 10 }}>
                {section.points.map((point) => (
                  <View key={point} style={styles.point}>
                    <Ionicons name="checkmark-circle" size={17} color={palette.pine} style={{ marginTop: 2 }} />
                    <AppText style={{ flex: 1, lineHeight: 24 }}>{point}</AppText>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}

        <AppText tone="muted" style={{ marginTop: 24, lineHeight: 26 }}>{STANDARDS_CLOSING}</AppText>

        <AppText variant="caption" tone="muted" center style={{ marginTop: 20 }}>
          Version {STANDARDS_VERSION}
          {'\n'}Questions? Reach the chaplaincy through Messages.
        </AppText>

        {/* The agree checkbox sits at the end of the text, so it can only be
            reached by scrolling past what it agrees to. */}
        {gate ? (
          <Pressable
            onPress={() => setAgreed((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            accessibilityLabel="I have read and agree to the Standards of Conduct"
            style={({ pressed }) => [
              styles.agree,
              { backgroundColor: colors.surface, borderColor: agreed ? palette.pine : colors.border },
              pressed && { opacity: 0.75 },
            ]}
          >
            <View
              style={[
                styles.checkbox,
                agreed
                  ? { backgroundColor: palette.pine, borderColor: palette.pine }
                  : { borderColor: colors.border },
              ]}
            >
              {agreed ? <Ionicons name="checkmark" size={16} color="#FFF" /> : null}
            </View>
            <AppText weight="semibold" style={{ flex: 1 }}>
              I have read and agree to the Standards of Conduct.
            </AppText>
          </Pressable>
        ) : null}
      </ScrollView>

      {gate ? (
        <View style={[styles.actions, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <Button label="Agree & Continue" disabled={!agreed} onPress={acceptStandards} />
          {!agreed ? (
            <AppText variant="caption" tone="muted" center style={{ marginTop: 8 }}>
              Read through and tick the box above to continue.
            </AppText>
          ) : null}
          <Button label="Decline & Sign Out" variant="tertiary" onPress={declineStandards} style={{ marginTop: 4 }} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { paddingHorizontal: 12, paddingTop: 4 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  header: { alignItems: 'center', marginBottom: 20 },
  crest: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  summary: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  summaryIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  section: { marginTop: 24 },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderRadius: 18, padding: 16, marginTop: 24 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  actions: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1 },
});
