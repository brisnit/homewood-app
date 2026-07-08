import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Screen, AppText, HomewoodImage } from '../../src/components/ui';
import { PHOTO_ALBUMS } from '../../src/data/homewoodData';
import { PhotoAlbum } from '../../src/types/homewood';
import { palette } from '../../src/theme/colors';

/** Photo albums — a warm, browsable grid of life at Homewood. */
export default function PhotosIndex() {
  const router = useRouter();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <AppText variant="h3" weight="bold" serif>
          Photos
        </AppText>
        <AppText tone="muted" style={{ marginTop: 4 }}>
          Moments from life together at Homewood.
        </AppText>
      </View>

      <View style={styles.grid}>
        {PHOTO_ALBUMS.map((album: PhotoAlbum) => (
          <Pressable
            key={album.id}
            onPress={() => router.push(`/photos/${album.id}`)}
            style={styles.cell}
            accessibilityRole="button"
            accessibilityLabel={`${album.title}, ${album.photos.length} photos`}
          >
            <HomewoodImage
              name={album.cover}
              aspectRatio={1.1}
              radius={16}
              overlay={0.42}
              accessibilityLabel={album.title}
            >
              <View style={styles.cardInner}>
                <View style={styles.pill}>
                  <AppText variant="overline" weight="bold" style={styles.pillText}>
                    {album.photos.length} photos
                  </AppText>
                </View>
                <View style={styles.cardBottom}>
                  <AppText weight="bold" numberOfLines={2} style={styles.cardTitle}>
                    {album.title}
                  </AppText>
                  <AppText variant="caption" numberOfLines={1} style={styles.cardSubtitle}>
                    {album.subtitle}
                  </AppText>
                </View>
              </View>
            </HomewoodImage>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 4, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '48%', marginBottom: 16 },
  cardInner: { flex: 1, padding: 12, justifyContent: 'space-between' },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(11,28,63,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pillText: { color: palette.white },
  cardBottom: { gap: 2 },
  cardTitle: { color: palette.white },
  cardSubtitle: { color: 'rgba(248,242,231,0.85)' },
});
