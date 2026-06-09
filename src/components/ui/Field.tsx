import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { fonts } from '../../theme/typography';
import { NO_OUTLINE } from '../../lib/style';

interface FieldProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

/** Labeled text input with large, elder-friendly touch target. */
export function Field({ label, icon, error, style, ...rest }: FieldProps) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <AppText variant="caption" weight="semibold" style={{ marginBottom: 6 }}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.box,
          { backgroundColor: colors.surface, borderColor: error ? colors.highlight : colors.border },
        ]}
      >
        {icon ? <Ionicons name={icon} size={20} color={colors.textMuted} style={{ marginRight: 10 }} /> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text, fontFamily: fonts.regular }, NO_OUTLINE, style]}
          {...rest}
        />
      </View>
      {error ? (
        <AppText variant="overline" style={{ color: colors.highlight, marginTop: 4 }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  input: { flex: 1, fontSize: 16 },
});
