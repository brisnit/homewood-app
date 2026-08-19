import React from 'react';
import { View, Pressable, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { AttachedResource } from '../../types/homewood';
import { useTheme } from '../../theme/ThemeProvider';
import { palette } from '../../theme/colors';

/** Icon + tint per kind, so a study guide reads differently from a link. */
const KIND_META: Record<AttachedResource['kind'], { icon: keyof typeof Ionicons.glyphMap; label: string; tint: string }> = {
  curriculum: { icon: 'school-outline', label: 'Curriculum', tint: palette.navy },
  handout: { icon: 'document-text-outline', label: 'Handout', tint: palette.slate },
  video: { icon: 'play-circle-outline', label: 'Video', tint: palette.clay },
  audio: { icon: 'headset-outline', label: 'Audio', tint: palette.pine },
  reading: { icon: 'book-outline', label: 'Reading', tint: palette.brass },
  link: { icon: 'open-outline', label: 'Link', tint: palette.slate },
};

/**
 * Materials attached to an event or a Bible study in the admin portal.
 *
 * A resource that points at the library (`resourceId`) opens in the app; one
 * with only a `url` opens outside it. Items with neither are handed out in the
 * room — they're listed so people know what to expect, but aren't tappable.
 */
export function AttachedResources({
  resources,
  title = 'Resources & curriculum',
  subtitle,
}: {
  resources: AttachedResource[];
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const { colors } = useTheme();

  if (!resources.length) return null;

  const open = (r: AttachedResource) => {
    if (r.resourceId) router.push(`/resources/bible-studies?highlight=${r.resourceId}`);
    else if (r.url) Linking.openURL(r.url);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <AppText variant="h6" weight="bold">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>{subtitle}</AppText>
      ) : null}

      <Card style={{ marginTop: 10 }} padded>
        {resources.map((r, i) => {
          const meta = KIND_META[r.kind];
          const tappable = !!(r.resourceId || r.url);
          return (
            <Pressable
              key={r.id}
              onPress={tappable ? () => open(r) : undefined}
              disabled={!tappable}
              accessibilityRole={tappable ? 'button' : undefined}
              accessibilityLabel={tappable ? `Open ${r.title}` : undefined}
              style={({ pressed }) => [
                styles.row,
                i > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                pressed && { opacity: 0.65 },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: `${meta.tint}18` }]}>
                <Ionicons name={meta.icon} size={19} color={meta.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.metaRow}>
                  <AppText variant="overline" weight="bold" style={{ color: meta.tint, letterSpacing: 0.8 }}>
                    {meta.label.toUpperCase()}
                  </AppText>
                  {r.minutes ? (
                    <AppText variant="overline" tone="muted"> · {r.minutes} MIN</AppText>
                  ) : null}
                </View>
                <AppText weight="semibold" style={{ marginTop: 1 }}>{r.title}</AppText>
                {r.description ? (
                  <AppText variant="caption" tone="muted" style={{ marginTop: 2, lineHeight: 20 }}>
                    {r.description}
                  </AppText>
                ) : null}
              </View>
              {tappable ? (
                <Ionicons
                  name={r.url && !r.resourceId ? 'open-outline' : 'chevron-forward'}
                  size={18}
                  color={colors.textMuted}
                />
              ) : (
                <AppText variant="overline" tone="muted">IN ROOM</AppText>
              )}
            </Pressable>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
});
