/**
 * The 66 books of the canon with their chapter counts — the raw material every
 * reading plan is built from. Chapter counts match the bundled KJV text
 * (`kjv.json`), but live here as a small table so plan generation never has to
 * load the multi-megabyte Bible JSON.
 */
export type Testament = 'OT' | 'NT';

/** Broad section of Scripture, used to label a day's reading. */
export type Division = 'Law' | 'History' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Letters' | 'Prophecy';

export interface CanonBook {
  name: string;
  chapters: number;
  testament: Testament;
  division: Division;
}

export const CANON: CanonBook[] = [
  // ── Old Testament ────────────────────────────────────────────────────────
  { name: 'Genesis', chapters: 50, testament: 'OT', division: 'Law' },
  { name: 'Exodus', chapters: 40, testament: 'OT', division: 'Law' },
  { name: 'Leviticus', chapters: 27, testament: 'OT', division: 'Law' },
  { name: 'Numbers', chapters: 36, testament: 'OT', division: 'Law' },
  { name: 'Deuteronomy', chapters: 34, testament: 'OT', division: 'Law' },
  { name: 'Joshua', chapters: 24, testament: 'OT', division: 'History' },
  { name: 'Judges', chapters: 21, testament: 'OT', division: 'History' },
  { name: 'Ruth', chapters: 4, testament: 'OT', division: 'History' },
  { name: '1 Samuel', chapters: 31, testament: 'OT', division: 'History' },
  { name: '2 Samuel', chapters: 24, testament: 'OT', division: 'History' },
  { name: '1 Kings', chapters: 22, testament: 'OT', division: 'History' },
  { name: '2 Kings', chapters: 25, testament: 'OT', division: 'History' },
  { name: '1 Chronicles', chapters: 29, testament: 'OT', division: 'History' },
  { name: '2 Chronicles', chapters: 36, testament: 'OT', division: 'History' },
  { name: 'Ezra', chapters: 10, testament: 'OT', division: 'History' },
  { name: 'Nehemiah', chapters: 13, testament: 'OT', division: 'History' },
  { name: 'Esther', chapters: 10, testament: 'OT', division: 'History' },
  { name: 'Job', chapters: 42, testament: 'OT', division: 'Wisdom' },
  { name: 'Psalms', chapters: 150, testament: 'OT', division: 'Wisdom' },
  { name: 'Proverbs', chapters: 31, testament: 'OT', division: 'Wisdom' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'OT', division: 'Wisdom' },
  { name: 'Song of Solomon', chapters: 8, testament: 'OT', division: 'Wisdom' },
  { name: 'Isaiah', chapters: 66, testament: 'OT', division: 'Prophets' },
  { name: 'Jeremiah', chapters: 52, testament: 'OT', division: 'Prophets' },
  { name: 'Lamentations', chapters: 5, testament: 'OT', division: 'Prophets' },
  { name: 'Ezekiel', chapters: 48, testament: 'OT', division: 'Prophets' },
  { name: 'Daniel', chapters: 12, testament: 'OT', division: 'Prophets' },
  { name: 'Hosea', chapters: 14, testament: 'OT', division: 'Prophets' },
  { name: 'Joel', chapters: 3, testament: 'OT', division: 'Prophets' },
  { name: 'Amos', chapters: 9, testament: 'OT', division: 'Prophets' },
  { name: 'Obadiah', chapters: 1, testament: 'OT', division: 'Prophets' },
  { name: 'Jonah', chapters: 4, testament: 'OT', division: 'Prophets' },
  { name: 'Micah', chapters: 7, testament: 'OT', division: 'Prophets' },
  { name: 'Nahum', chapters: 3, testament: 'OT', division: 'Prophets' },
  { name: 'Habakkuk', chapters: 3, testament: 'OT', division: 'Prophets' },
  { name: 'Zephaniah', chapters: 3, testament: 'OT', division: 'Prophets' },
  { name: 'Haggai', chapters: 2, testament: 'OT', division: 'Prophets' },
  { name: 'Zechariah', chapters: 14, testament: 'OT', division: 'Prophets' },
  { name: 'Malachi', chapters: 4, testament: 'OT', division: 'Prophets' },
  // ── New Testament ────────────────────────────────────────────────────────
  { name: 'Matthew', chapters: 28, testament: 'NT', division: 'Gospels' },
  { name: 'Mark', chapters: 16, testament: 'NT', division: 'Gospels' },
  { name: 'Luke', chapters: 24, testament: 'NT', division: 'Gospels' },
  { name: 'John', chapters: 21, testament: 'NT', division: 'Gospels' },
  { name: 'Acts', chapters: 28, testament: 'NT', division: 'History' },
  { name: 'Romans', chapters: 16, testament: 'NT', division: 'Letters' },
  { name: '1 Corinthians', chapters: 16, testament: 'NT', division: 'Letters' },
  { name: '2 Corinthians', chapters: 13, testament: 'NT', division: 'Letters' },
  { name: 'Galatians', chapters: 6, testament: 'NT', division: 'Letters' },
  { name: 'Ephesians', chapters: 6, testament: 'NT', division: 'Letters' },
  { name: 'Philippians', chapters: 4, testament: 'NT', division: 'Letters' },
  { name: 'Colossians', chapters: 4, testament: 'NT', division: 'Letters' },
  { name: '1 Thessalonians', chapters: 5, testament: 'NT', division: 'Letters' },
  { name: '2 Thessalonians', chapters: 3, testament: 'NT', division: 'Letters' },
  { name: '1 Timothy', chapters: 6, testament: 'NT', division: 'Letters' },
  { name: '2 Timothy', chapters: 4, testament: 'NT', division: 'Letters' },
  { name: 'Titus', chapters: 3, testament: 'NT', division: 'Letters' },
  { name: 'Philemon', chapters: 1, testament: 'NT', division: 'Letters' },
  { name: 'Hebrews', chapters: 13, testament: 'NT', division: 'Letters' },
  { name: 'James', chapters: 5, testament: 'NT', division: 'Letters' },
  { name: '1 Peter', chapters: 5, testament: 'NT', division: 'Letters' },
  { name: '2 Peter', chapters: 3, testament: 'NT', division: 'Letters' },
  { name: '1 John', chapters: 5, testament: 'NT', division: 'Letters' },
  { name: '2 John', chapters: 1, testament: 'NT', division: 'Letters' },
  { name: '3 John', chapters: 1, testament: 'NT', division: 'Letters' },
  { name: 'Jude', chapters: 1, testament: 'NT', division: 'Letters' },
  { name: 'Revelation', chapters: 22, testament: 'NT', division: 'Prophecy' },
];

const BY_NAME = new Map(CANON.map((b) => [b.name, b]));

export function book(name: string): CanonBook {
  const found = BY_NAME.get(name);
  if (!found) throw new Error(`Unknown book: ${name}`);
  return found;
}

export function chaptersIn(name: string): number {
  return book(name).chapters;
}

/** 1,189 — every chapter in the Protestant canon. */
export const TOTAL_CHAPTERS = CANON.reduce((n, b) => n + b.chapters, 0);
