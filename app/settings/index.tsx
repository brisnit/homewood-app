import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  Button,
  IconButton,
  SettingsRow,
  Divider,
} from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { usePreferences } from '../../src/state/PreferencesProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { languageLabel } from '../../src/data/languages';
import { ROLES } from '../../src/lib/roles';
import { ROLE_LABEL, LEVEL_LABEL, CAMPUSES } from '../../src/data/homewoodData';
import { LearningLevel, UserRole } from '../../src/types/models';

const LEVEL_OPTIONS: LearningLevel[] = ['beginner', 'growing', 'mature'];
type PickerKind = 'identity' | 'campus' | 'level' | null;

/** Account / settings hub. `?section=` deep-links the quick actions from You. */
export default function Settings() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const { signOut, profile, updateProfile } = useAuth();
  const { colors, isDark, toggleLowLight } = useTheme();
  const { language } = usePreferences();
  const { highlightCount } = useProgress();

  const [redLetters, setRedLetters] = useState(true);
  const [showAudio, setShowAudio] = useState(true);
  const [confirmOut, setConfirmOut] = useState(false);
  const [picker, setPicker] = useState<PickerKind>(null);

  const role = profile?.role ?? 'resident';
  const level = profile?.learningLevel ?? 'growing';

  // Surface the deep-linked section (Saved / Prayer / Giving) at the top.
  const sectionTitle =
    section === 'saved' ? 'Saved' : section === 'prayer' ? 'Prayer' : section === 'giving' ? 'Giving' : null;

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
        <AppText variant="h5" weight="bold">
          {sectionTitle ?? 'Settings'}
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      {sectionTitle ? (
        <Card style={{ marginBottom: 16 }}>
          <AppText tone="muted">
            Your {sectionTitle.toLowerCase()} will appear here. This MVP section is ready for content wiring.
          </AppText>
        </Card>
      ) : null}

      {/* Account */}
      <SettingsGroup title="Account">
        <SettingsRow icon="person-outline" label="Edit profile" onPress={() => router.push('/settings/edit-profile')} />
        <Divider />
        <SettingsRow icon="notifications-outline" label="Notification settings" onPress={() => router.push('/settings/notifications')} />
      </SettingsGroup>

      {/* Personalization — identity + learning level (also set during onboarding) */}
      <SettingsGroup title="Personalization">
        <SettingsRow icon="ribbon-outline" label="Identity" value={ROLE_LABEL[role]} onPress={() => setPicker('identity')} />
        <Divider />
        <SettingsRow icon="business-outline" label="Campus" value={profile?.campus ?? 'Not set'} onPress={() => setPicker('campus')} />
        <Divider />
        <SettingsRow icon="school-outline" label="Learning level" value={LEVEL_LABEL[level]} onPress={() => setPicker('level')} />
      </SettingsGroup>

      {/* General */}
      <SettingsGroup title="General">
        <SettingsRow icon="language-outline" label="Language" value={languageLabel(language)} onPress={() => router.push('/settings/language')} />
        <Divider />
        <SettingsRow icon="moon-outline" label="Low light / Dark mode" toggle toggleValue={isDark} onToggle={toggleLowLight} />
      </SettingsGroup>

      {/* Bible Reading */}
      <SettingsGroup title="Bible Reading">
        <SettingsRow icon="bookmarks-outline" label="My Verses" value={highlightCount > 0 ? String(highlightCount) : undefined} onPress={() => router.push('/settings/my-verses')} />
        <Divider />
        <SettingsRow icon="headset-outline" label="Audio & Voice" onPress={() => router.push('/settings/voice')} />
        <Divider />
        <SettingsRow icon="text-outline" label="Red letters" toggle toggleValue={redLetters} onToggle={setRedLetters} />
        <Divider />
        <SettingsRow icon="headset-outline" label="Show audio availability" toggle toggleValue={showAudio} onToggle={setShowAudio} />
      </SettingsGroup>

      <View style={{ marginTop: 8 }}>
        <Button label="Sign out" variant="ghost" icon="log-out-outline" onPress={() => setConfirmOut(true)} />
      </View>

      <AppText variant="overline" tone="muted" center style={{ marginTop: 20 }}>
        Homewood Living Ministries · v1.0.0
      </AppText>

      {/* Identity / Campus / Learning level picker */}
      <Modal visible={picker !== null} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setPicker(null)}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHead}>
              <AppText variant="h6" weight="bold">
                {picker === 'identity' ? 'I am a…' : picker === 'campus' ? 'Choose your campus' : 'Learning level'}
              </AppText>
              <IconButton icon="close" onPress={() => setPicker(null)} accessibilityLabel="Close" />
            </View>

            {picker === 'identity'
              ? ROLES.map((r) => (
                  <SettingsRow
                    key={r.key}
                    label={r.label}
                    value={role === r.key ? '✓' : undefined}
                    onPress={() => { updateProfile({ role: r.key as UserRole }); setPicker(null); }}
                  />
                ))
              : null}

            {picker === 'campus'
              ? CAMPUSES.map((c) => (
                  <SettingsRow
                    key={c}
                    label={c}
                    value={profile?.campus === c ? '✓' : undefined}
                    onPress={() => { updateProfile({ campus: c }); setPicker(null); }}
                  />
                ))
              : null}

            {picker === 'level'
              ? LEVEL_OPTIONS.map((l) => (
                  <SettingsRow
                    key={l}
                    label={LEVEL_LABEL[l]}
                    value={level === l ? '✓' : undefined}
                    onPress={() => { updateProfile({ learningLevel: l }); setPicker(null); }}
                  />
                ))
              : null}
          </View>
        </Pressable>
      </Modal>

      {/* Sign-out confirmation */}
      <Modal visible={confirmOut} transparent animationType="fade" onRequestClose={() => setConfirmOut(false)}>
        <Pressable style={styles.overlay} onPress={() => setConfirmOut(false)}>
          <Pressable style={styles.dialog} onPress={() => {}}>
            <View style={styles.dialogIcon}>
              <Ionicons name="log-out-outline" size={28} color="#C2613D" />
            </View>
            <AppText variant="h6" weight="bold" center style={{ marginTop: 12 }}>
              Sign out?
            </AppText>
            <AppText tone="muted" center style={{ marginTop: 6 }}>
              You’ll need to log back in to continue your journey.
            </AppText>
            <View style={{ marginTop: 20, width: '100%' }}>
              <Button label="Sign out" onPress={signOut} />
              <Button label="Cancel" variant="tertiary" onPress={() => setConfirmOut(false)} style={{ marginTop: 4 }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <AppText variant="overline" weight="bold" tone="muted" style={{ marginBottom: 8, letterSpacing: 1 }}>
        {title.toUpperCase()}
      </AppText>
      <Card>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(7,16,31,0.55)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  dialog: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', width: '100%', maxWidth: 360 },
  dialogIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#C2613D1A', alignItems: 'center', justifyContent: 'center' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(7,16,31,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, paddingBottom: 34 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
});
