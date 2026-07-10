/**
 * Homewood Living Ministries — domain models.
 * These mirror the Supabase schema in `supabase/schema.sql` and back the
 * mock data store so the app is fully typed end-to-end.
 */
import { ImageSourcePropType } from 'react-native';

export type UUID = string;
export type ISODate = string;

// ─── Users & Profiles ───────────────────────────────────────────────────────
export interface User {
  id: UUID;
  email: string;
  createdAt: ISODate;
}

export type UserRole = 'resident' | 'employee' | 'community';
export type LearningLevel = 'beginner' | 'growing' | 'mature';

export interface Profile {
  id: UUID; // == User.id
  userId: UUID;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  personalStatement: string | null;
  friendsCount: number;
  followingCount: number;
  streakCount: number;
  createdAt: ISODate;
  // Homewood role-based access + personalization.
  role: UserRole;
  campus: string;
  learningLevel: LearningLevel;
}

export interface PrivacyAcceptance {
  id: UUID;
  userId: UUID;
  version: string;
  acceptedAt: ISODate;
}

// ─── Devotionals & Plans ────────────────────────────────────────────────────
export type DevotionalCategoryKey =
  | 'love'
  | 'anxiety'
  | 'anger'
  | 'hope'
  | 'depression'
  | 'peace'
  | 'fear'
  | 'stress';

export interface DevotionalCategory {
  key: DevotionalCategoryKey;
  label: string;
  /** Brand accent token used to tint category chips/cards. */
  accent: 'navy' | 'brass' | 'clay' | 'pine' | 'slate';
}

export interface Devotional {
  id: UUID;
  title: string;
  description: string;
  category: DevotionalCategoryKey;
  estimatedMinutes: number;
  body: string;
  scriptureRef: string;
  imageColor: 'navy' | 'brass' | 'clay' | 'pine' | 'slate';
  /** Cover image (bundled asset or remote). Falls back to imageColor if unset. */
  image?: ImageSourcePropType;
}

export interface Plan {
  id: UUID;
  title: string;
  category: DevotionalCategoryKey;
  days: number;
  description: string;
  coverColor: 'navy' | 'brass' | 'clay' | 'pine' | 'slate';
  /**
   * Cover image. Bundled local asset (require()) for mock content; remote
   * providers can supply `{ uri }`. Falls back to coverColor if unset.
   */
  image?: ImageSourcePropType;
}

export interface PlanDay {
  id: UUID;
  planId: UUID;
  dayNumber: number;
  title: string;
  scriptureRef: string;
  devotionalBody: string;
  prompt: string;
}

export interface UserPlanProgress {
  id: UUID;
  userId: UUID;
  planId: UUID;
  completedDays: number[]; // dayNumbers completed
  startedAt: ISODate;
  lastActivityAt: ISODate;
  notes: Record<number, string>; // dayNumber -> note
}

// ─── Verse of the Day ───────────────────────────────────────────────────────
export interface VerseOfTheDay {
  id: UUID;
  date: ISODate;
  reference: string; // e.g. "Philippians 4:6–7"
  book: string;
  chapter: number;
  text: string;
  translation: string;
  likes: number;
  comments: number;
  downloads: number;
}

// ─── Bible reading plan (read-the-Bible-in-a-year) ──────────────────────────
export interface BibleReadingDay {
  id: UUID;
  dayNumber: number; // 1..365
  oldTestament: BiblePassageRef;
  newTestament: BiblePassageRef;
  psalmOrProverb: BiblePassageRef | null;
}

export interface BiblePassageRef {
  reference: string; // "Genesis 1–2"
  book: string;
  startChapter: number;
  endChapter: number;
}

export interface UserBibleProgress {
  id: UUID;
  userId: UUID;
  completedDays: number[];
  translation: string;
  redLetters: boolean;
  showAudio: boolean;
}

// ─── Social ─────────────────────────────────────────────────────────────────
export interface Friend {
  id: UUID;
  userId: UUID;
  friendId: UUID;
  profile: Pick<Profile, 'displayName' | 'username' | 'avatarUrl'>;
  since: ISODate;
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
  id: UUID;
  fromUserId: UUID;
  toUserId: UUID;
  status: FriendRequestStatus;
  fromProfile: Pick<Profile, 'displayName' | 'username' | 'avatarUrl'>;
  createdAt: ISODate;
}

export interface SuggestedFriend {
  id: UUID;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  mutualFriends: number;
}

// ─── Badges & streaks ───────────────────────────────────────────────────────
export interface Badge {
  id: UUID;
  key: string;
  title: string;
  description: string;
  icon: string; // emoji or icon key
  color: 'navy' | 'brass' | 'clay' | 'pine' | 'slate';
}

export interface UserBadge {
  badgeId: UUID;
  userId: UUID;
  earned: boolean;
  earnedAt: ISODate | null;
  progress?: number; // 0..1 for in-progress badges
}

// ─── Notes / highlights / prayers / saved ───────────────────────────────────
export interface Note {
  id: UUID;
  userId: UUID;
  reference: string;
  text: string;
  createdAt: ISODate;
}

export interface Highlight {
  id: UUID;
  userId: UUID;
  reference: string;
  snippet: string;
  color: 'brass' | 'clay' | 'pine' | 'slate';
  createdAt: ISODate;
}

export interface Prayer {
  id: UUID;
  userId: UUID;
  title: string;
  body: string;
  answered: boolean;
  createdAt: ISODate;
}

export type SavedKind = 'devotional' | 'plan' | 'verse' | 'media' | 'resource' | 'event';

export interface SavedItem {
  id: UUID;
  userId: UUID;
  kind: SavedKind;
  refId: UUID;
  title: string;
  savedAt: ISODate;
}

// ─── Messaging ──────────────────────────────────────────────────────────────
export type ConversationKind = 'admin' | 'user';

export interface ChatMessage {
  id: UUID;
  conversationId: UUID;
  senderId: string; // 'me' for the current user, otherwise the other party's id
  senderName: string;
  text: string;
  createdAt: ISODate;
}

export interface Conversation {
  id: UUID;
  partyId: string; // other participant (or 'admin')
  partyName: string;
  kind: ConversationKind; // admin broadcast vs. a friend
  subtitle?: string; // e.g. "Homewood Chaplaincy"
  messages: ChatMessage[];
  lastReadAt: ISODate; // messages from others after this are unread
}

// ─── Journal ────────────────────────────────────────────────────────────────
export interface JournalEntry {
  id: UUID;
  title: string;
  body: string;
  /** Set when the entry was started from a scripture reading. */
  scriptureRef: string | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Notifications ──────────────────────────────────────────────────────────
export interface NotificationPreferences {
  userId: UUID;
  verseOfTheDay: boolean;
  planReminders: boolean;
  friendActivity: boolean;
  quietHoursStart: string; // "21:00"
  quietHoursEnd: string; // "07:00"
}

// ─── Activity feed (You screen) ─────────────────────────────────────────────
export type ActivityKind = 'highlight' | 'note' | 'plan' | 'badge';

export interface ActivityItem {
  id: UUID;
  kind: ActivityKind;
  title: string;
  subtitle: string;
  reference?: string;
  createdAt: ISODate;
}
