import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Card, SectionHeader, HomewoodImage } from '../../src/components/ui';
import { RESOURCE_CATEGORIES, CURATED_MINISTRIES } from '../../src/data/homewoodData';
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
});
