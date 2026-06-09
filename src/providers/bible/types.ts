import { BibleReadingDay } from '../../types/models';

export interface BiblePassage {
  reference: string;
  translation: string;
  /** Ordered verses. `redLetter` marks words of Christ when the version supports it. */
  verses: BibleVerse[];
  audioUrl: string | null; // null when no audio is available for this passage/version
  copyright: string;
}

export interface BibleVerse {
  number: number;
  text: string;
  /** Chapter this verse belongs to (for multi-chapter passages). */
  chapter?: number;
  redLetter?: boolean;
}

export interface BibleVersion {
  id: string; // e.g. "NIV"
  name: string; // "New International Version"
  supportsRedLetter: boolean;
  supportsAudio: boolean;
}

/**
 * Bible content provider contract.
 * Swappable: Mock, Fallback (our DB + open-licensed text), YouVersion (if licensed).
 */
export interface BibleProvider {
  readonly name: string;
  getVersions(): Promise<BibleVersion[]>;
  /** The 365-day "Bible in a year" schedule. */
  getReadingPlan(): Promise<BibleReadingDay[]>;
  getReadingDay(dayNumber: number): Promise<BibleReadingDay | null>;
  getPassage(reference: string, translation: string): Promise<BiblePassage>;
  /** Whether the given version exposes audio. */
  hasAudio(translation: string): Promise<boolean>;
}
