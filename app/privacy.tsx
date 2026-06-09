import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button } from '../src/components/ui';
import { useAuth } from '../src/auth/AuthProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { config } from '../src/lib/config';

const POINTS = [
  { icon: 'lock-closed-outline', text: 'Your reading, notes, and prayers are private to you by default.' },
  { icon: 'people-outline', text: 'You choose who to connect with. Friend requests are always opt-in.' },
  { icon: 'eye-off-outline', text: 'We never sell your personal data to third parties.' },
  { icon: 'trash-outline', text: 'You can export or delete your account and data at any time.' },
] as const;

/**
 * Privacy policy gate. Must be accepted before entering the app.
 * Declining signs the user out (handled by declinePrivacy()).
 */
export default function Privacy() {
  const { acceptPrivacy, declinePrivacy } = useAuth();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h4" weight="bold" center>
            Your privacy matters
          </AppText>
          <AppText tone="muted" center style={{ marginTop: 8, maxWidth: 320 }}>
            Before you begin, please review how Homewood Living Ministries cares for your information.
          </AppText>
        </View>

        <View style={[styles.points, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {POINTS.map((p, i) => (
            <View key={p.icon} style={[styles.point, i < POINTS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.pointIcon, { backgroundColor: `${palette.pine}1A` }]}>
                <Ionicons name={p.icon as keyof typeof Ionicons.glyphMap} size={20} color={palette.pine} />
              </View>
              <AppText style={{ flex: 1 }}>{p.text}</AppText>
            </View>
          ))}
        </View>

        <AppText variant="caption" tone="muted" center style={{ marginTop: 16 }}>
          Read the full Privacy Policy and Terms of Service at homewoodliving.org/privacy
          {'\n'}Policy version {config.privacyPolicyVersion}
        </AppText>
      </ScrollView>

      <View style={styles.actions}>
        <Button label="Agree & Continue" onPress={acceptPrivacy} />
        <Button label="Decline & Sign Out" variant="tertiary" onPress={declinePrivacy} style={{ marginTop: 4 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  header: { alignItems: 'center', marginBottom: 24 },
  points: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 16 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  pointIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actions: { paddingHorizontal: 20, paddingBottom: 8 },
});
