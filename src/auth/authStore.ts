/**
 * Local auth + profile store used when Supabase is not configured.
 * Persists a mock session and privacy acceptance to AsyncStorage so the gated
 * flow (login -> privacy -> app) is fully exercisable offline.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, User } from '../types/models';

const SESSION_KEY = '@homewood/mock-session';
const PRIVACY_KEY = '@homewood/privacy-accepted';

export interface MockSession {
  user: User;
  profile: Profile;
}

// Demo identity for the mock store.
const DEMO_NAME = 'Jeffery Foust';
const DEMO_USERNAME = 'jefferyfoust';

function makeProfile(user: User, displayName: string): Profile {
  return {
    id: user.id,
    userId: user.id,
    displayName,
    username: DEMO_USERNAME,
    avatarUrl: null,
    personalStatement: 'Growing in faith, one day at a time.',
    friendsCount: 3,
    followingCount: 5,
    streakCount: 7,
    createdAt: user.createdAt,
  };
}

export const mockAuth = {
  async getSession(): Promise<MockSession | null> {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as MockSession;
    // One-time migration of pre-demo sessions; respects later profile edits.
    if (!session.profile.username || session.profile.username === 'brisnit') {
      session.profile.displayName = DEMO_NAME;
      session.profile.username = DEMO_USERNAME;
    }
    return session;
  },

  /** Merge a patch into the stored profile and persist it. */
  async updateProfile(patch: Partial<Profile>): Promise<void> {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw) as MockSession;
    session.profile = { ...session.profile, ...patch };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async signIn(email: string, _password: string): Promise<MockSession> {
    const user: User = {
      id: `mock-${email}`,
      email,
      createdAt: '2026-01-01T00:00:00Z',
    };
    const session: MockSession = { user, profile: makeProfile(user, DEMO_NAME) };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signUp(email: string, password: string, displayName: string): Promise<MockSession> {
    const session = await this.signIn(email, password);
    session.profile.displayName = displayName || session.profile.displayName;
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signOut(): Promise<void> {
    await AsyncStorage.multiRemove([SESSION_KEY, PRIVACY_KEY]);
  },

  async hasAcceptedPrivacy(): Promise<boolean> {
    return (await AsyncStorage.getItem(PRIVACY_KEY)) != null;
  },

  async setPrivacyAccepted(version: string): Promise<void> {
    await AsyncStorage.setItem(PRIVACY_KEY, version);
  },

  async clearPrivacy(): Promise<void> {
    await AsyncStorage.removeItem(PRIVACY_KEY);
  },
};
