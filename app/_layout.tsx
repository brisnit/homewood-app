import '../global.css';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';
import { CrimsonText_400Regular, CrimsonText_600SemiBold } from '@expo-google-fonts/crimson-text';

import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { BottomNav } from '../src/components/ui';
import { AuthProvider, useAuth } from '../src/auth/AuthProvider';
import { ProgressProvider } from '../src/state/ProgressProvider';
import { JournalProvider } from '../src/state/JournalProvider';
import { PreferencesProvider } from '../src/state/PreferencesProvider';
import { SavedProvider } from '../src/state/SavedProvider';
import { MessagesProvider } from '../src/state/MessagesProvider';
import { RsvpProvider } from '../src/state/RsvpProvider';
import { StudyProvider } from '../src/state/StudyProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Navigation guard implementing the gated flow:
 *   not signed in              -> (auth) group
 *   signed in, no privacy yet  -> /privacy
 *   privacy, no standards yet  -> /standards
 *   standards, no onboarding   -> /onboarding
 *   fully set up               -> (tabs)
 */
function RootNavigator() {
  const { signedIn, privacyAccepted, standardsAccepted, onboardingComplete, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // Persistent bottom nav on every authed screen except the tab screens (which
  // have their own bar) and the auth/gate screens.
  const group = segments[0];
  const authedApp = signedIn && privacyAccepted && standardsAccepted && onboardingComplete;
  const showBottomNav =
    authedApp && !!group && !['(auth)', 'privacy', 'standards', 'onboarding', '(tabs)'].includes(group);

  useEffect(() => {
    if (initializing) return;
    const group = segments[0];
    const inAuth = group === '(auth)';
    const onPrivacy = group === 'privacy';
    const onStandards = group === 'standards';
    const onOnboarding = group === 'onboarding';
    // The index route ('/') has no group segment — treat it as an entry point.
    const onEntry = group === undefined;

    if (!signedIn) {
      if (!inAuth) router.replace('/(auth)/welcome');
    } else if (!privacyAccepted) {
      if (!onPrivacy) router.replace('/privacy');
    } else if (!standardsAccepted) {
      // Community standards: read and agreed to before joining the community.
      if (!onStandards) router.replace('/standards');
    } else if (!onboardingComplete) {
      // Identify role + learning level before entering the app.
      if (!onOnboarding) router.replace('/onboarding');
    } else if (inAuth || onPrivacy || onOnboarding || onEntry) {
      // Fully set up: leave any entry/gate route for the tabs. /standards is
      // deliberately absent — once accepted it stays readable from Profile.
      router.replace('/(tabs)');
    }
  }, [signedIn, privacyAccepted, standardsAccepted, onboardingComplete, initializing, segments, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="privacy" options={{ gestureEnabled: false }} />
        <Stack.Screen name="standards" options={{ gestureEnabled: false }} />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="friends/add" options={{ presentation: 'card' }} />
        <Stack.Screen name="friends/share" options={{ presentation: 'modal' }} />
        <Stack.Screen name="friends/scan" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="plan/[id]" />
        <Stack.Screen name="plan-day/[planId]/[day]" options={{ presentation: 'card' }} />
        <Stack.Screen name="devotional/[id]" />
        <Stack.Screen name="bible-study/[id]" />
        <Stack.Screen name="journal/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="saved" options={{ presentation: 'card' }} />
        <Stack.Screen name="messages/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="messages/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="messages/new" options={{ presentation: 'card' }} />
        <Stack.Screen name="reader" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/edit-profile" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/language" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/voice" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/my-verses" options={{ presentation: 'card' }} />
      </Stack>
      </View>
      {showBottomNav ? <BottomNav /> : null}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    CrimsonText_400Regular,
    CrimsonText_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PreferencesProvider>
            <ProgressProvider>
              <JournalProvider>
                <SavedProvider>
                  <MessagesProvider>
                    <RsvpProvider>
                      <StudyProvider>
                        <RootNavigator />
                      </StudyProvider>
                    </RsvpProvider>
                  </MessagesProvider>
                </SavedProvider>
              </JournalProvider>
            </ProgressProvider>
          </PreferencesProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
