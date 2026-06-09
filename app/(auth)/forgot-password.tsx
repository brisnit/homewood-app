import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Field, Screen, IconButton, EmptyState } from '../../src/components/ui';
import { supabase, isSupabaseEnabled } from '../../src/lib/supabase';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.includes('@')) return setError('Enter a valid email.');
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseEnabled && supabase) {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (err) throw err;
      }
      // In mock mode we simply confirm — no email is actually sent.
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={{ marginTop: 8, marginBottom: 8 }}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
      </View>

      {sent ? (
        <EmptyState
          icon="mail-open-outline"
          title="Check your inbox"
          message={`If an account exists for ${email}, we’ve sent a link to reset your password.`}
          actionLabel="Back to log in"
          onAction={() => router.replace('/(auth)/login')}
        />
      ) : (
        <>
          <AppText variant="h3" weight="bold" style={{ marginTop: 12 }}>
            Reset password
          </AppText>
          <AppText tone="muted" style={{ marginTop: 6, marginBottom: 24 }}>
            Enter your email and we’ll send you a link to get back in.
          </AppText>
          <Field
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={error ?? undefined}
          />
          <Button label="Send reset link" loading={loading} onPress={onSubmit} />
        </>
      )}
    </Screen>
  );
}
