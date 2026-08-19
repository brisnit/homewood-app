import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { useAuth } from '../../auth/AuthProvider';
import { useMessages } from '../../state/MessagesProvider';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';
import { DEFAULT_AVATAR } from '../../lib/assets';

interface AppHeaderProps {
  /** Large title. Omit when the screen supplies its own (e.g. Home's greeting). */
  title?: string;
  /** Small line above the title. */
  eyebrow?: string;
  /** Rendered in place of the title block — used by Home for its greeting. */
  children?: React.ReactNode;
}

/**
 * Standard top bar for the tab screens: title on the left, messages then
 * profile on the right.
 *
 * Profile left the bottom nav (Bible Study took its place), so the avatar here
 * is now the *only* way into it — it appears on every tab screen so it never
 * moves out from under people.
 */
export function AppHeader({ title, eyebrow, children }: AppHeaderProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const { unreadTotal } = useMessages();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {children ?? (
          <>
            {eyebrow ? (
              <AppText variant="overline" weight="bold" tone="muted" style={{ letterSpacing: 1 }}>
                {eyebrow}
              </AppText>
            ) : null}
            {title ? (
              <AppText variant="h3" weight="bold" numberOfLines={1}>
                {title}
              </AppText>
            ) : null}
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/messages')}
          accessibilityRole="button"
          accessibilityLabel={unreadTotal ? `Messages, ${unreadTotal} unread` : 'Messages'}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={21} color={colors.primary} />
          {unreadTotal > 0 ? (
            <View style={styles.badge}>
              <AppText variant="overline" weight="bold" style={{ color: '#FFF', fontSize: 10 }}>
                {unreadTotal > 9 ? '9+' : unreadTotal}
              </AppText>
            </View>
          ) : null}
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/you')}
          accessibilityRole="button"
          accessibilityLabel="Your profile"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Avatar
            name={profile?.displayName ?? 'Friend'}
            uri={profile?.avatarUrl ?? DEFAULT_AVATAR}
            size={40}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: palette.clay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
