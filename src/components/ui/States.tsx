import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { useTheme } from '../../theme/ThemeProvider';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="caption" tone="muted" style={{ marginTop: 12 }}>
        {label}
      </AppText>
    </View>
  );
}

export function EmptyState({
  icon = 'leaf-outline',
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={40} color={colors.textMuted} />
      <AppText variant="h6" weight="bold" center style={{ marginTop: 12 }}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="caption" tone="muted" center style={{ marginTop: 6, maxWidth: 280 }}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: 16 }}>
          <Button label={actionLabel} onPress={onAction} fullWidth={false} size="sm" />
        </View>
      ) : null}
    </View>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="Something went wrong"
      message="We couldn’t load this content. Please try again."
      actionLabel={onRetry ? 'Retry' : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
});
