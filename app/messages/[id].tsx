import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Avatar, IconButton, EmptyState } from '../../src/components/ui';
import { useMessages } from '../../src/state/MessagesProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';
import { NO_OUTLINE } from '../../src/lib/style';

function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { getConversation, send, markRead } = useMessages();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const conv = getConversation(id);

  // Mark read on open.
  useEffect(() => {
    if (conv) markRead(conv.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!conv) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
        <EmptyState icon="chatbubble-outline" title="Conversation not found" />
      </Screen>
    );
  }

  const isAdmin = conv.kind === 'admin';

  const onSend = () => {
    if (!draft.trim()) return;
    send(conv.id, draft);
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <Screen scroll={false} padded={false}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        {isAdmin ? (
          <View style={[styles.adminAvatar, { backgroundColor: palette.navy }]}>
            <Ionicons name="megaphone" size={16} color={palette.brass} />
          </View>
        ) : (
          <Avatar name={conv.partyName} size={34} />
        )}
        <View style={{ flex: 1 }}>
          <AppText weight="bold" numberOfLines={1}>{conv.partyName}</AppText>
          {conv.subtitle || isAdmin ? (
            <AppText variant="overline" tone="muted">{conv.subtitle ?? 'Announcements'}</AppText>
          ) : null}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.thread}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        >
          {conv.messages.length === 0 ? (
            <AppText tone="muted" center style={{ marginTop: 40 }}>
              Say hello 👋
            </AppText>
          ) : (
            conv.messages.map((m) => {
              const mine = m.senderId === 'me';
              return (
                <View key={m.id} style={[styles.bubbleRow, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
                  <View
                    style={[
                      styles.bubble,
                      mine
                        ? { backgroundColor: palette.navy, borderBottomRightRadius: 4 }
                        : { backgroundColor: isAdmin ? '#FFF' : colors.surface, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
                    ]}
                  >
                    {!mine && isAdmin ? (
                      <AppText variant="overline" weight="bold" style={{ color: palette.brass, marginBottom: 3 }}>
                        {m.senderName.toUpperCase()}
                      </AppText>
                    ) : null}
                    <AppText style={{ color: mine ? '#FBF7EF' : colors.text, lineHeight: 22 }}>{m.text}</AppText>
                    <AppText variant="overline" style={{ color: mine ? 'rgba(251,247,239,0.6)' : colors.textMuted, marginTop: 4, alignSelf: 'flex-end' }}>
                      {clockTime(m.createdAt)}
                    </AppText>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={isAdmin ? 'Reply to Homewood…' : `Message ${conv.partyName.split(' ')[0]}…`}
            placeholderTextColor={colors.textMuted}
            multiline
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, fontFamily: fonts.regular }, NO_OUTLINE]}
          />
          <Pressable
            onPress={onSend}
            disabled={!draft.trim()}
            style={[styles.sendBtn, { backgroundColor: draft.trim() ? palette.navy : colors.border }]}
            accessibilityLabel="Send message"
          >
            <Ionicons name="arrow-up" size={20} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 10, borderBottomWidth: 1 },
  adminAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  thread: { padding: 16, paddingBottom: 8, gap: 10 },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderWidth: 1, borderRadius: 22, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11, fontSize: 16 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
