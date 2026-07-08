import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Avatar,
  Card,
  Chip,
  Divider,
  BadgeTile,
  IconButton,
  SettingsRow,
} from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { useSaved } from '../../src/state/SavedProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { BADGES, USER_BADGES } from '../../src/data/mockData';
import { CAMPUSES, ROLE_LABEL, LEVEL_LABEL } from '../../src/data/homewoodData';
import { ROLES } from '../../src/lib/roles';
import { UserRole, LearningLevel } from '../../src/types/models';
import { DEFAULT_AVATAR } from '../../src/lib/assets';

const LEVELS: LearningLevel[] = ['beginner', 'growing', 'mature'];
const TOTAL_BIBLE_DAYS = 365;

/** Role-aware Profile: identity, role/campus/level, progress, saved, settings. */
export default function Profile() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const { streak, bibleCompletedCount } = useProgress();
  const { count: savedCount } = useSaved();
  const { colors } = useTheme();
  const [campusOpen, setCampusOpen] = useState(false);

  const earnedBadges = BADGES.filter((b) => USER_BADGES.find((u) => u.badgeId === b.id && u.earned));
  const role = profile?.role ?? 'resident';
  const level = profile?.learningLevel ?? 'growing';

  return (
    <Screen>
      <View style={styles.topBar}>
        <AppText variant="h3" weight="bold">Profile</AppText>
        <IconButton icon="settings-outline" onPress={() => router.push('/settings')} accessibilityLabel="Settings" />
      </View>

      {/* Identity */}
      <View style={styles.identity}>
        <Avatar name={profile?.displayName ?? 'Friend'} uri={profile?.avatarUrl ?? DEFAULT_AVATAR} size={88} ring />
        <AppText variant="h4" weight="bold" style={{ marginTop: 12 }}>{profile?.displayName ?? 'Friend'}</AppText>
        <AppText variant="caption" tone="muted">@{profile?.username ?? 'friend'}</AppText>
        <View style={styles.tagRow}>
          <View style={[styles.roleTag, { backgroundColor: `${palette.navy}12` }]}>
            <Ionicons name="ribbon-outline" size={13} color={palette.navy} />
            <AppText variant="caption" weight="semibold" style={{ color: palette.navy, marginLeft: 5 }}>
              {ROLE_LABEL[role]}
            </AppText>
          </View>
          <Pressable onPress={() => setCampusOpen(true)} style={[styles.roleTag, { backgroundColor: `${palette.pine}14` }]}>
            <Ionicons name="business-outline" size={13} color={palette.pine} />
            <AppText variant="caption" weight="semibold" style={{ color: palette.pine, marginLeft: 5 }} numberOfLines={1}>
              {profile?.campus ?? 'Campus'}
            </AppText>
          </Pressable>
        </View>
        {profile?.personalStatement ? (
          <AppText center tone="muted" style={{ marginTop: 12, maxWidth: 320 }}>
            “{profile.personalStatement}”
          </AppText>
        ) : null}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat label="Day Streak" value={String(streak)} icon="flame" tint={palette.clay} />
        <Stat label="Bible Days" value={`${bibleCompletedCount}/${TOTAL_BIBLE_DAYS}`} icon="book" tint={palette.pine} />
        <Stat label="Saved" value={String(savedCount)} icon="bookmark" tint={palette.brass} />
      </View>

      {/* Quick actions */}
      <View style={styles.actionRow}>
        <QuickAction icon="bookmark-outline" label="Saved" onPress={() => router.push('/saved')} />
        <QuickAction icon="hand-left-outline" label="Prayer" onPress={() => router.push('/settings')} />
        <QuickAction icon="gift-outline" label="Giving" onPress={() => router.push('/settings')} />
      </View>

      {/* Role (role-based access demo) */}
      <View style={{ marginTop: 24 }}>
        <AppText variant="h6" weight="bold" style={{ marginBottom: 4 }}>I am a…</AppText>
        <AppText variant="caption" tone="muted" style={{ marginBottom: 12 }}>
          Your role tailors the content and resources you see.
        </AppText>
        <View style={styles.chips}>
          {ROLES.map((r) => (
            <Chip key={r.key} label={r.label} accent="navy" selected={role === r.key} onPress={() => updateProfile({ role: r.key as UserRole })} />
          ))}
        </View>
      </View>

      {/* Learning level */}
      <View style={{ marginTop: 22 }}>
        <AppText variant="h6" weight="bold" style={{ marginBottom: 12 }}>Learning level</AppText>
        <View style={styles.chips}>
          {LEVELS.map((l) => (
            <Chip key={l} label={LEVEL_LABEL[l]} accent="pine" selected={level === l} onPress={() => updateProfile({ learningLevel: l })} />
          ))}
        </View>
      </View>

      {/* Badges */}
      <View style={{ marginTop: 24 }}>
        <View style={styles.sectionHead}>
          <AppText variant="h6" weight="bold">Badges</AppText>
          <AppText variant="caption" tone="muted">{earnedBadges.length} of {BADGES.length} earned</AppText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
          {BADGES.map((badge) => {
            const state = USER_BADGES.find((b) => b.badgeId === badge.id) ?? { badgeId: badge.id, userId: 'me', earned: false, earnedAt: null };
            return <BadgeTile key={badge.id} badge={badge} state={state} />;
          })}
        </ScrollView>
      </View>

      {/* My library */}
      <View style={{ marginTop: 24 }}>
        <AppText variant="h6" weight="bold" style={{ marginBottom: 8 }}>My Library</AppText>
        <Card padded>
          <SettingsRow icon="bookmark-outline" label="Saved items" value={savedCount ? String(savedCount) : undefined} onPress={() => router.push('/saved')} />
          <Divider />
          <SettingsRow icon="color-wand-outline" label="My Verses & Highlights" onPress={() => router.push('/settings/my-verses')} />
          <Divider />
          <SettingsRow icon="create-outline" label="My Journal" onPress={() => router.push('/journal')} />
          <Divider />
          <SettingsRow icon="grid-outline" label="Explore all sections" onPress={() => router.push('/more')} />
          <Divider />
          <SettingsRow icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />
        </Card>
      </View>

      {/* Campus picker */}
      <Modal visible={campusOpen} transparent animationType="slide" onRequestClose={() => setCampusOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setCampusOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHead}>
              <AppText variant="h6" weight="bold">Choose your campus</AppText>
              <IconButton icon="close" onPress={() => setCampusOpen(false)} accessibilityLabel="Close" />
            </View>
            {CAMPUSES.map((c) => (
              <SettingsRow
                key={c}
                label={c}
                value={profile?.campus === c ? '✓' : undefined}
                onPress={() => { updateProfile({ campus: c }); setCampusOpen(false); }}
              />
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function Stat({ label, value, icon, tint }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; tint: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Ionicons name={icon} size={20} color={tint} />
      <AppText variant="h5" weight="bold" style={{ marginTop: 4 }}>{value}</AppText>
      <AppText variant="overline" tone="muted">{label}</AppText>
    </View>
  );
}

function QuickAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <AppText variant="caption" weight="semibold" style={{ marginTop: 6 }}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  identity: { alignItems: 'center', marginTop: 8 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 12, maxWidth: '100%' },
  roleTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, maxWidth: 200 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  quick: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  badgeRow: { gap: 8, paddingVertical: 4, paddingRight: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7,16,31,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, paddingBottom: 34 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
});
