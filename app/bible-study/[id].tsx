import React from 'react';
import { View, Pressable, Alert, Linking, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen, AppText, Card, Button, Chip, IconButton, HomewoodImage, EmptyState, ProgressBar,
} from '../../src/components/ui';
import { AttachedResources } from '../../src/components/content/AttachedResources';
import { BIBLE_STUDIES } from '../../src/data/homewoodData';
import { StudySession } from '../../src/types/homewood';
import { useStudy } from '../../src/state/StudyProvider';
import { useSaved } from '../../src/state/SavedProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

const FORMAT_LABEL = { 'in-person': 'In person', online: 'Online', hybrid: 'In person & online' } as const;

/**
 * One Bible study: what it is, when it meets, the week-by-week curriculum, and
 * the materials attached to it. Members can check sessions off as they go;
 * everyone else can read the whole thing before deciding to join.
 */
export default function BibleStudyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isJoined, getMembership, join, leave, toggleSession } = useStudy();
  const { isSaved, toggleSave } = useSaved();

  const study = BIBLE_STUDIES.find((s) => s.id === id);

  if (!study) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
        <EmptyState icon="people-outline" title="Study not found" message="It may have ended or the link is out of date." />
      </Screen>
    );
  }

  const joined = isJoined(study.id);
  const membership = getMembership(study.id);
  const saved = isSaved('event', study.id);
  const completed = study.status === 'completed';
  const full = study.capacity != null && study.memberCount >= study.capacity;

  const done = membership?.completedSessions.length ?? 0;
  const progress = study.sessions.length ? done / study.sessions.length : 0;

  const range = `${new Date(study.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} – ${new Date(
    study.endDate,
  ).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;

  const onJoin = () => {
    join(study.id);
    Alert.alert(
      'You’re in',
      `You've joined "${study.title}". It meets ${study.schedule.toLowerCase()} at ${study.location}.`,
    );
  };

  const onLeave = () => {
    Alert.alert('Leave this study?', 'You can rejoin at any time while it is running.', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Leave study', style: 'destructive', onPress: () => leave(study.id) },
    ]);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          color={saved ? colors.accent : colors.text}
          onPress={() => toggleSave({ kind: 'event', refId: study.id, title: study.title })}
          accessibilityLabel={saved ? 'Remove from saved' : 'Save study'}
        />
      </View>

      <HomewoodImage name={study.image} height={190} radius={20} overlay={0.42} accessibilityLabel={study.title}>
        <View style={styles.heroInner}>
          <View style={[styles.pill, { backgroundColor: completed ? 'rgba(0,0,0,0.45)' : palette.pine }]}>
            <AppText variant="overline" weight="bold" style={{ color: '#FFF' }}>
              {completed ? 'COMPLETED' : study.status === 'in-progress' ? 'IN PROGRESS' : 'OPEN TO JOIN'}
            </AppText>
          </View>
        </View>
      </HomewoodImage>

      <AppText variant="h4" weight="bold" serif style={{ marginTop: 16 }}>{study.title}</AppText>
      <AppText tone="muted" style={{ marginTop: 4 }}>
        Led by {study.leader} · {study.scriptureFocus}
      </AppText>

      <View style={styles.chips}>
        {study.topics.map((t) => <Chip key={t} label={t} accent="slate" />)}
      </View>

      {/* ── When & where ─────────────────────────────────────────── */}
      <Card style={{ marginTop: 16 }}>
        <DetailRow icon="time-outline" text={study.schedule} />
        <View style={{ height: 14 }} />
        <DetailRow icon="calendar-outline" text={range} />
        <View style={{ height: 14 }} />
        <DetailRow icon="location-outline" text={`${study.location} · ${FORMAT_LABEL[study.format]}`} />
        <View style={{ height: 14 }} />
        <DetailRow icon="business-outline" text={study.campus} />
        <View style={{ height: 14 }} />
        <DetailRow
          icon="people-outline"
          text={
            study.capacity != null
              ? `${study.memberCount} of ${study.capacity} spots taken`
              : `${study.memberCount} members`
          }
        />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <AppText weight="bold" style={{ marginBottom: 6 }}>About this study</AppText>
        <AppText tone="muted" style={{ lineHeight: 26 }}>{study.description}</AppText>
      </Card>

      {/* ── Join / progress ──────────────────────────────────────── */}
      {joined ? (
        <Card style={{ marginTop: 20 }}>
          <View style={styles.joinedHead}>
            <Ionicons name="checkmark-circle" size={20} color={palette.pine} />
            <AppText weight="bold" style={{ color: palette.pine, marginLeft: 8, flex: 1 }}>
              You’re in this study
            </AppText>
            <Pressable onPress={onLeave} hitSlop={8}>
              <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>Leave</AppText>
            </Pressable>
          </View>
          <AppText variant="caption" tone="muted" style={{ marginTop: 10 }}>
            {done} of {study.sessions.length} sessions completed
          </AppText>
          <View style={{ marginTop: 8 }}>
            <ProgressBar value={progress} />
          </View>
        </Card>
      ) : completed ? (
        <Card style={{ marginTop: 20 }}>
          <AppText weight="bold">This study has finished</AppText>
          <AppText tone="muted" style={{ marginTop: 6, lineHeight: 24 }}>
            The curriculum and materials below stay available, so you can work through
            them on your own or with a friend.
          </AppText>
          {study.archiveUrl ? (
            <View style={{ marginTop: 14 }}>
              <Button
                label="Open session recordings"
                iconRight="open-outline"
                variant="secondary"
                onPress={() => Linking.openURL(study.archiveUrl!)}
              />
            </View>
          ) : null}
        </Card>
      ) : (
        <View style={{ marginTop: 20 }}>
          <Button
            label={full ? 'Join the waiting list' : 'Join this study'}
            icon="person-add-outline"
            onPress={onJoin}
          />
          {full ? (
            <AppText variant="caption" tone="muted" center style={{ marginTop: 8 }}>
              This study is at capacity. Join the list and the leader will reach out if a spot opens.
            </AppText>
          ) : null}
        </View>
      )}

      {/* ── Curriculum ───────────────────────────────────────────── */}
      <View style={{ marginTop: 24 }}>
        <AppText variant="h6" weight="bold">Curriculum</AppText>
        <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
          {study.sessions.length} sessions{joined ? ' · tap a session to mark it complete' : ''}
        </AppText>

        <Card style={{ marginTop: 10 }} padded>
          {study.sessions.map((session, i) => (
            <SessionRow
              key={session.id}
              session={session}
              first={i === 0}
              joined={joined}
              complete={!!membership?.completedSessions.includes(session.sessionNumber)}
              onToggle={() => toggleSession(study.id, session.sessionNumber)}
            />
          ))}
        </Card>
      </View>

      {/* ── Attached resources ───────────────────────────────────── */}
      <AttachedResources
        resources={study.resources}
        subtitle="Study guides and materials for this group, attached by the leader."
      />

      <View style={{ height: 24 }} />
    </Screen>
  );
}

function SessionRow({
  session, first, joined, complete, onToggle,
}: {
  session: StudySession; first: boolean; joined: boolean; complete: boolean; onToggle: () => void;
}) {
  const { colors } = useTheme();
  const when = session.date
    ? new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  return (
    <Pressable
      onPress={joined ? onToggle : undefined}
      disabled={!joined}
      accessibilityRole={joined ? 'checkbox' : undefined}
      accessibilityState={joined ? { checked: complete } : undefined}
      accessibilityLabel={`Session ${session.sessionNumber}: ${session.title}`}
      style={({ pressed }) => [
        styles.session,
        !first && { borderTopWidth: 1, borderTopColor: colors.border },
        pressed && { opacity: 0.65 },
      ]}
    >
      <View
        style={[
          styles.sessionNum,
          complete
            ? { backgroundColor: palette.pine }
            : { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
        ]}
      >
        {complete ? (
          <Ionicons name="checkmark" size={16} color="#FFF" />
        ) : (
          <AppText variant="caption" weight="bold" tone="muted">{session.sessionNumber}</AppText>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.sessionHead}>
          <AppText weight="semibold" style={{ flex: 1 }} numberOfLines={2}>{session.title}</AppText>
          {when ? <AppText variant="overline" tone="muted">{when.toUpperCase()}</AppText> : null}
        </View>
        <AppText variant="caption" weight="semibold" style={{ color: palette.slate, marginTop: 2 }}>
          {session.scriptureRef}
        </AppText>
        <AppText variant="caption" tone="muted" style={{ marginTop: 3, lineHeight: 20 }}>
          {session.summary}
        </AppText>
      </View>
    </Pressable>
  );
}

function DetailRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <AppText weight="medium" style={styles.detailText}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  heroInner: { flex: 1, justifyContent: 'flex-start' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 12, flex: 1 },
  joinedHead: { flexDirection: 'row', alignItems: 'center' },
  session: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  sessionNum: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  sessionHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
