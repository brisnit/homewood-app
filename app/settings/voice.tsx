import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import {
  Screen,
  AppText,
  Card,
  Button,
  IconButton,
  Divider,
  SegmentedTabs,
  LoadingState,
} from '../../src/components/ui';
import { usePreferences } from '../../src/state/PreferencesProvider';
import { getEnglishVoices, voiceLabel, SimpleVoice } from '../../src/lib/speech';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

const SAMPLE = 'The Lord is my shepherd; I shall not want.';

const SPEEDS = [
  { key: '0.75', label: 'Slow' },
  { key: '0.9', label: 'Normal' },
  { key: '1', label: 'Faster' },
  { key: '1.25', label: 'Fast' },
];

/** Audio & Voice settings — choose the narration voice and reading speed. */
export default function VoiceSettings() {
  const router = useRouter();
  const { colors } = useTheme();
  const { audio, setAudio } = usePreferences();
  const [voices, setVoices] = useState<SimpleVoice[] | null>(null);

  useEffect(() => {
    getEnglishVoices().then(setVoices);
    return () => {
      Speech.stop();
    };
  }, []);

  const preview = (voiceId: string | null) => {
    Speech.stop();
    Speech.speak(SAMPLE, { voice: voiceId ?? undefined, rate: audio.rate });
  };

  const selectVoice = (voiceId: string | null) => {
    setAudio({ voiceId });
    preview(voiceId);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => { Speech.stop(); router.back(); }} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">
          Audio &amp; Voice
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      <AppText tone="muted" style={{ marginBottom: 16 }}>
        Choose the voice and pace for listening to the Bible read aloud.
      </AppText>

      {/* Speed */}
      <AppText variant="overline" weight="bold" tone="muted" style={{ marginBottom: 8, letterSpacing: 1 }}>
        READING SPEED
      </AppText>
      <View style={{ marginBottom: 8 }}>
        <SegmentedTabs
          tabs={SPEEDS}
          value={normalizeRate(audio.rate)}
          onChange={(k) => setAudio({ rate: parseFloat(k) })}
        />
      </View>
      <Button label="Preview speed" icon="volume-medium-outline" variant="secondary" size="sm" onPress={() => preview(audio.voiceId)} style={{ marginBottom: 22 }} />

      {/* Voice */}
      <AppText variant="overline" weight="bold" tone="muted" style={{ marginBottom: 8, letterSpacing: 1 }}>
        VOICE
      </AppText>

      {voices === null ? (
        <LoadingState label="Loading voices…" />
      ) : (
        <Card>
          <VoiceRow
            label="Device default"
            sub="Your system’s standard voice"
            selected={audio.voiceId === null}
            onPress={() => selectVoice(null)}
            onPreview={() => preview(null)}
            color={colors.success}
          />
          {voices.map((v) => (
            <View key={v.id}>
              <Divider />
              <VoiceRow
                label={voiceLabel(v)}
                sub={v.language.toUpperCase()}
                selected={audio.voiceId === v.id}
                onPress={() => selectVoice(v.id)}
                onPreview={() => preview(v.id)}
                color={colors.success}
              />
            </View>
          ))}
        </Card>
      )}

      {voices !== null && voices.length === 0 ? (
        <AppText variant="caption" tone="muted" center style={{ marginTop: 12 }}>
          No selectable voices were found on this device — your system default will be used.
        </AppText>
      ) : null}

      <AppText variant="overline" tone="muted" center style={{ marginTop: 16 }}>
        Narration uses on-device text-to-speech. Available voices depend on your device.
      </AppText>
    </Screen>
  );
}

function VoiceRow({
  label,
  sub,
  selected,
  onPress,
  onPreview,
  color,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onPress: () => void;
  onPreview: () => void;
  color: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={{ flex: 1 }}>
        <AppText weight={selected ? 'bold' : 'medium'} numberOfLines={1}>
          {label}
        </AppText>
        {sub ? (
          <AppText variant="caption" tone="muted">
            {sub}
          </AppText>
        ) : null}
      </View>
      <Pressable onPress={onPreview} hitSlop={8} style={styles.playSample}>
        <Ionicons name="play" size={14} color={color} />
      </Pressable>
      {selected ? <Ionicons name="checkmark-circle" size={22} color={color} style={{ marginLeft: 10 }} /> : <View style={{ width: 32 }} />}
    </Pressable>
  );
}

function normalizeRate(rate: number): string {
  const key = String(rate);
  return SPEEDS.some((s) => s.key === key) ? key : '0.9';
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  playSample: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: '#3E7C6B', alignItems: 'center', justifyContent: 'center' },
});
