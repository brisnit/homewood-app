import React from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Avatar, IconButton, Divider, Button } from '../../src/components/ui';
import { useMessages } from '../../src/state/MessagesProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

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

      {/* Prominent primary actions — Find Friends is never buried */}
      <View style={styles.actionsBlock}>
        <Button label="Find Friends" icon="person-add" onPress={() => router.push('/friends/add')} />
        <View style={styles.actionRow}>
          <View style={{ flex: 1 }}>
            <Button label="New Message" icon="create-outline" variant="secondary" size="sm" onPress={() => router.push('/messages/new')} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="New Group"
              icon="people-outline"
              variant="secondary"
              size="sm"
              onPress={() => Alert.alert('Group messaging', 'Group conversations are coming soon.')}
            />
          </View>
        </View>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: `${palette.pine}1A` }]}>
            <Ionicons name="chatbubbles-outline" size={30} color={palette.pine} />
          </View>
          <AppText variant="h5" weight="bold" center style={{ marginTop: 14 }}>Start a conversation</AppText>
          <AppText tone="muted" center style={{ marginTop: 6, maxWidth: 300 }}>
            Find people in the Homewood community, connect with friends, or begin a group conversation.
          </AppText>
        </View>
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
  actionsBlock: { gap: 10, marginBottom: 18 },
  actionRow: { flexDirection: 'row', gap: 10 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  adminAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: palette.clay, alignItems: 'center', justifyContent: 'center' },
});
