import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';

/**
 * Entry route. The guard in app/_layout.tsx performs the real redirect once
 * auth state resolves; this just shows a branded spinner in the meantime.
 */
export default function Index() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
