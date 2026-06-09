import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { palette } from '../../theme/colors';
import { radius } from '../../theme/typography';

type Accent = 'navy' | 'brass' | 'clay' | 'pine' | 'slate';

interface ChipProps {
  label: string;
  accent?: Accent;
  selected?: boolean;
  onPress?: () => void;
}

const accentMap: Record<Accent, string> = {
  navy: palette.navy,
  brass: palette.brass,
  clay: palette.clay,
  pine: palette.pine,
  slate: palette.slate,
};

/** Category / filter chip. Solid when selected, tinted outline otherwise. */
export function Chip({ label, accent = 'navy', selected = false, onPress }: ChipProps) {
  const color = accentMap[accent];
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View
        style={[
          styles.chip,
          selected
            ? { backgroundColor: color, borderColor: color }
            : { backgroundColor: `${color}14`, borderColor: `${color}55` },
        ]}
      >
        <AppText
          variant="caption"
          weight="semibold"
          style={{ color: selected ? '#FFF' : color }}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
