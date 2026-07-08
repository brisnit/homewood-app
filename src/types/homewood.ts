/**
 * Homewood Living App — domain models for the ministry platform sections:
 * Media, Events, Photos, Resources, Bible Academy, Study Bible, Commentary,
 * and curated ministries. Mirrors the mock data in src/data/homewoodData.ts.
 *
 * TODO(api): These are shaped to map cleanly onto a future CMS/API
 *   (e.g. Homewood content service, API.Bible, Bible Brain) — see notes per type.
 */
import { ImageKey } from '../lib/images';
import { UserRole } from './models';

export type UUID = string;
export type ISODate = string;

// ─── Media ──────────────────────────────────────────────────────────────────
export type MediaCategory = 'teaching' | 'live' | 'sermon' | 'entertainment';

export interface MediaItem {
  id: UUID;
  title: string;
  speaker: string;
  category: MediaCategory;
  durationMinutes: number;
  image: ImageKey;
  description: string;
  publishedAt: ISODate;
  isLive?: boolean;
  // TODO(media): add `sourceUrl` (HLS/mp4/YouTube) + `audioUrl` when wiring playback.
  roles?: UserRole[]; // visibility; undefined = everyone
}

// ─── Events ─────────────────────────────────────────────────────────────────
export interface MinistryEvent {
  id: UUID;
  title: string;
  date: ISODate; // ISO datetime
  endDate?: ISODate;
  location: string;
  campus: string;
  image: ImageKey;
  description: string;
  category: string;
  roles?: UserRole[];
}

// ─── Photos ─────────────────────────────────────────────────────────────────
export interface PhotoAlbum {
  id: UUID;
  title: string;
  subtitle: string;
  cover: ImageKey;
  photos: ImageKey[]; // grid of images
  date: ISODate;
}

// ─── Resources ──────────────────────────────────────────────────────────────
export type ResourceCategoryKey =
  | 'bible-studies'
  | 'parenting'
  | 'discipleship'
  | 'financial'
  | 'bible-academy';

export interface ResourceCategory {
  key: ResourceCategoryKey;
  title: string;
  description: string;
  image: ImageKey;
  itemCount: number;
}

export interface ResourceItem {
  id: UUID;
  categoryKey: ResourceCategoryKey;
  title: string;
  author: string;
  format: 'course' | 'article' | 'video' | 'guide' | 'audio';
  minutes: number;
  image: ImageKey;
  description: string;
}

// Bible Academy (future-ready course modules).
export interface AcademyModule {
  id: UUID;
  code: string; // e.g. "101"
  title: string;
  summary: string;
  lessons: number;
  image: ImageKey;
  status: 'available' | 'coming-soon';
}

// ─── Curated ministries (trusted external partners) ─────────────────────────
export interface CuratedMinistry {
  id: UUID;
  name: string;
  tagline: string;
  url: string;
  // TODO(api): most expose RSS/JSON feeds — add `feedUrl` to pull content later.
}

// ─── Study Bible ────────────────────────────────────────────────────────────
export interface CommentarySource {
  id: string;
  name: string;
  era: string;
  available: boolean; // false = "coming soon" placeholder
}

export interface StudyPassage {
  reference: string;
  background: string;
  keyThemes: string[];
  howToStudy: string[]; // Observe / Interpret / Apply guidance
  crossReferences: { ref: string; note: string }[];
  footnotes: { marker: string; text: string }[];
  reflectionQuestions: string[];
  commentaryPreview: { source: string; text: string }[];
}
