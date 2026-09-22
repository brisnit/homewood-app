import { BibleProvider, BiblePassage, BibleVerse, BibleVersion } from './types';
import { MockBibleProvider } from './MockBibleProvider';
import { BibleReadingDay, BibleReadingPlanId, BibleReadingPlanMeta } from '../../types/models';
import { getChapterVerses, BIBLE_VERSION } from '../../data/bibleText';

/**
 * Fallback Bible provider — fully offline.
 *
 * - The 365-day reading *schedule* is Homewood-owned (seeded via the mock store).
 * - Passage *text* comes from a public-domain Bible (King James Version) bundled
 *   with the app (src/data/kjv.json), so the reader works with no network.
 *   Multi-chapter readings (e.g. "Genesis 1–2") are assembled from each chapter.
 * - If a reference can't be resolved it falls back to mock sample text.
 *
 * NOTE: Public-domain KJV text has no red-letter markup or audio here.
 * TODO(bible-text): For NIV/ESV/red-letter/audio, add a licensed provider
 *   (e.g. YouVersion) — the interface stays identical.
 */

/**
 * Full translation list for the picker. Only KJV is bundled with real offline
 * text; the rest are prototype entries — selecting one shows the bundled KJV
 * text labeled as that version. Red-letter / audio flags drive UI affordances.
 * TODO(bible-text): wire licensed translations (e.g. via YouVersion) for real text.
 */
const VERSIONS: BibleVersion[] = [
  { id: 'NIV', name: 'New International Version', supportsRedLetter: true, supportsAudio: true },
  { id: 'ESV', name: 'English Standard Version', supportsRedLetter: true, supportsAudio: true },
  { id: 'KJV', name: 'King James Version', supportsRedLetter: true, supportsAudio: true },
  { id: 'NKJV', name: 'New King James Version', supportsRedLetter: true, supportsAudio: true },
  { id: 'NLT', name: 'New Living Translation', supportsRedLetter: false, supportsAudio: true },
  { id: 'NASB', name: 'New American Standard Bible', supportsRedLetter: true, supportsAudio: true },
  { id: 'CSB', name: 'Christian Standard Bible', supportsRedLetter: true, supportsAudio: true },
  { id: 'AMP', name: 'Amplified Bible', supportsRedLetter: true, supportsAudio: false },
  { id: 'MSG', name: 'The Message', supportsRedLetter: false, supportsAudio: true },
  { id: 'WEB', name: 'World English Bible', supportsRedLetter: false, supportsAudio: false },
  { id: 'ASV', name: 'American Standard Version', supportsRedLetter: false, supportsAudio: false },
];

/** KJV source marks added words with {curly} braces and psalm titles with [brackets]. */
function cleanVerse(text: string): string {
  return text
    .replace(/[{}[\]]/g, '') // drop italic/title markers, keep the words
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse a reference into book + chapter span. Handles chapter ranges and
 * verse-level refs (verses are dropped — we show the whole chapter):
 *   "Genesis 1–2"   -> {book:'Genesis', start:1, end:2}
 *   "Psalm 23"      -> {book:'Psalm', start:23, end:23}
 *   "Psalm 23:1–3"  -> {book:'Psalm', start:23, end:23}
 *   "1 Peter 5:7"   -> {book:'1 Peter', start:5, end:5}
 */
function parseReference(reference: string): { book: string; start: number; end: number } | null {
  // Split book (may start with a number, e.g. "1 Peter") from the numeric part.
  const m = /^(.+?)\s+(\d.*)$/.exec(reference.trim());
  if (!m) return null;
  const book = m[1].trim();
  const rest = m[2];

  // Chapter:verse form -> chapter is the number before the colon.
  if (rest.includes(':')) {
    const ch = parseInt(rest, 10);
    return Number.isFinite(ch) ? { book, start: ch, end: ch } : null;
  }

  // Chapter or chapter-range form.
  const cm = /^(\d+)(?:\s*[-–—]\s*(\d+))?/.exec(rest);
  if (!cm) return null;
  const start = parseInt(cm[1], 10);
  const end = cm[2] ? parseInt(cm[2], 10) : start;
  return { book, start, end };
}

export class FallbackBibleProvider implements BibleProvider {
  readonly name = 'fallback';
  private mock = new MockBibleProvider();

  getVersions(): Promise<BibleVersion[]> {
    return Promise.resolve(VERSIONS);
  }

  getReadingPlans(): Promise<BibleReadingPlanMeta[]> {
    return this.mock.getReadingPlans();
  }
  getReadingPlan(planId: BibleReadingPlanId): Promise<BibleReadingDay[]> {
    return this.mock.getReadingPlan(planId);
  }
  getReadingDay(planId: BibleReadingPlanId, dayNumber: number): Promise<BibleReadingDay | null> {
    return this.mock.getReadingDay(planId, dayNumber);
  }

  async getPassage(reference: string, _translation: string): Promise<BiblePassage> {
    const parsed = parseReference(reference);
    if (!parsed) return this.mock.getPassage(reference, _translation);

    const end = Math.min(parsed.end, parsed.start + 5); // safety cap
    const verses: BibleVerse[] = [];
    for (let ch = parsed.start; ch <= end; ch++) {
      const chapterVerses = getChapterVerses(parsed.book, ch);
      if (!chapterVerses) continue;
      chapterVerses.forEach((text, i) =>
        verses.push({ number: i + 1, chapter: ch, text: cleanVerse(text) }),
      );
    }

    // If nothing resolved (unknown book), fall back to sample text.
    if (!verses.length) return this.mock.getPassage(reference, _translation);

    // Reflect the user's selection in the UI; KJV is the actual bundled text.
    const requested = (_translation || BIBLE_VERSION.id).toUpperCase();
    return {
      reference,
      translation: requested,
      verses,
      // Placeholder so the reader shows the audio player UI. TODO(audio): wire to
      // a real narration source (e.g. licensed audio or a TTS service).
      audioUrl: `placeholder://audio/${encodeURIComponent(reference)}`,
      copyright:
        requested === BIBLE_VERSION.id
          ? `${BIBLE_VERSION.name} · public domain`
          : `Preview · text shown in the ${BIBLE_VERSION.name} (offline)`,
    };
  }

  async hasAudio(_translation?: string): Promise<boolean> {
    return true;
  }
}
