import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, IconButton, Divider } from '../../src/components/ui';
import { usePreferences } from '../../src/state/PreferencesProvider';
import { LANGUAGES } from '../../src/data/languages';
import { useTheme } from '../../src/theme/ThemeProvider';

/** Language selector — persists the chosen app language. */
export default function LanguageSettings() {
  const router = useRouter();
  const { language, setLanguage } = usePreferences();
  const { colors } = useTheme();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">
          Language
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      <AppText tone="muted" style={{ marginBottom: 16 }}>
        Choose your preferred language for the app.
      </AppText>

      <Card>
        {LANGUAGES.map((lang, i) => {
          const selected = lang.code === language;
          return (
            <View key={lang.code}>
              {i > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => {
                  setLanguage(lang.code);
                  router.back();
                }}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
              >
                <View style={{ flex: 1 }}>
                  <AppText weight={selected ? 'bold' : 'medium'}>{lang.label}</AppText>
                  <AppText variant="caption" tone="muted">
                    {lang.native}
                  </AppText>
                </View>
                {selected ? <Ionicons name="checkmark-circle" size={22} color={colors.success} /> : null}
              </Pressable>
            </View>
          );
        })}
      </Card>

      <AppText variant="overline" tone="muted" center style={{ marginTop: 14 }}>
        Full in-app translation is rolling out. Your selection is saved now.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
});
