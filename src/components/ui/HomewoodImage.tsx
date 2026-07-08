import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle, StyleProp } from 'react-native';
import { IMAGES, ImageKey } from '../../lib/images';
import { palette } from '../../theme/colors';

interface HomewoodImageProps {
  name: ImageKey;
  height?: number;
  aspectRatio?: number;
  radius?: number;
  /** Dark scrim so overlaid white text stays legible (0–1). */
  overlay?: number;
  /** Tint the image with a brand color wash (accepts hex). */
  tint?: string;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

/**
 * Branded image wrapper. Renders a bundled ministry photo with optional scrim/
 * tint and overlaid content. Swap the files in assets/images to change imagery
 * app-wide without touching screens.
 */
export function HomewoodImage({
  name,
  height,
  aspectRatio,
  radius = 0,
  overlay = 0,
  tint,
  style,
  imageStyle,
  children,
  accessibilityLabel,
}: HomewoodImageProps) {
  return (
    <View
      style={[
        { borderRadius: radius, overflow: 'hidden', backgroundColor: palette.navySoft },
        height ? { height } : null,
        aspectRatio ? { aspectRatio } : null,
        style,
      ]}
    >
      <Image
        source={IMAGES[name]}
        resizeMode="cover"
        accessible
        accessibilityLabel={accessibilityLabel ?? `${name} photo`}
        style={[StyleSheet.absoluteFillObject, imageStyle]}
      />
      {tint ? <View style={[StyleSheet.absoluteFillObject, { backgroundColor: tint, opacity: 0.4 }]} /> : null}
      {overlay > 0 ? (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: `rgba(11,28,63,${overlay})` }]} />
      ) : null}
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
});
