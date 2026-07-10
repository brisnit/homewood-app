import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Avatar, IconButton, Divider, EmptyState } from '../../src/components/ui';
import { useMessages } from '../../src/state/MessagesProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { Conversation } from '../../src/types/models';

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Messages inbox — admin announcements and friend conversations. */
export default function MessagesInbox() {
  const router = useRouter();
  const { colors } = useTheme();
  const { conversations, unreadCount } = useMessages();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">Messages</AppText>
        <IconButton icon="create-outline" onPress={() => router.push('/messages/new')} accessibilityLabel="New message" />
      </View>

      {conversations.length === 0 ? (
        <EmptyState icon="chatbubbles-outline" title="No messages yet" message="Announcements from Homewood and chats with friends will appear here." />
      ) : (
        conversations.map((c, i) => {
          const last = c.messages[c.messages.length - 1];
          const unread = unreadCount(c);
          return (
            <View key={c.id}>
              {i > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => router.push(`/messages/${c.id}`)}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
                accessibilityLabel={`Open conversation with ${c.partyName}`}
              >
                {c.kind === 'admin' ? (
                  <View style={[styles.adminAvatar, { backgroundColor: palette.navy }]}>
                    <Ionicons name="megaphone" size={20} color={palette.brass} />
                  </View>
                ) : (
                  <Avatar name={c.partyName} size={48} />
                )}
                <View style={{ flex: 1 }}>
                  <View style={styles.rowTop}>
                    <View style={styles.nameRow}>
                      <AppText weight={unread ? 'bold' : 'semibold'} numberOfLines={1}>{c.partyName}</AppText>
                      {c.kind === 'admin' ? (
                        <View style={[styles.tag, { backgroundColor: `${palette.brass}22` }]}>
                          <AppText variant="overline" weight="bold" style={{ color: '#8a6d1f' }}>HOMEWOOD</AppText>
                        </View>
                      ) : null}
                    </View>
                    <AppText variant="overline" tone="muted">{last ? timeAgo(last.createdAt) : ''}</AppText>
                  </View>
                  <View style={styles.rowTop}>
                    <AppText
                      variant="caption"
                      tone={unread ? 'default' : 'muted'}
                      numberOfLines={1}
                      style={{ flex: 1, marginTop: 2 }}
                    >
                      {last ? (last.senderId === 'me' ? 'You: ' : '') + last.text : 'No messages yet'}
                    </AppText>
                    {unread ? (
                      <View style={styles.badge}>
                        <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>{unread}</AppText>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  adminAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: palette.clay, alignItems: 'center', justifyContent: 'center' },
});
