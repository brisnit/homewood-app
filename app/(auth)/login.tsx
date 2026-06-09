import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Field, Screen, IconButton } from '../../src/components/ui';
import { SocialRow } from '../../src/components/auth/SocialRow';
import { useAuth } from '../../src/auth/AuthProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.includes('@') || password.length < 1) {
      setError('Enter a valid email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      // Guard routes onward to /privacy or /(tabs).
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to log in.');
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
          Welcome back
        </AppText>
        <AppText tone="muted" style={{ marginTop: 6, marginBottom: 24 }}>
          Log in to continue your journey in the Word.
        </AppText>

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
          placeholder="Your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={error ?? undefined}
        />

        <Pressable onPress={() => router.push('/(auth)/forgot-password')} hitSlop={8} style={{ alignSelf: 'flex-end' }}>
          <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>
            Forgot password?
          </AppText>
        </Pressable>

        <View style={{ height: 20 }} />
        <Button label="Log in" loading={loading} onPress={onSubmit} />
        <SocialRow />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          <AppText tone="muted">New here? </AppText>
          <Pressable onPress={() => router.replace('/(auth)/signup')}>
            <AppText weight="semibold" style={{ color: colors.link }}>
              Create an account
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
