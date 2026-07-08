import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Button, HomewoodImage } from '../src/components/ui';
import { useAuth } from '../src/auth/AuthProvider';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { ROLES } from '../src/lib/roles';
import { UserRole, LearningLevel } from '../src/types/models';

const LEVELS: { key: LearningLevel; label: string; blurb: string }[] = [
  { key: 'beginner', label: 'Beginner', blurb: 'New to the Bible and exploring faith.' },
  { key: 'growing', label: 'Growing', blurb: 'Building a steady rhythm in the Word.' },
  { key: 'mature', label: 'Mature', blurb: 'Deep in study and helping others grow.' },
];

/**
 * First-run onboarding: identify role + learning level. Saved to the profile,
 * then the navigation guard routes into the app. Both can be changed later in
 * Settings.
 */
export default function Onboarding() {
  const { profile, updateProfile, completeOnboarding } = useAuth();
  const { colors } = useTheme();

  const [step, setStep] = useState<0 | 1>(0);
  const [role, setRole] = useState<UserRole>(profile?.role ?? 'resident');
  const [level, setLevel] = useState<LearningLevel>(profile?.learningLevel ?? 'growing');

  const finish = async () => {
    updateProfile({ role, learningLevel: level });
    await completeOnboarding(); // guard redirects to the app
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <HomewoodImage name="peaceful" height={150} radius={20} overlay={0.35} accessibilityLabel="Welcome to Homewood Living">
        <View style={styles.heroInner}>
          <AppText variant="overline" weight="bold" style={{ color: palette.brass, letterSpacing: 1 }}>
            WELCOME TO
          </AppText>
          <AppText variant="h4" weight="bold" style={{ color: '#FFF' }}>
            Homewood Living
          </AppText>
        </View>
      </HomewoodImage>

      {/* Step indicator */}
      <View style={styles.dots}>
        {[0, 1].map((i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === step ? palette.navy : colors.border, width: i === step ? 26 : 8 }]} />
        ))}
      </View>

      {step === 0 ? (
        <>
          <AppText variant="h4" weight="bold" style={{ marginTop: 4 }}>Who are you joining as?</AppText>
          <AppText tone="muted" style={{ marginTop: 6, marginBottom: 20 }}>
            This helps us show you the most relevant content. You can change it anytime.
          </AppText>
          {ROLES.map((r) => (
            <SelectCard
              key={r.key}
              icon={r.key === 'resident' ? 'home' : r.key === 'employee' ? 'people' : 'heart'}
              title={r.label}
              blurb={r.blurb}
              selected={role === r.key}
              onPress={() => setRole(r.key)}
            />
          ))}
          <Button label="Continue" iconRight="arrow-forward" onPress={() => setStep(1)} style={{ marginTop: 12 }} />
        </>
      ) : (
        <>
          <AppText variant="h4" weight="bold" style={{ marginTop: 4 }}>Where are you in your walk?</AppText>
          <AppText tone="muted" style={{ marginTop: 6, marginBottom: 20 }}>
            We’ll gently meet you where you are. There’s no wrong answer.
          </AppText>
          {LEVELS.map((l) => (
            <SelectCard
              key={l.key}
              icon={l.key === 'beginner' ? 'leaf-outline' : l.key === 'growing' ? 'trending-up' : 'book'}
              title={l.label}
              blurb={l.blurb}
              selected={level === l.key}
              onPress={() => setLevel(l.key)}
            />
          ))}
          <Button label="Enter Homewood Living" iconRight="arrow-forward" onPress={finish} style={{ marginTop: 12 }} />
          <Button label="Back" variant="tertiary" onPress={() => setStep(0)} style={{ marginTop: 2 }} />
        </>
      )}
    </Screen>
  );
}

function SelectCard({
  icon,
  title,
  blurb,
  selected,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  blurb: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: selected ? palette.navy : colors.border, borderWidth: selected ? 2 : 1 },
      ]}
    >
      <View style={[styles.cardIcon, { backgroundColor: selected ? palette.navy : colors.surfaceAlt }]}>
        <Ionicons name={icon} size={22} color={selected ? '#FFF' : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="h6" weight="bold">{title}</AppText>
        <AppText variant="caption" tone="muted">{blurb}</AppText>
      </View>
      <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={selected ? palette.navy : colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroInner: { flex: 1, padding: 18, justifyContent: 'flex-end' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 18, marginBottom: 18 },
  dot: { height: 8, borderRadius: 4 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18, marginBottom: 12 },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
