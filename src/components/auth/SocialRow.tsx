import React from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { useTheme } from '../../theme/ThemeProvider';

/**
 * Social login placeholders. Wired to friendly "coming soon" prompts.
 * TODO(auth): Hook up Apple / Google / Facebook OAuth via Supabase providers.
 */
const PROVIDERS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'apple', label: 'Apple', icon: 'logo-apple' },
  { key: 'google', label: 'Google', icon: 'logo-google' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
];

export function SocialRow() {
  const { colors } = useTheme();
  return (
    <View>
      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <AppText variant="overline" tone="muted" style={{ marginHorizontal: 10 }}>
          OR CONTINUE WITH
        </AppText>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>
      <View style={styles.row}>
        {PROVIDERS.map((p) => (
          <Pressable
            key={p.key}
            onPress={() => Alert.alert('Coming soon', `${p.label} sign-in will be available shortly.`)}
            style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Ionicons name={p.icon} size={22} color={colors.text} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  btn: {
    width: 64,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
