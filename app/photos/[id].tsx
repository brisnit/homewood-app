import React, { useState } from 'react';
import { View, Pressable, Modal, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Screen, AppText, IconButton, HomewoodImage, EmptyState } from '../../src/components/ui';
import { PHOTO_ALBUMS } from '../../src/data/homewoodData';
import { palette } from '../../src/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Album detail — a photo grid with a tap-to-enlarge lightbox. */
export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  const album = PHOTO_ALBUMS.find((a) => a.id === id);

  if (!album) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
        <EmptyState icon="images-outline" title="Album not found" />
      </Screen>
    );
  }

  const formattedDate = new Date(album.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold" serif numberOfLines={1} style={styles.headerTitle}>
          {album.title}
        </AppText>
        {/* Spacer to keep the title visually centered against the back button. */}
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.meta}>
        <AppText tone="muted">{album.subtitle}</AppText>
        <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
          {formattedDate}
        </AppText>
      </View>

      <View style={styles.grid}>
        {album.photos.map((photo, index) => (
          <Pressable
            key={`${photo}-${index}`}
            onPress={() => setSelected(index)}
            style={styles.cell}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Photo ${index + 1} of ${album.photos.length}. Tap to enlarge.`}
          >
            <HomewoodImage name={photo} aspectRatio={1} radius={10} accessibilityLabel={album.title} />
          </Pressable>
        ))}
      </View>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.lightboxHeader}>
            <IconButton
              icon="close"
              color={palette.white}
              size={28}
              onPress={() => setSelected(null)}
              accessibilityLabel="Close photo"
            />
          </View>
          <Pressable style={styles.lightboxBody} onPress={() => setSelected(null)}>
            {selected !== null ? (
              <HomewoodImage
                name={album.photos[selected]}
                aspectRatio={1}
                radius={12}
                style={styles.lightboxImage}
                accessibilityLabel={`${album.title}, photo ${selected + 1}`}
              />
            ) : null}
          </Pressable>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 10 },
  headerTitle: { flex: 1, textAlign: 'center' },
  headerSpacer: { width: 44 },
  meta: { marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: '2.75%' },
  cell: { width: '31.5%', marginBottom: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(7,16,31,0.94)' },
  lightboxHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 48,
  },
  lightboxBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  lightboxImage: { width: SCREEN_WIDTH - 36 },
});
