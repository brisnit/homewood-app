import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { AppText } from './AppText';
import { palette } from '../../theme/colors';

interface AvatarProps {
  name: string;
  /**
   * Remote URL string, or a bundled image from require().
   * require() returns a number on native and an object on web — both accepted.
   */
  uri?: string | number | object | null;
  size?: number;
  ring?: boolean;
}

const TINTS = [palette.navy, palette.slate, palette.pine, palette.clay, palette.brass];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Avatar with photo or deterministic colored initials fallback. */
export function Avatar({ name, uri, size = 48, ring = false }: AvatarProps) {
  const tint = TINTS[name.charCodeAt(0) % TINTS.length] ?? palette.navy;
  // string -> remote {uri}; number (native) or object (web) -> use require() result directly.
  const source: ImageSourcePropType | null =
    uri == null || uri === ''
      ? null
      : typeof uri === 'string'
        ? { uri }
        : (uri as ImageSourcePropType);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tint,
          borderWidth: ring ? 3 : 0,
          borderColor: palette.brass,
        },
      ]}
    >
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <AppText weight="bold" style={{ color: '#FFF', fontSize: size * 0.36 }}>
          {initials(name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
