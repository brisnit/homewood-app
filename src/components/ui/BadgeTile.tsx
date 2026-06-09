import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { ProgressBar } from './ProgressBar';
import { palette } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';
import { Badge, UserBadge } from '../../types/models';

const colorMap: Record<Badge['color'], string> = {
  navy: palette.navy,
  brass: palette.brass,
  clay: palette.clay,
  pine: palette.pine,
  slate: palette.slate,
};

interface BadgeTileProps {
  badge: Badge;
  state: UserBadge;
}

/** Earned badge (full color) or locked placeholder (greyed, with progress). */
export function BadgeTile({ badge, state }: BadgeTileProps) {
  const { colors } = useTheme();
  const tint = colorMap[badge.color];
  const earned = state.earned;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.medallion,
          {
            backgroundColor: earned ? `${tint}1A` : colors.surfaceAlt,
            borderColor: earned ? tint : colors.border,
          },
        ]}
      >
        <AppText style={{ fontSize: 30, opacity: earned ? 1 : 0.35 }}>{badge.icon}</AppText>
        {!earned ? (
          <View style={styles.lock}>
            <AppText style={{ fontSize: 12 }}>🔒</AppText>
          </View>
        ) : null}
      </View>
      <AppText
        variant="caption"
        weight="semibold"
        center
        numberOfLines={1}
        style={{ marginTop: 6, color: earned ? colors.text : colors.textMuted }}
      >
        {badge.title}
      </AppText>
      {!earned && state.progress != null ? (
        <View style={{ width: 64, marginTop: 4 }}>
          <ProgressBar value={state.progress} color={tint} height={4} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 84 },
  medallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lock: { position: 'absolute', bottom: -2, right: -2 },
});
