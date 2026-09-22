/**
 * The three classic "Bible in a year" schedules, generated from the canon table.
 *
 *  • canonical     — Genesis → Revelation, straight through (1,189 chapters / 365 days)
 *  • chronological — the same chapters, reordered into roughly the order events happened
 *  • blended       — parallel streams each day: OT + NT + a Psalm + a Proverb
 *
 * Plans are built lazily and cached, so the work happens once per app session.
 */
import { CANON, book, chaptersIn, Division } from './bibleCanon';
import {
  BiblePassageRef,
  BibleReadingDay,
  BibleReadingPlanId,
  BibleReadingPlanMeta,
  BibleReadingSegment,
} from '../types/models';

export const TOTAL_DAYS = 365;

export const BIBLE_PLANS: BibleReadingPlanMeta[] = [
  {
    id: 'canonical',
    name: 'Genesis → Revelation',
    method: 'Canonical',
    summary: 'Straight through, in the order the books appear',
    description:
      'Read the Bible in the order the books appear. It is the simplest approach and shows the Bible’s broad progression, though you will spend long stretches in one kind of material — Leviticus, Chronicles, the prophets.',
    sample: 'Day 1 · Genesis 1–4',
  },
  {
    id: 'chronological',
    name: 'The unfolding story',
    method: 'Chronological',
    summary: 'Passages in roughly the order the events happened',
    description:
      'Read passages in approximately the order the events happened. Job sits near Genesis, the Psalms fall alongside David’s life, the prophets are read with Kings and Chronicles, and the Gospels are arranged around Jesus’ ministry. Best for seeing the Bible as one unfolding story.',
    sample: 'Day 1 · Genesis 1–4',
  },
  {
    id: 'blended',
    name: 'Multiple streams',
    method: 'Blended',
    summary: 'Old Testament, New Testament, a Psalm and a Proverb daily',
    description:
      'Read from different parts of Scripture each day — Old Testament, New Testament, a Psalm and a Proverb. You get variety every day and stay in both Testaments all year.',
    sample: 'Day 12 · Genesis 12–13 · Matthew 6 · Psalm 12 · Proverbs 12',
  },
];

export const DEFAULT_PLAN_ID: BibleReadingPlanId = 'blended';

export function planMeta(id: BibleReadingPlanId): BibleReadingPlanMeta {
  return BIBLE_PLANS.find((p) => p.id === id) ?? BIBLE_PLANS[0];
}

// ─── Chapter streams ────────────────────────────────────────────────────────

interface Chapter {
  book: string;
  chapter: number;
  label: string;
}

/** Row in an ordered reading sequence: a whole book, or a slice of one. */
interface Span {
  book: string;
  from?: number;
  to?: number;
}

const DIVISION_LABEL: Record<Division, string> = {
  Law: 'Law',
  History: 'History',
  Wisdom: 'Wisdom',
  Prophets: 'Prophets',
  Gospels: 'Gospels',
  Letters: 'Letters',
  Prophecy: 'Prophecy',
};

function expand(spans: Span[]): Chapter[] {
  const out: Chapter[] = [];
  for (const span of spans) {
    const meta = book(span.book);
    const from = span.from ?? 1;
    const to = span.to ?? meta.chapters;
    for (let c = from; c <= to; c++) {
      out.push({ book: meta.name, chapter: c, label: DIVISION_LABEL[meta.division] });
    }
  }
  return out;
}

/**
 * Split a chapter stream into `days` portions of near-equal length. Longer
 * portions come first so the plan never ends on an unexpectedly heavy day.
 */
function chunk<T>(items: T[], days: number): T[][] {
  const base = Math.floor(items.length / days);
  const remainder = items.length % days;
  const out: T[][] = [];
  let i = 0;
  for (let d = 0; d < days; d++) {
    const size = base + (d < remainder ? 1 : 0);
    out.push(items.slice(i, i + size));
    i += size;
  }
  return out;
}

const EN_DASH = '–';

function ref(bookName: string, start: number, end: number): BiblePassageRef {
  // A single psalm reads "Psalm 23", not "Psalms 23".
  const display = bookName === 'Psalms' && start === end ? 'Psalm' : bookName;
  return {
    reference: start === end ? `${display} ${start}` : `${display} ${start}${EN_DASH}${end}`,
    book: bookName,
    startChapter: start,
    endChapter: end,
  };
}

/** Collapse a day's chapters into one segment per run of consecutive chapters. */
function toSegments(chapters: Chapter[], labelOverride?: string): BibleReadingSegment[] {
  const segments: BibleReadingSegment[] = [];
  let run: Chapter[] = [];

  const flush = () => {
    if (!run.length) return;
    const first = run[0];
    const last = run[run.length - 1];
    segments.push({
      label: labelOverride ?? first.label,
      passage: ref(first.book, first.chapter, last.chapter),
    });
    run = [];
  };

  for (const ch of chapters) {
    const prev = run[run.length - 1];
    if (prev && (prev.book !== ch.book || ch.chapter !== prev.chapter + 1)) flush();
    run.push(ch);
  }
  flush();
  return segments;
}

// ─── Reading orders ─────────────────────────────────────────────────────────

const CANONICAL_ORDER: Span[] = CANON.map((b) => ({ book: b.name }));

/**
 * An approximate chronological sequence. Ordering the whole Bible strictly by
 * event is contested, so this follows the common convention: Job beside the
 * patriarchs, the Psalms grouped around David and the exile, the prophets set
 * against Kings/Chronicles, and the NT letters read alongside Acts.
 */
const CHRONOLOGICAL_ORDER: Span[] = [
  { book: 'Genesis', from: 1, to: 11 },
  { book: 'Job' },
  { book: 'Genesis', from: 12, to: 50 },
  { book: 'Exodus' },
  { book: 'Leviticus' },
  { book: 'Numbers' },
  { book: 'Deuteronomy' },
  { book: 'Joshua' },
  { book: 'Judges' },
  { book: 'Ruth' },
  { book: '1 Samuel' },
  { book: 'Psalms', from: 1, to: 41 }, // David: flight from Saul into his reign
  { book: '2 Samuel' },
  { book: '1 Chronicles' },
  { book: 'Psalms', from: 42, to: 89 },
  { book: 'Proverbs' },
  { book: 'Ecclesiastes' },
  { book: 'Song of Solomon' },
  { book: '1 Kings' },
  { book: '2 Chronicles', from: 1, to: 20 },
  { book: 'Obadiah' },
  { book: 'Joel' },
  { book: 'Jonah' },
  { book: 'Amos' },
  { book: 'Hosea' },
  { book: 'Isaiah' },
  { book: 'Micah' },
  { book: '2 Kings' },
  { book: '2 Chronicles', from: 21, to: 36 },
  { book: 'Nahum' },
  { book: 'Zephaniah' },
  { book: 'Habakkuk' },
  { book: 'Jeremiah' },
  { book: 'Lamentations' },
  { book: 'Ezekiel' },
  { book: 'Daniel' },
  { book: 'Psalms', from: 90, to: 150 }, // exile and return
  { book: 'Ezra' },
  { book: 'Haggai' },
  { book: 'Zechariah' },
  { book: 'Esther' },
  { book: 'Nehemiah' },
  { book: 'Malachi' },
  // New Testament: the ministry, then the church as it spread
  { book: 'Luke' },
  { book: 'Mark' },
  { book: 'Matthew' },
  { book: 'John' },
  { book: 'Acts' },
  { book: 'James' },
  { book: 'Galatians' },
  { book: '1 Thessalonians' },
  { book: '2 Thessalonians' },
  { book: '1 Corinthians' },
  { book: '2 Corinthians' },
  { book: 'Romans' },
  { book: 'Ephesians' },
  { book: 'Philippians' },
  { book: 'Colossians' },
  { book: 'Philemon' },
  { book: '1 Timothy' },
  { book: 'Titus' },
  { book: '1 Peter' },
  { book: '2 Peter' },
  { book: '2 Timothy' },
  { book: 'Hebrews' },
  { book: 'Jude' },
  { book: '1 John' },
  { book: '2 John' },
  { book: '3 John' },
  { book: 'Revelation' },
];

// Blended streams: the OT (minus the two devotional books, which get their own
// streams) and the NT run in parallel all year.
const BLENDED_OT: Span[] = CANON.filter(
  (b) => b.testament === 'OT' && b.name !== 'Psalms' && b.name !== 'Proverbs',
).map((b) => ({ book: b.name }));

const BLENDED_NT: Span[] = CANON.filter((b) => b.testament === 'NT').map((b) => ({ book: b.name }));

// ─── Builders ───────────────────────────────────────────────────────────────

function singleStreamPlan(planId: BibleReadingPlanId, order: Span[]): BibleReadingDay[] {
  return chunk(expand(order), TOTAL_DAYS).map((chapters, i) => ({
    id: `${planId}-${i + 1}`,
    dayNumber: i + 1,
    planId,
    segments: toSegments(chapters),
  }));
}

function blendedPlan(): BibleReadingDay[] {
  const planId: BibleReadingPlanId = 'blended';
  const ot = chunk(expand(BLENDED_OT), TOTAL_DAYS);
  const nt = expand(BLENDED_NT);
  const psalms = chaptersIn('Psalms');
  const proverbs = chaptersIn('Proverbs');

  return Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const day = i + 1;
    // The NT is shorter than a chapter a day, so the stream wraps: it finishes
    // on day 260 and a second pass carries the rest of the year.
    const ntChapter = nt[i % nt.length];
    const psalm = (i % psalms) + 1;
    const proverb = (i % proverbs) + 1;

    return {
      id: `${planId}-${day}`,
      dayNumber: day,
      planId,
      segments: [
        ...toSegments(ot[i], 'Old Testament'),
        { label: 'New Testament', passage: ref(ntChapter.book, ntChapter.chapter, ntChapter.chapter) },
        { label: 'Psalm', passage: ref('Psalms', psalm, psalm) },
        { label: 'Proverb', passage: ref('Proverbs', proverb, proverb) },
      ],
    };
  });
}

const CACHE = new Map<BibleReadingPlanId, BibleReadingDay[]>();

/** The full 365-day schedule for a plan. Built once, then cached. */
export function getPlanDays(planId: BibleReadingPlanId): BibleReadingDay[] {
  const cached = CACHE.get(planId);
  if (cached) return cached;

  const days =
    planId === 'canonical'
      ? singleStreamPlan('canonical', CANONICAL_ORDER)
      : planId === 'chronological'
        ? singleStreamPlan('chronological', CHRONOLOGICAL_ORDER)
        : blendedPlan();

  CACHE.set(planId, days);
  return days;
}

export function getPlanDay(planId: BibleReadingPlanId, dayNumber: number): BibleReadingDay | null {
  return getPlanDays(planId).find((d) => d.dayNumber === dayNumber) ?? null;
}
