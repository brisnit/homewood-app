import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../src/components/ui';

// Brand navy sampled from the logo asset so the lockup sits seamlessly.
const BG = '#0E1C3F';
const logo = require('../../assets/homewood-white.png');

/** Warm, branded welcome screen. */
export default function Welcome() {
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: BG }]}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        {/* Logo + blurb */}
        <View style={styles.top}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.divider} />
          <AppText center style={styles.blurb}>
            A daily place to meet God in His Word. Build faithful habits, and walk alongside friends.
          </AppText>
        </View>

        <View style={{ flex: 1.3 }} />

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/(auth)/signup')} hitSlop={10}>
            <AppText center style={styles.createLink}>
              Create an account
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(auth)/login')}
            style={({ pressed }) => [styles.pill, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
          >
            <AppText weight="medium" style={styles.pillText}>
              Log in
            </AppText>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <AppText center style={styles.terms}>
          by continuing you agree to our terms & privacy
        </AppText>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1, paddingHorizontal: 28 },
  top: { alignItems: 'center', marginTop: 56 },
  logo: { width: 240, height: 150 },
  divider: {
    width: '78%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: 34,
    marginBottom: 40,
  },
  blurb: {
    color: '#E7E9EF',
    fontSize: 23,
    lineHeight: 38,
    maxWidth: 320,
  },
  actions: { alignItems: 'center' },
  createLink: {
    color: '#D6DBE6',
    fontSize: 17,
    marginBottom: 16,
  },
  pill: {
    alignSelf: 'stretch',
    height: 58,
    borderRadius: 999,
    backgroundColor: '#E9DCC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: { color: '#1B2B4D', fontSize: 18 },
  terms: { color: '#6B7693', fontSize: 12, marginBottom: 8 },
});
