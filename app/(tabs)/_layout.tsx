import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { fonts } from '../../src/theme/typography';

/**
 * Primary bottom nav: Home · Bible Study · Plans · Media · Bible.
 *
 * Deliberately five. Profile moved off the bar to the avatar in AppHeader
 * (top-right of every tab screen) so Bible Study could take a primary slot —
 * a sixth tab made every target too small on a phone.
 */
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 92,
          paddingTop: 8,
          paddingBottom: 30,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        tabBarItemStyle: { paddingTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="bible-study"
        options={{ title: 'Bible Study', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="plans"
        options={{ title: 'Plans', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="media"
        options={{ title: 'Media', tabBarIcon: ({ color, size }) => <Ionicons name="play-circle" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="bible"
        options={{ title: 'Bible', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }}
      />
      {/* Routes that stay reachable but are no longer in the bar:
          Profile now lives behind the AppHeader avatar; Journal on Home / More. */}
      <Tabs.Screen name="you" options={{ href: null }} />
      <Tabs.Screen name="journal" options={{ href: null }} />
    </Tabs>
  );
}
