import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Card,
  Button,
  SegmentedTabs,
  EmptyState,
  IconButton,
} from '../../src/components/ui';
import { useJournal } from '../../src/state/JournalProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { JournalEntry } from '../../src/types/models';

type Tab = 'reflections' | 'scripture';

const PROMPTS = [
  'What did God show you today?',
  'Where did you sense peace, or its absence?',
  'What truth do you want to carry into tomorrow?',
];

/** Journal: write reflections and revisit notes captured during scripture reading. */
export default function Journal() {
  const router = useRouter();
  const { colors } = useTheme();
  const { reflections, scriptureNotes } = useJournal();
  const [tab, setTab] = useState<Tab>('reflections');

  const list = tab === 'reflections' ? reflections : scriptureNotes;
  // A gentle rotating prompt (stable per render set).
  const prompt = PROMPTS[(reflections.length + scriptureNotes.length) % PROMPTS.length];

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="h3" weight="bold">
            Journal
          </AppText>
          <AppText tone="muted" style={{ marginTop: 4 }}>
            Reflect, meditate, and remember.
          </AppText>
        </View>
        <IconButton icon="add-circle" size={30} color={colors.primary} onPress={() => router.push('/journal/new')} accessibilityLabel="New entry" />
      </View>

      {/* Prompt / quick compose */}
      <Card onPress={() => router.push('/journal/new')} style={{ marginBottom: 18 }}>
        <View style={styles.promptRow}>
          <View style={[styles.promptIcon, { backgroundColor: `${palette.brass}1A` }]}>
            <Ionicons name="create-outline" size={22} color={palette.brass} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="semibold" serif variant="h6">
              {prompt}
            </AppText>
            <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
              Tap to start a new entry
            </AppText>
          </View>
        </View>
      </Card>

      <View style={{ marginBottom: 16 }}>
        <SegmentedTabs
          tabs={[
            { key: 'reflections', label: 'Reflections' },
            { key: 'scripture', label: 'Scripture Notes' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {list.length === 0 ? (
        <EmptyState
          icon={tab === 'reflections' ? 'book-outline' : 'bookmarks-outline'}
          title={tab === 'reflections' ? 'No reflections yet' : 'No scripture notes yet'}
          message={
            tab === 'reflections'
              ? 'Write what you’re learning and saving it here.'
              : 'Notes you add while reading the Bible will show up here.'
          }
          actionLabel={tab === 'reflections' ? 'Write your first entry' : undefined}
          onAction={tab === 'reflections' ? () => router.push('/journal/new') : undefined}
        />
      ) : (
        list.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onPress={() => router.push(`/journal/${entry.id}`)} />
        ))
      )}
    </Screen>
  );
}

function EntryCard({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  const { colors } = useTheme();
  const date = new Date(entry.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card onPress={onPress} style={{ marginBottom: 12 }}>
      <View style={styles.entryTop}>
        {entry.scriptureRef ? (
          <View style={[styles.refPill, { backgroundColor: `${palette.slate}14` }]}>
            <Ionicons name="bookmark" size={11} color={palette.slate} />
            <AppText variant="overline" weight="bold" style={{ color: palette.slate, marginLeft: 4 }}>
              {entry.scriptureRef}
            </AppText>
          </View>
        ) : (
          <View />
        )}
        <AppText variant="overline" tone="muted">
          {date}
        </AppText>
      </View>
      <AppText variant="h6" weight="bold" style={{ marginTop: 8 }} numberOfLines={1}>
        {entry.title}
      </AppText>
      <AppText variant="caption" tone="muted" style={{ marginTop: 4 }} numberOfLines={2}>
        {entry.body || 'No text yet.'}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 16 },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  promptIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  entryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  refPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
});
