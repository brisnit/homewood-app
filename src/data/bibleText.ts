/**
 * Bundled public-domain Bible text (King James Version) — fully offline.
 * Source: thiagobodruk/bible (en_kjv), public domain.
 *
 * Shape: [{ name: string, chapters: string[][] }]  (chapters[ch-1][verse-1] = text)
 * The JSON is required lazily-ish (module load) and indexed by book name once.
 */
type BibleBook = { name: string; chapters: string[][] };

// require() keeps the large JSON opaque to tsc (no multi-MB type inference).
const BOOKS: BibleBook[] = require('./kjv.json');

// Index by lowercased book name, with common aliases for our reference strings.
const byName = new Map<string, BibleBook>();
for (const b of BOOKS) byName.set(b.name.toLowerCase(), b);

const ALIASES: Record<string, string> = {
  psalm: 'psalms',
  proverb: 'proverbs',
  'song of songs': 'song of solomon',
  revelations: 'revelation',
};

function findBook(name: string): BibleBook | undefined {
  const key = name.trim().toLowerCase();
  return byName.get(key) ?? byName.get(ALIASES[key] ?? '');
}

export const BIBLE_VERSION = { id: 'KJV', name: 'King James Version' };

/** Verses (text strings) for a single chapter, or null if not found. */
export function getChapterVerses(book: string, chapter: number): string[] | null {
  const b = findBook(book);
  if (!b) return null;
  return b.chapters[chapter - 1] ?? null;
}

/** Single verse text (cleaned of KJV markup), or null if not found. */
export function getVerseText(book: string, chapter: number, verse: number): string | null {
  const verses = getChapterVerses(book, chapter);
  const text = verses?.[verse - 1];
  if (!text) return null;
  return clean(text);
}

function clean(text: string): string {
  return text.replace(/[{}[\]]/g, '').replace(/\s+/g, ' ').trim();
}

export interface VerseLine {
  verse: number;
  text: string;
}

/**
 * Resolve a reference like "1 Corinthians 13:4–7" to its specific verses.
 * If no verse range is given (e.g. "Psalm 23"), returns the whole chapter.
 */
export function getReferenceVerses(reference: string): VerseLine[] | null {
  const m = /^(.+?)\s+(\d+)(?::(\d+)(?:\s*[-–—]\s*(\d+))?)?/.exec(reference.trim());
  if (!m) return null;
  const book = m[1].trim();
  const chapter = parseInt(m[2], 10);
  const verses = getChapterVerses(book, chapter);
  if (!verses) return null;

  if (m[3]) {
    const start = parseInt(m[3], 10);
    const end = m[4] ? parseInt(m[4], 10) : start;
    return verses
      .slice(start - 1, end)
      .map((text, i) => ({ verse: start + i, text: clean(text) }));
  }
  return verses.map((text, i) => ({ verse: i + 1, text: clean(text) }));
}

/** Whether a book name resolves in the bundled text. */
export function hasBook(book: string): boolean {
  return findBook(book) !== undefined;
}
