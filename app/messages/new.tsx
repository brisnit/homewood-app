import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Avatar, IconButton, Field, Divider } from '../../src/components/ui';
import { useMessages } from '../../src/state/MessagesProvider';
import { SUGGESTED_FRIENDS } from '../../src/data/mockData';
import { useTheme } from '../../src/theme/ThemeProvider';

/** Start a new conversation with a friend. */
export default function NewMessage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { startConversation } = useMessages();
  const [query, setQuery] = useState('');

  const people = SUGGESTED_FRIENDS.filter((f) =>
    [f.displayName, f.username].some((s) => s.toLowerCase().includes(query.toLowerCase())),
  );

  const open = (id: string, name: string) => {
    const convId = startConversation(`u-${id}`, name);
    router.replace(`/messages/${convId}`);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">New Message</AppText>
        <View style={{ width: 30 }} />
      </View>

      <Field icon="search-outline" placeholder="Search friends by name" value={query} onChangeText={setQuery} autoCapitalize="none" />

      <AppText variant="overline" weight="bold" tone="muted" style={{ marginTop: 6, marginBottom: 6, letterSpacing: 1 }}>
        FRIENDS
      </AppText>
      {people.map((f, i) => (
        <View key={f.id}>
          {i > 0 ? <Divider /> : null}
          <Pressable onPress={() => open(f.id, f.displayName)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
            <Avatar name={f.displayName} size={44} />
            <View style={{ flex: 1 }}>
              <AppText weight="semibold">{f.displayName}</AppText>
              <AppText variant="caption" tone="muted">@{f.username}</AppText>
            </View>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      ))}

      <Pressable onPress={() => router.push('/friends/add')} style={{ marginTop: 18, alignSelf: 'center' }} hitSlop={8}>
        <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>Find more friends</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
});
