/**
 * Homewood Living Ministries — mock content store.
 * Lets the entire app run with no API keys. Providers read from here when in
 * `mock` mode. Original devotional copy written for Homewood Living Ministries.
 */
import {
  Badge,
  BibleReadingDay,
  Devotional,
  DevotionalCategory,
  DevotionalCategoryKey,
  Plan,
  PlanDay,
  SuggestedFriend,
  UserBadge,
  VerseOfTheDay,
  ActivityItem,
  Prayer,
  SavedItem,
  Highlight,
  Note,
} from '../types/models';
import { PLAN_IMAGES } from './planImages';
import { CATEGORY_LESSONS } from './planLessons';

export const CATEGORIES: DevotionalCategory[] = [
  { key: 'love', label: 'Love', accent: 'clay' },
  { key: 'anxiety', label: 'Anxiety', accent: 'slate' },
  { key: 'anger', label: 'Anger', accent: 'clay' },
  { key: 'hope', label: 'Hope', accent: 'brass' },
  { key: 'depression', label: 'Depression', accent: 'slate' },
  { key: 'peace', label: 'Peace', accent: 'pine' },
  { key: 'fear', label: 'Fear', accent: 'navy' },
  { key: 'stress', label: 'Stress', accent: 'pine' },
];

export const VERSE_OF_THE_DAY: VerseOfTheDay = {
  id: 'votd-2026-06-08',
  date: '2026-06-08',
  reference: 'Philippians 4:6–7',
  book: 'Philippians',
  chapter: 4,
  text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
  translation: 'NIV',
  likes: 1284,
  comments: 96,
  downloads: 412,
};

export const DEVOTIONALS: Devotional[] = [
  {
    id: 'dev-still-waters',
    title: 'Beside Still Waters',
    description: 'Learning to rest in God’s provision when life feels relentless.',
    category: 'peace',
    estimatedMinutes: 4,
    scriptureRef: 'Psalm 23:1–3',
    imageColor: 'pine',
    body: 'The shepherd does not drive the sheep; he leads them. When the Psalmist writes that the Lord makes him lie down in green pastures, he describes a God who knows our need for rest before we do. Today, let yourself be led beside still waters. Peace is not the absence of pressure but the presence of the One who restores your soul.',
  },
  {
    id: 'dev-anchor-hope',
    title: 'An Anchor for the Soul',
    description: 'Why hope holds steady even when circumstances shift.',
    category: 'hope',
    estimatedMinutes: 5,
    scriptureRef: 'Hebrews 6:19',
    imageColor: 'brass',
    body: 'Hope, the writer of Hebrews says, is an anchor for the soul, firm and secure. An anchor is not what you see; it is what holds you when the storm hides the shore. Christian hope is not wishful thinking. It is confidence anchored in a promise that cannot move. Whatever waves meet you today, your anchor still holds.',
  },
  {
    id: 'dev-cast-anxiety',
    title: 'Casting Every Care',
    description: 'A practical rhythm for handing your worries to God.',
    category: 'anxiety',
    estimatedMinutes: 4,
    scriptureRef: '1 Peter 5:7',
    imageColor: 'slate',
    body: 'Cast all your anxiety on him because he cares for you. The word "cast" is active — it is something we do, often more than once a day. Anxiety tends to return quietly to our hands. The invitation is to keep releasing it, keep handing it back, trusting that the God who holds the universe can certainly hold your concerns.',
  },
  {
    id: 'dev-perfect-love',
    title: 'Perfect Love Drives Out Fear',
    description: 'How being fully known and fully loved quiets fear.',
    category: 'fear',
    estimatedMinutes: 5,
    scriptureRef: '1 John 4:18',
    imageColor: 'navy',
    body: 'There is no fear in love, but perfect love drives out fear. Fear often whispers that if we were truly known, we would not be loved. The gospel answers with a love that knows us completely and stays. As you receive that love today, notice how its warmth makes room where fear once stood.',
  },
  {
    id: 'dev-slow-to-anger',
    title: 'Slow to Anger',
    description: 'Finding the pause between feeling and reaction.',
    category: 'anger',
    estimatedMinutes: 3,
    scriptureRef: 'James 1:19–20',
    imageColor: 'clay',
    body: 'Be quick to listen, slow to speak and slow to become angry. James is not asking us to feel nothing; he is inviting us into a holy pause. In that small space between feeling and reaction, the Spirit does some of his finest work. Today, practice the pause.',
  },
];

// Bundled cover photos for devotionals (reuse the verified plan image set).
const DEVOTIONAL_IMAGE_IDS: Record<string, string> = {
  'dev-still-waters': '1506744038136-46273834b3fb',
  'dev-anchor-hope': '1472214103451-9374bd1c798e',
  'dev-cast-anxiety': '1454372182658-c712e4c5a1db',
  'dev-perfect-love': '1439853949127-fa647821eba0',
  'dev-slow-to-anger': '1419242902214-272b3f66ee7a',
};
DEVOTIONALS.forEach((d) => {
  const id = DEVOTIONAL_IMAGE_IDS[d.id];
  if (id) d.image = PLAN_IMAGES[id];
});

const RAW_PLANS: Plan[] = [
  // ─── Love ──────────────────────────────────────────────────────────────────
  { id: 'plan-rooted-love', title: 'Rooted in Love', category: 'love', days: 10, description: 'Discover the breadth and depth of God’s love for you.', coverColor: 'clay' },
  { id: 'plan-greatest-of-these', title: 'The Greatest of These', category: 'love', days: 7, description: 'A week walking through 1 Corinthians 13, the love chapter.', coverColor: 'brass' },
  { id: 'plan-love-your-neighbor', title: 'Loving Your Neighbor', category: 'love', days: 5, description: 'Practical ways to carry God’s love to the people around you.', coverColor: 'pine' },
  { id: 'plan-fathers-love', title: 'A Father’s Love', category: 'love', days: 7, description: 'Resting in the steadfast, unearned love of the Father.', coverColor: 'navy' },
  { id: 'plan-love-that-heals', title: 'Love That Heals', category: 'love', days: 14, description: 'How being fully known and loved mends old wounds.', coverColor: 'slate' },

  // ─── Anxiety ───────────────────────────────────────────────────────────────
  { id: 'plan-quiet-anxiety', title: 'Quieting Anxiety', category: 'anxiety', days: 14, description: 'Two weeks of scripture and rhythms to calm an anxious heart.', coverColor: 'slate' },
  { id: 'plan-anxious-for-nothing', title: 'Anxious for Nothing', category: 'anxiety', days: 7, description: 'Trade worry for prayer, one day at a time.', coverColor: 'pine' },
  { id: 'plan-casting-cares', title: 'Casting Your Cares', category: 'anxiety', days: 5, description: 'A short reset for handing your worries to God.', coverColor: 'brass' },
  { id: 'plan-peace-in-the-storm', title: 'Peace in the Storm', category: 'anxiety', days: 10, description: 'Steady your soul when life feels out of control.', coverColor: 'navy' },
  { id: 'plan-rest-anxious-mind', title: 'Rest for the Anxious Mind', category: 'anxiety', days: 21, description: 'Three weeks of renewing your thoughts in truth.', coverColor: 'clay' },

  // ─── Anger ─────────────────────────────────────────────────────────────────
  { id: 'plan-gentle-anger', title: 'The Gentle Answer', category: 'anger', days: 7, description: 'Learn the discipline of slow, gentle responses.', coverColor: 'clay' },
  { id: 'plan-slow-to-anger', title: 'Slow to Anger', category: 'anger', days: 5, description: 'Finding the holy pause between feeling and reaction.', coverColor: 'navy' },
  { id: 'plan-releasing-resentment', title: 'Releasing Resentment', category: 'anger', days: 10, description: 'Let go of bitterness and make room for grace.', coverColor: 'slate' },
  { id: 'plan-tame-the-tongue', title: 'Tame the Tongue', category: 'anger', days: 7, description: 'Words that build up instead of tearing down.', coverColor: 'pine' },
  { id: 'plan-anger-to-forgiveness', title: 'From Anger to Forgiveness', category: 'anger', days: 14, description: 'A journey from offense toward freedom.', coverColor: 'brass' },

  // ─── Hope ──────────────────────────────────────────────────────────────────
  { id: 'plan-anchored-hope', title: 'Anchored in Hope', category: 'hope', days: 7, description: 'A week of grounding your hope in unchanging promises.', coverColor: 'brass' },
  { id: 'plan-hope-that-holds', title: 'Hope That Holds', category: 'hope', days: 10, description: 'When circumstances shift, find what cannot move.', coverColor: 'navy' },
  { id: 'plan-renewed-each-morning', title: 'Renewed Each Morning', category: 'hope', days: 14, description: 'New mercies and fresh hope for every day.', coverColor: 'pine' },
  { id: 'plan-living-hope', title: 'A Living Hope', category: 'hope', days: 5, description: 'The resurrection hope that changes everything.', coverColor: 'clay' },
  { id: 'plan-hope-for-the-weary', title: 'Hope for the Weary', category: 'hope', days: 21, description: 'Encouragement for the long, tiring seasons.', coverColor: 'slate' },

  // ─── Depression ────────────────────────────────────────────────────────────
  { id: 'plan-through-valley', title: 'Through the Valley', category: 'depression', days: 21, description: 'Companionship and scripture for the low places.', coverColor: 'slate' },
  { id: 'plan-lifting-the-darkness', title: 'Lifting the Darkness', category: 'depression', days: 14, description: 'Small, gentle steps toward the light.', coverColor: 'navy' },
  { id: 'plan-near-the-brokenhearted', title: 'Near the Brokenhearted', category: 'depression', days: 10, description: 'God’s nearness when you feel most alone.', coverColor: 'pine' },
  { id: 'plan-light-in-low-places', title: 'A Light in the Low Places', category: 'depression', days: 7, description: 'A week of honest psalms and quiet comfort.', coverColor: 'brass' },
  { id: 'plan-finding-joy-again', title: 'Finding Joy Again', category: 'depression', days: 30, description: 'A longer walk back toward gladness and hope.', coverColor: 'clay' },

  // ─── Peace ─────────────────────────────────────────────────────────────────
  { id: 'plan-pathways-peace', title: 'Pathways to Peace', category: 'peace', days: 7, description: 'Daily practices for a settled, peaceful spirit.', coverColor: 'pine' },
  { id: 'plan-perfect-peace', title: 'Perfect Peace', category: 'peace', days: 10, description: 'Keep your mind stayed on God and be kept in peace.', coverColor: 'navy' },
  { id: 'plan-peace-that-guards', title: 'The Peace That Guards', category: 'peace', days: 5, description: 'A short reset to guard your heart and mind.', coverColor: 'brass' },
  { id: 'plan-still-waters', title: 'Beside Still Waters', category: 'peace', days: 14, description: 'Learning to be led, restored, and unhurried.', coverColor: 'slate' },
  { id: 'plan-shalom-wholeness', title: 'Shalom: Wholeness in God', category: 'peace', days: 21, description: 'Explore the full, flourishing peace of God.', coverColor: 'clay' },

  // ─── Fear ──────────────────────────────────────────────────────────────────
  { id: 'plan-courage-fear', title: 'Courage Over Fear', category: 'fear', days: 10, description: 'Replace fear’s lies with God’s steady truth.', coverColor: 'navy' },
  { id: 'plan-do-not-be-afraid', title: 'Do Not Be Afraid', category: 'fear', days: 7, description: 'The most repeated command in Scripture, day by day.', coverColor: 'brass' },
  { id: 'plan-fearfully-held', title: 'Fearfully Held', category: 'fear', days: 5, description: 'Rest in the God who holds you fast.', coverColor: 'pine' },
  { id: 'plan-faith-over-fear', title: 'Faith Over Fear', category: 'fear', days: 14, description: 'Grow a trust that is bigger than your fears.', coverColor: 'clay' },
  { id: 'plan-god-goes-before', title: 'The God Who Goes Before', category: 'fear', days: 21, description: 'Face the unknown with the One already there.', coverColor: 'slate' },

  // ─── Stress ────────────────────────────────────────────────────────────────
  { id: 'plan-unburdened', title: 'Unburdened', category: 'stress', days: 14, description: 'Lay down stress and pick up rest in God.', coverColor: 'pine' },
  { id: 'plan-come-to-me-weary', title: 'Come to Me, All Who Are Weary', category: 'stress', days: 7, description: 'Find the easy yoke and the light burden.', coverColor: 'navy' },
  { id: 'plan-rhythms-of-rest', title: 'Rhythms of Rest', category: 'stress', days: 10, description: 'Build sustainable habits of work and rest.', coverColor: 'brass' },
  { id: 'plan-letting-go-weight', title: 'Letting Go of the Weight', category: 'stress', days: 5, description: 'A short reset to release what you were never meant to carry.', coverColor: 'clay' },
  { id: 'plan-sabbath-for-the-soul', title: 'Sabbath for the Soul', category: 'stress', days: 21, description: 'Recover the gift of rest, three weeks at a time.', coverColor: 'slate' },
];

// Calming, on-theme cover photography — bundled locally (see planImages.ts) so it
// is permanent and works offline. Each category has a small pool; plans are
// assigned one in order so they don't repeat.
const CATEGORY_IMAGE_IDS: Record<DevotionalCategoryKey, string[]> = {
  love: ['1490750967868-88aa4486c946', '1444703686981-a3abbc4d4fe3', '1473773508845-188df298d2d1', '1500382017468-9049fed747ef', '1441974231531-c6227db76b6e'],
  anxiety: ['1454372182658-c712e4c5a1db', '1518837695005-2083093ee35b', '1470071459604-3b5ec3a7fe05', '1506744038136-46273834b3fb', '1502082553048-f009c37129b9'],
  anger: ['1419242902214-272b3f66ee7a', '1497436072909-60f360e1d4b1', '1470071459604-3b5ec3a7fe05', '1428908728789-d2de25dbd4e2', '1439853949127-fa647821eba0'],
  hope: ['1472214103451-9374bd1c798e', '1441974231531-c6227db76b6e', '1444703686981-a3abbc4d4fe3', '1465101162946-4377e57745c3', '1518495973542-4542c06a5843'],
  depression: ['1518495973542-4542c06a5843', '1470071459604-3b5ec3a7fe05', '1502082553048-f009c37129b9', '1441974231531-c6227db76b6e', '1428908728789-d2de25dbd4e2'],
  peace: ['1506744038136-46273834b3fb', '1426604966848-d7adac402bff', '1507525428034-b723cf961d3e', '1518837695005-2083093ee35b', '1454372182658-c712e4c5a1db'],
  fear: ['1439853949127-fa647821eba0', '1497436072909-60f360e1d4b1', '1465101162946-4377e57745c3', '1428908728789-d2de25dbd4e2', '1426604966848-d7adac402bff'],
  stress: ['1507525428034-b723cf961d3e', '1419242902214-272b3f66ee7a', '1502082553048-f009c37129b9', '1500382017468-9049fed747ef', '1506744038136-46273834b3fb'],
};

// Attach a unique-per-category bundled image to each plan.
const _imageSeen: Partial<Record<DevotionalCategoryKey, number>> = {};
export const PLANS: Plan[] = RAW_PLANS.map((plan) => {
  const pool = CATEGORY_IMAGE_IDS[plan.category];
  const i = _imageSeen[plan.category] ?? 0;
  _imageSeen[plan.category] = i + 1;
  return { ...plan, image: PLAN_IMAGES[pool[i % pool.length]] };
});

/**
 * Builds each day of a plan from its category's lesson library, so every day
 * has real, topical content. Pools cycle for plans longer than the library.
 */
export function makePlanDays(plan: Plan): PlanDay[] {
  const lessons = CATEGORY_LESSONS[plan.category];
  return Array.from({ length: plan.days }, (_, i) => {
    const lesson = lessons[i % lessons.length];
    return {
      id: `${plan.id}-day-${i + 1}`,
      planId: plan.id,
      dayNumber: i + 1,
      title: lesson.title,
      scriptureRef: lesson.scriptureRef,
      devotionalBody: lesson.body,
      prompt: lesson.prompt,
    };
  });
}

// ─── Badges ─────────────────────────────────────────────────────────────────
export const BADGES: Badge[] = [
  { id: 'badge-first-light', key: 'first_light', title: 'First Light', description: 'Completed your first devotional.', icon: '🌅', color: 'brass' },
  { id: 'badge-7-day', key: 'streak_7', title: '7-Day Streak', description: 'Showed up seven days in a row.', icon: '🔥', color: 'clay' },
  { id: 'badge-peacemaker', key: 'peacemaker', title: 'Peacemaker', description: 'Finished a Peace plan.', icon: '🕊️', color: 'pine' },
  { id: 'badge-rooted', key: 'rooted', title: 'Deeply Rooted', description: 'Read for 30 days total.', icon: '🌳', color: 'pine' },
  { id: 'badge-friend', key: 'companion', title: 'Companion', description: 'Connected with your first friend.', icon: '🤝', color: 'slate' },
  { id: 'badge-scholar', key: 'scholar', title: 'Word Scholar', description: 'Completed 30 days of Bible reading.', icon: '📖', color: 'navy' },
];

export const USER_BADGES: UserBadge[] = [
  { badgeId: 'badge-first-light', userId: 'me', earned: true, earnedAt: '2026-05-30T08:00:00Z' },
  { badgeId: 'badge-7-day', userId: 'me', earned: true, earnedAt: '2026-06-06T08:00:00Z' },
  { badgeId: 'badge-companion', userId: 'me', earned: true, earnedAt: '2026-06-02T08:00:00Z' },
  { badgeId: 'badge-peacemaker', userId: 'me', earned: false, earnedAt: null, progress: 0.6 },
  { badgeId: 'badge-rooted', userId: 'me', earned: false, earnedAt: null, progress: 0.3 },
  { badgeId: 'badge-scholar', userId: 'me', earned: false, earnedAt: null, progress: 0.15 },
];

// ─── Friends ────────────────────────────────────────────────────────────────
export const SUGGESTED_FRIENDS: SuggestedFriend[] = [
  { id: 'sf-1', displayName: 'Maya Bennett', username: 'mayab', avatarUrl: null, mutualFriends: 4 },
  { id: 'sf-2', displayName: 'Andre Coleman', username: 'andrec', avatarUrl: null, mutualFriends: 2 },
  { id: 'sf-3', displayName: 'Grace Okafor', username: 'graceo', avatarUrl: null, mutualFriends: 7 },
  { id: 'sf-4', displayName: 'Daniel Reyes', username: 'dreyes', avatarUrl: null, mutualFriends: 1 },
];

// ─── Bible-in-a-year plan ───────────────────────────────────────────────────
const OT_BOOKS = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', '1 Samuel', '2 Samuel', '1 Kings'];
const NT_BOOKS = ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians'];

/** A representative slice of a 365-day plan. In production this is seeded in the DB. */
export function makeBibleYear(): BibleReadingDay[] {
  return Array.from({ length: 365 }, (_, i) => {
    const day = i + 1;
    const otBook = OT_BOOKS[i % OT_BOOKS.length];
    const ntBook = NT_BOOKS[i % NT_BOOKS.length];
    const otCh = (i % 3) * 2 + 1;
    const ntCh = (i % 4) + 1;
    const psalm = day;
    return {
      id: `bry-${day}`,
      dayNumber: day,
      oldTestament: { reference: `${otBook} ${otCh}–${otCh + 1}`, book: otBook, startChapter: otCh, endChapter: otCh + 1 },
      newTestament: { reference: `${ntBook} ${ntCh}`, book: ntBook, startChapter: ntCh, endChapter: ntCh },
      psalmOrProverb:
        day % 2 === 0
          ? { reference: `Psalm ${(psalm % 150) + 1}`, book: 'Psalms', startChapter: (psalm % 150) + 1, endChapter: (psalm % 150) + 1 }
          : { reference: `Proverbs ${(day % 31) + 1}`, book: 'Proverbs', startChapter: (day % 31) + 1, endChapter: (day % 31) + 1 },
    };
  });
}

export const TRANSLATIONS = ['NIV', 'ESV', 'KJV', 'NLT', 'CSB', 'NKJV'] as const;

// ─── You-screen content ─────────────────────────────────────────────────────
export const ACTIVITY: ActivityItem[] = [
  { id: 'act-1', kind: 'badge', title: 'Earned “7-Day Streak”', subtitle: 'Keep the fire going!', createdAt: '2026-06-06T08:00:00Z' },
  { id: 'act-2', kind: 'highlight', title: 'Highlighted a verse', subtitle: 'Peace I leave with you…', reference: 'John 14:27', createdAt: '2026-06-05T19:20:00Z' },
  { id: 'act-3', kind: 'note', title: 'Added a note', subtitle: 'A reminder to pause before reacting.', reference: 'James 1:19', createdAt: '2026-06-04T07:45:00Z' },
  { id: 'act-4', kind: 'plan', title: 'Started “Pathways to Peace”', subtitle: '7-day plan', createdAt: '2026-06-03T08:10:00Z' },
];

export const HIGHLIGHTS: Highlight[] = [
  { id: 'hl-1', userId: 'me', reference: 'John 14:27', snippet: 'Peace I leave with you; my peace I give you.', color: 'pine', createdAt: '2026-06-05T19:20:00Z' },
  { id: 'hl-2', userId: 'me', reference: 'Isaiah 41:10', snippet: 'So do not fear, for I am with you.', color: 'brass', createdAt: '2026-06-01T09:00:00Z' },
];

export const NOTES: Note[] = [
  { id: 'nt-1', userId: 'me', reference: 'James 1:19', text: 'Practice the pause before reacting this week.', createdAt: '2026-06-04T07:45:00Z' },
];

export const PRAYERS: Prayer[] = [
  { id: 'pr-1', userId: 'me', title: 'Peace for my family', body: 'For calm and unity at home.', answered: false, createdAt: '2026-06-02T20:00:00Z' },
  { id: 'pr-2', userId: 'me', title: 'Wisdom at work', body: 'For a hard decision this week.', answered: true, createdAt: '2026-05-28T20:00:00Z' },
];

export const SAVED: SavedItem[] = [
  { id: 'sv-1', userId: 'me', kind: 'devotional', refId: 'dev-anchor-hope', title: 'An Anchor for the Soul', savedAt: '2026-06-05T10:00:00Z' },
  { id: 'sv-2', userId: 'me', kind: 'plan', refId: 'plan-pathways-peace', title: 'Pathways to Peace', savedAt: '2026-06-03T08:12:00Z' },
];

export const CATEGORY_LABEL: Record<DevotionalCategoryKey, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<DevotionalCategoryKey, string>;
