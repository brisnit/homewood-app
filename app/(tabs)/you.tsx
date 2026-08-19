import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Avatar, Card, Divider, IconButton, SettingsRow } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useProgress } from '../../src/state/ProgressProvider';
import { useSaved } from '../../src/state/SavedProvider';
import { useMessages } from '../../src/state/MessagesProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { ROLE_LABEL, LEVEL_LABEL } from '../../src/data/homewoodData';
import { DEFAULT_AVATAR } from '../../src/lib/assets';

const TOTAL_BIBLE_DAYS = 365;

/**
 * Profile — personal information & account. Identity and learning level are
 * shown as informational labels (changed in onboarding / Settings), not chosen
 * here. No badge activity (kept off Profile to reduce clutter).
 */
export default function Profile() {
  const router = useRouter();
  const { profile } = useAuth();
  const { streak, bibleCompletedCount } = useProgress();
  const { count: savedCount } = useSaved();
  const { unreadTotal } = useMessages();
  const { colors } = useTheme();

  const role = profile?.role ?? 'resident';
  const level = profile?.learningLevel ?? 'growing';

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
          <AppText variant="h3" weight="bold">Profile</AppText>
        </View>
        <IconButton icon="settings-outline" onPress={() => router.push('/settings')} accessibilityLabel="Settings" />
      </View>

      {/* Identity */}
      <View style={styles.identity}>
        <Avatar name={profile?.displayName ?? 'Friend'} uri={profile?.avatarUrl ?? DEFAULT_AVATAR} size={92} ring />
        <AppText variant="h4" weight="bold" style={{ marginTop: 12 }}>{profile?.displayName ?? 'Friend'}</AppText>
        <View style={[styles.roleLabel, { backgroundColor: `${palette.navy}12` }]}>
          <Ionicons name="ribbon-outline" size={13} color={palette.navy} />
          <AppText variant="caption" weight="semibold" style={{ color: palette.navy, marginLeft: 5 }}>
            {ROLE_LABEL[role]}
          </AppText>
        </View>
        {profile?.personalStatement ? (
          <AppText center tone="muted" style={{ marginTop: 12, maxWidth: 320 }}>
            “{profile.personalStatement}”
          </AppText>
        ) : null}
        <Pressable onPress={() => router.push('/settings/edit-profile')} hitSlop={8} style={{ marginTop: 12 }}>
          <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>Edit profile</AppText>
        </Pressable>
      </View>

      {/* Social actions — easy to find */}
      <View style={styles.socialRow}>
        <SocialAction icon="share-social-outline" label="Share" onPress={() => router.push('/friends/share')} />
        <SocialAction icon="person-add-outline" label="Find Friends" onPress={() => router.push('/friends/add')} />
        <SocialAction icon="chatbubbles-outline" label="Messages" badge={unreadTotal} onPress={() => router.push('/messages')} />
      </View>

      {/* Events sits full-width rather than as a fourth card — a four-across row
          shrinks every target below a comfortable tap size. */}
      <Card onPress={() => router.push('/events')} style={styles.eventsCard}>
        <View style={[styles.eventsIcon, { backgroundColor: `${palette.pine}18` }]}>
          <Ionicons name="calendar" size={22} color={palette.pine} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="bold">Events &amp; Calendar</AppText>
          <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
            Worship, studies &amp; fellowship
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Card>

      {/* About you (informational labels) */}
      <Card style={{ marginTop: 20 }} padded>
        <InfoRow icon="ribbon-outline" label="Identity" value={ROLE_LABEL[role]} />
        <Divider />
        <InfoRow icon="business-outline" label="Campus" value={profile?.campus ?? 'Not set'} />
        <Divider />
        <InfoRow icon="school-outline" label="Learning level" value={LEVEL_LABEL[level]} />
      </Card>
      <Pressable onPress={() => router.push('/settings')} hitSlop={6} style={{ marginTop: 8, alignSelf: 'flex-end' }}>
        <AppText variant="caption" weight="semibold" style={{ color: colors.link }}>Change in Settings</AppText>
      </Pressable>

      {/* Reading progress (personal, not badges) */}
      <View style={styles.statsRow}>
        <Stat label="Day Streak" value={String(streak)} icon="flame" tint={palette.clay} />
        <Stat label="Bible Days" value={`${bibleCompletedCount}/${TOTAL_BIBLE_DAYS}`} icon="book" tint={palette.pine} />
        <Stat label="Saved" value={String(savedCount)} icon="bookmark" tint={palette.brass} />
      </View>

      {/* My library */}
      <View style={{ marginTop: 24 }}>
        <AppText variant="h6" weight="bold" style={{ marginBottom: 8 }}>My Library</AppText>
        <Card padded>
          <SettingsRow icon="chatbubble-ellipses-outline" label="Messages" value={unreadTotal ? `${unreadTotal} new` : undefined} onPress={() => router.push('/messages')} />
          <Divider />
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

      {/* Small print — the community agreement, always reachable after signup. */}
      <View style={styles.fineprint}>
        <Pressable onPress={() => router.push('/standards')} hitSlop={8}>
          <AppText variant="caption" tone="muted" center style={styles.fineprintLink}>
            Standards of Conduct
          </AppText>
        </Pressable>
        <AppText variant="caption" tone="muted" center style={{ marginTop: 4, fontSize: 11 }}>
          Homewood Living Ministries
        </AppText>
      </View>
    </Screen>
  );
}

function SocialAction({ icon, label, badge, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; badge?: number; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.social, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.7 }]}>
      <View>
        <Ionicons name={icon} size={22} color={colors.primary} />
        {badge ? (
          <View style={styles.socialBadge}>
            <AppText variant="overline" weight="bold" style={{ color: '#FFF', fontSize: 10 }}>{badge > 9 ? '9+' : badge}</AppText>
          </View>
        ) : null}
      </View>
      <AppText variant="caption" weight="semibold" style={{ marginTop: 6 }}>{label}</AppText>
    </Pressable>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <AppText weight="medium" style={{ flex: 1 }}>{label}</AppText>
      <AppText tone="muted" numberOfLines={1} style={{ maxWidth: 190 }}>{value}</AppText>
    </View>
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

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  identity: { alignItems: 'center', marginTop: 8 },
  roleLabel: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, marginTop: 10 },
  socialRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  eventsCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 },
  eventsIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  social: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1 },
  socialBadge: { position: 'absolute', top: -6, right: -10, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: palette.clay, alignItems: 'center', justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  infoIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fineprint: { alignItems: 'center', marginTop: 28, marginBottom: 8 },
  fineprintLink: { fontSize: 12, textDecorationLine: 'underline' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
});
