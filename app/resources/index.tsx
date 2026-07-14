import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, SectionHeader, HomewoodImage, Button } from '../../src/components/ui';
import { RESOURCE_CATEGORIES, CURATED_MINISTRIES } from '../../src/data/homewoodData';
import { COURSES } from '../../src/data/courses';
import { palette } from '../../src/theme/colors';
import { useTheme } from '../../src/theme/ThemeProvider';

/** Resources hub — trusted teaching by topic, plus curated ministry partners. */
export default function ResourcesHub() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ marginTop: 4, marginBottom: 18 }}>
        <AppText variant="h3" weight="bold">Resources</AppText>
        <AppText tone="muted" style={{ marginTop: 4 }}>Trusted teaching to help you grow.</AppText>
      </View>

      <SectionHeader title="Browse by topic" />
      {RESOURCE_CATEGORIES.map((cat) => (
        <Card
          key={cat.key}
          onPress={() => router.push(`/resources/${cat.key}`)}
          style={styles.categoryCard}
        >
          <HomewoodImage
            name={cat.image}
            height={64}
            radius={14}
            style={styles.categoryThumb}
            accessibilityLabel={cat.title}
          />
          <View style={styles.categoryText}>
            <AppText weight="bold" numberOfLines={1}>{cat.title}</AppText>
            <AppText variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 3 }}>
              {cat.description}
            </AppText>
            <AppText variant="overline" tone="muted" style={{ marginTop: 6 }}>
              {`${cat.itemCount} resources`}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Card>
      ))}

      {/* Courses (externally hosted, e.g. Robert J. Morgan) */}
      <View style={{ marginTop: 26 }}>
        <SectionHeader title="Courses" />
      </View>
      {COURSES.map((course) => (
        <Card key={course.id} style={styles.courseCard} padded={false}>
          <HomewoodImage name={course.image} height={120} overlay={0.28} accessibilityLabel={course.title}>
            <View style={styles.courseBadge}>
              <Ionicons name="open-outline" size={12} color="#FFF" />
              <AppText variant="overline" weight="bold" style={{ color: '#FFF', marginLeft: 4 }}>
                EXTERNAL COURSE
              </AppText>
            </View>
            {course.featured ? (
              <View style={[styles.courseBadge, styles.featuredBadge]}>
                <Ionicons name="star" size={11} color={palette.navy} />
                <AppText variant="overline" weight="bold" style={{ color: palette.navy, marginLeft: 4 }}>
                  FEATURED
                </AppText>
              </View>
            ) : null}
          </HomewoodImage>
          <View style={{ padding: 16 }}>
            <AppText variant="h6" weight="bold" numberOfLines={2}>{course.title}</AppText>
            <View style={styles.providerRow}>
              <Ionicons name="person-circle-outline" size={15} color={colors.textMuted} />
              <AppText variant="caption" tone="muted" style={{ marginLeft: 4 }}>
                {course.provider} · {course.category}
              </AppText>
            </View>
            <AppText variant="caption" tone="muted" style={{ marginTop: 6 }} numberOfLines={2}>
              {course.description}
            </AppText>
            <AppText variant="overline" tone="muted" style={{ marginTop: 8 }}>
              Hosted by {course.provider} — opens outside Homewood Living
            </AppText>
            <View style={{ marginTop: 12 }}>
              <Button
                label="View Course"
                iconRight="open-outline"
                size="sm"
                onPress={() => Linking.openURL(course.url)}
              />
            </View>
          </View>
        </Card>
      ))}

      <View style={{ marginTop: 26 }}>
        <SectionHeader title="Trusted Ministries" />
      </View>
      {/* TODO(api): several expose RSS/JSON feeds — pull content later. */}
      {CURATED_MINISTRIES.map((m) => (
        <Card
          key={m.id}
          onPress={() => Linking.openURL(m.url)}
          style={styles.ministryCard}
        >
          <View style={styles.ministryText}>
            <AppText weight="bold" numberOfLines={1}>{m.name}</AppText>
            <AppText variant="caption" tone="muted" numberOfLines={1} style={{ marginTop: 2 }}>
              {m.tagline}
            </AppText>
          </View>
          <Ionicons name="open-outline" size={20} color={colors.link} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoryCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  categoryThumb: { width: 64 },
  categoryText: { flex: 1 },
  ministryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  ministryText: { flex: 1 },
  courseCard: { marginBottom: 14, overflow: 'hidden' },
  courseBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(11,28,63,0.72)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  featuredBadge: { left: undefined, right: 12, backgroundColor: '#E9DCC4' },
  providerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});
