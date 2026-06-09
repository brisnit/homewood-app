import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { palette } from '../../theme/colors';

interface BrandMarkProps {
  size?: number;
  color?: string;
}

/**
 * Homewood Living Ministries brandmark — an original interpretation of the
 * cross-and-quatrefoil mark for in-app use (logo PNGs are used on the splash).
 * A bold cross with four inward-pointing chevrons framing the center.
 */
export function BrandMark({ size = 64, color = palette.navy }: BrandMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Vertical + horizontal cross bars */}
      <Rect x="45" y="8" width="10" height="84" rx="2" fill={color} />
      <Rect x="8" y="45" width="84" height="10" rx="2" fill={color} />
      {/* Four chevrons pointing toward the center (quatrefoil suggestion) */}
      <Path d="M50 14 L62 26 L50 26 Z" fill={color} />
      <Path d="M50 14 L38 26 L50 26 Z" fill={color} />
      <Path d="M86 50 L74 38 L74 50 Z" fill={color} />
      <Path d="M86 50 L74 62 L74 50 Z" fill={color} />
      <Path d="M50 86 L62 74 L50 74 Z" fill={color} />
      <Path d="M50 86 L38 74 L50 74 Z" fill={color} />
      <Path d="M14 50 L26 38 L26 50 Z" fill={color} />
      <Path d="M14 50 L26 62 L26 50 Z" fill={color} />
    </Svg>
  );
}
