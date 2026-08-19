import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Profile, User } from '../types/models';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import { mockAuth, MockSession } from './authStore';
import { config } from '../lib/config';
import { STANDARDS_VERSION } from '../data/standards';

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  initializing: boolean;
  privacyAccepted: boolean;
  standardsAccepted: boolean;
  onboardingComplete: boolean;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  acceptPrivacy: () => Promise<void>;
  declinePrivacy: () => Promise<void>; // signs out
  acceptStandards: () => Promise<void>;
  declineStandards: () => Promise<void>; // signs out
  completeOnboarding: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [standardsAccepted, setStandardsAccepted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Restore any existing session on boot.
  useEffect(() => {
    (async () => {
      try {
        if (isSupabaseEnabled && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            await hydrateFromSupabase(data.session.user.id, data.session.user.email ?? '');
          }
        } else {
          const session = await mockAuth.getSession();
          if (session) {
            setUser(session.user);
            setProfile(session.profile);
            setPrivacyAccepted(await mockAuth.hasAcceptedPrivacy());
            setStandardsAccepted(await mockAuth.hasAcceptedStandards(STANDARDS_VERSION));
            setOnboardingComplete(await mockAuth.hasCompletedOnboarding());
          }
        }
      } finally {
        setInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function hydrateFromSupabase(userId: string, email: string) {
    // TODO(supabase): fetch the profile + privacy_acceptances rows.
    //   For now we build a minimal profile so the gate logic is identical.
    const u: User = { id: userId, email, createdAt: new Date().toISOString() };
    setUser(u);
    setProfile({
      id: userId,
      userId,
      displayName: email.split('@')[0] ?? 'Friend',
      username: email.split('@')[0] ?? 'friend',
      avatarUrl: null,
      personalStatement: 'Honoring Christ through faithful service, one day at a time.',
      friendsCount: 0,
      followingCount: 0,
      streakCount: 0,
      createdAt: u.createdAt,
      role: 'resident',
      campus: 'Homewood at Frederick',
      learningLevel: 'growing',
    });
    setPrivacyAccepted(false);
    setStandardsAccepted(false);
  }

  const applyMockSession = async (session: MockSession, accepted: boolean) => {
    setUser(session.user);
    setProfile(session.profile);
    setPrivacyAccepted(accepted);
    setStandardsAccepted(await mockAuth.hasAcceptedStandards(STANDARDS_VERSION));
  };

  const signIn = useCallback(async (email: string, password: string) => {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await hydrateFromSupabase(data.user.id, data.user.email ?? email);
      return;
    }
    const session = await mockAuth.signIn(email, password);
    await applyMockSession(session, await mockAuth.hasAcceptedPrivacy());
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) await hydrateFromSupabase(data.user.id, data.user.email ?? email);
      return;
    }
    const session = await mockAuth.signUp(email, password, displayName);
    await applyMockSession(session, false);
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseEnabled && supabase) await supabase.auth.signOut();
    await mockAuth.signOut();
    setUser(null);
    setProfile(null);
    setPrivacyAccepted(false);
    setStandardsAccepted(false);
    setOnboardingComplete(false);
  }, []);

  const acceptPrivacy = useCallback(async () => {
    await mockAuth.setPrivacyAccepted(config.privacyPolicyVersion);
    // TODO(supabase): insert into privacy_acceptances (user_id, version, accepted_at).
    setPrivacyAccepted(true);
  }, []);

  const declinePrivacy = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const acceptStandards = useCallback(async () => {
    await mockAuth.setStandardsAccepted(STANDARDS_VERSION);
    // TODO(supabase): insert into standards_acceptances (user_id, version, accepted_at).
    setStandardsAccepted(true);
  }, []);

  /** Declining the community standards means declining to take part. */
  const declineStandards = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const completeOnboarding = useCallback(async () => {
    await mockAuth.setOnboardingComplete();
    setOnboardingComplete(true);
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
    // Persist locally so edits survive reloads.
    void mockAuth.updateProfile(patch);
    // TODO(supabase): also update the profiles row when Supabase is configured.
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      initializing,
      privacyAccepted,
      standardsAccepted,
      onboardingComplete,
      signedIn: user !== null,
      signIn,
      signUp,
      signOut,
      acceptPrivacy,
      declinePrivacy,
      acceptStandards,
      declineStandards,
      completeOnboarding,
      updateProfile,
    }),
    [user, profile, initializing, privacyAccepted, standardsAccepted, onboardingComplete, signIn, signUp, signOut, acceptPrivacy, declinePrivacy, acceptStandards, declineStandards, completeOnboarding, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
