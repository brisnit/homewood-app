import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Button, IconButton } from '../../src/components/ui';
import { useJournal } from '../../src/state/JournalProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { fonts } from '../../src/theme/typography';
import { NO_OUTLINE } from '../../src/lib/style';

/**
 * Journal editor. `id` = 'new' creates an entry; otherwise edits an existing one.
 * `ref` query param pre-attaches a scripture reference (used by the Bible reader).
 */
export default function JournalEditor() {
  const { id, ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { getEntry, addEntry, updateEntry, deleteEntry } = useJournal();

  const isNew = id === 'new';
  const existing = useMemo(() => (isNew ? undefined : getEntry(id)), [id, isNew, getEntry]);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const scriptureRef = existing?.scriptureRef ?? ref ?? null;
  const bodyRef = useRef<TextInput>(null);

  const canSave = title.trim().length > 0 || body.trim().length > 0;

  const onSave = () => {
    if (!canSave) {
      router.back();
      return;
    }
    if (isNew) {
      addEntry({ title, body, scriptureRef });
    } else if (existing) {
      updateEntry(existing.id, { title, body });
    }
    router.back();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEntry(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText weight="bold">{isNew ? 'New Entry' : 'Edit Entry'}</AppText>
        {existing ? (
          <IconButton icon="trash-outline" color={colors.highlight} onPress={onDelete} accessibilityLabel="Delete entry" />
        ) : (
          <View style={{ width: 30 }} />
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scriptureRef ? (
          <View style={[styles.refPill, { backgroundColor: `${palette.slate}14` }]}>
            <Ionicons name="bookmark" size={13} color={palette.slate} />
            <AppText variant="caption" weight="semibold" style={{ color: palette.slate, marginLeft: 6 }}>
              {scriptureRef}
            </AppText>
          </View>
        ) : null}

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={colors.textMuted}
          autoFocus={isNew && !scriptureRef}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => bodyRef.current?.focus()}
          style={[styles.title, { color: colors.text, fontFamily: fonts.bold }, NO_OUTLINE]}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <TextInput
          ref={bodyRef}
          value={body}
          onChangeText={setBody}
          placeholder="What did you learn today? Write freely and meditate on it…"
          placeholderTextColor={colors.textMuted}
          multiline
          autoFocus={isNew && !!scriptureRef}
          textAlignVertical="top"
          style={[styles.body, { color: colors.text, fontFamily: fonts.serif }, NO_OUTLINE]}
        />

        <View style={styles.footer}>
          <Button label={isNew ? 'Save entry' : 'Save changes'} icon="checkmark" onPress={onSave} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  refPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginBottom: 12 },
  title: { fontSize: 24, paddingVertical: 6 },
  divider: { height: 1, marginVertical: 8 },
  body: { flex: 1, minHeight: 220, fontSize: 18, lineHeight: 28 },
  footer: { paddingVertical: 12 },
});
