import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, RefreshControl } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/** Safe-area screen wrapper with brand background and optional scroll/refresh. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top'],
  contentStyle,
  refreshing,
  onRefresh,
}: ScreenProps) {
  const { colors } = useTheme();
  const padding = padded ? { paddingHorizontal: 18 } : undefined;

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: colors.background }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ paddingBottom: 40 }, padding, contentStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padding, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
