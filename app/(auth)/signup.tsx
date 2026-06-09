import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Field, Screen, IconButton } from '../../src/components/ui';
import { SocialRow } from '../../src/components/auth/SocialRow';
import { useAuth } from '../../src/auth/AuthProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name.trim()) return setError('Please tell us your name.');
    if (!email.includes('@')) return setError('Enter a valid email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    setError(null);
    try {
      await signUp(email.trim(), password, name.trim());
      // Guard routes to /privacy next.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
        </View>
        <AppText variant="h3" weight="bold" style={{ marginTop: 12 }}>
          Create your account
        </AppText>
        <AppText tone="muted" style={{ marginTop: 6, marginBottom: 24 }}>
          Begin a daily rhythm of Scripture and prayer.
        </AppText>

        <Field label="Full name" icon="person-outline" placeholder="Jordan Avery" value={name} onChangeText={setName} />
        <Field
          label="Email"
          icon="mail-outline"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Field
          label="Password"
          icon="lock-closed-outline"
          placeholder="At least 6 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={error ?? undefined}
        />

        <View style={{ height: 8 }} />
        <Button label="Create account" loading={loading} onPress={onSubmit} />
        <SocialRow />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          <AppText tone="muted">Already have an account? </AppText>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <AppText weight="semibold" style={{ color: colors.link }}>
              Log in
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
