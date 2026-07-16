import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeProvider';
import { fonts } from '../../src/theme/typography';

/**
 * Primary bottom nav: Home · Bible · Plans · Media · Profile.
 *
 * Deliberately five. A sixth (Events) made every target too small on a phone —
 * Events lives on Home's Explore grid, Profile, and More instead.
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
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12 },
        tabBarItemStyle: { paddingTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="bible"
        options={{ title: 'Bible', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }}
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
        name="you"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} /> }}
      />
      {/* Journal remains a route but moves out of the primary bar (reachable from Home / More). */}
      <Tabs.Screen name="journal" options={{ href: null }} />
    </Tabs>
  );
}
