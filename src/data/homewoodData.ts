/**
 * Homewood Living App — mock content for the ministry sections. Original copy
 * written for Homewood Living Ministries. Everything runs with no API keys.
 *
 * TODO(api): replace these arrays with a content service / CMS. Types in
 *   src/types/homewood.ts are shaped for a clean swap.
 */
import {
  AcademyModule,
  CommentarySource,
  CuratedMinistry,
  MediaItem,
  MinistryEvent,
  PhotoAlbum,
  ResourceCategory,
  ResourceItem,
  StudyPassage,
} from '../types/homewood';

export const CAMPUSES = [
  'Homewood at Frederick',
  'Homewood at Plum Creek',
  'Homewood at Williamsport',
  'Homewood at Martinsburg',
  'Community (Off-Campus)',
];

export const ROLE_LABEL: Record<string, string> = {
  resident: 'Resident',
  employee: 'Employee',
  community: 'Community Member',
};

export const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  growing: 'Growing',
  mature: 'Mature',
};

// ─── Media ──────────────────────────────────────────────────────────────────
export const MEDIA_ITEMS: MediaItem[] = [
  { id: 'md-1', title: 'Living Water: A Study of John 4', speaker: 'Pastor James Whitfield', category: 'teaching', durationMinutes: 38, image: 'scripture', description: 'A verse-by-verse walk through Jesus and the woman at the well, and what it means to worship in spirit and truth.', publishedAt: '2026-06-07T10:00:00Z' },
  { id: 'md-2', title: 'Sunday Chapel Service', speaker: 'Homewood Chaplaincy', category: 'sermon', durationMinutes: 52, image: 'chapel', description: 'This week’s chapel message on the faithfulness of God through every season of life.', publishedAt: '2026-06-08T14:00:00Z' },
  { id: 'md-3', title: 'Live Wednesday Bible Study', speaker: 'Chaplain Ruth Alvarez', category: 'live', durationMinutes: 60, image: 'community', description: 'Join us live as we study the book of Philippians together, with time for questions and prayer.', publishedAt: '2026-06-11T18:00:00Z', isLive: true },
  { id: 'md-4', title: 'Hymns of Hope: An Evening of Worship', speaker: 'Homewood Choir', category: 'entertainment', durationMinutes: 45, image: 'worship', description: 'Beloved hymns and songs of hope, recorded live in the Homewood chapel.', publishedAt: '2026-06-05T19:00:00Z' },
  { id: 'md-5', title: 'The Shepherd’s Heart: Psalm 23', speaker: 'Pastor James Whitfield', category: 'teaching', durationMinutes: 29, image: 'nature', description: 'Finding rest and provision in the care of the Good Shepherd.', publishedAt: '2026-06-02T10:00:00Z' },
  { id: 'md-6', title: 'Faithful to the End: Honoring a Life Well Lived', speaker: 'Chaplain Ruth Alvarez', category: 'sermon', durationMinutes: 41, image: 'hope', description: 'A tender message on legacy, hope, and the promise of resurrection.', publishedAt: '2026-05-31T14:00:00Z' },
];

// ─── Events ─────────────────────────────────────────────────────────────────
export const MINISTRY_EVENTS: MinistryEvent[] = [
  { id: 'ev-1', title: 'Wednesday Evening Bible Study', date: '2026-06-11T18:00:00', location: 'Chapel Fellowship Hall', campus: 'Homewood at Frederick', image: 'community', description: 'A warm, guided study through Philippians with coffee and fellowship afterward. All are welcome.', category: 'Bible Study' },
  { id: 'ev-2', title: 'Sunday Chapel Worship', date: '2026-06-14T10:30:00', location: 'Homewood Chapel', campus: 'Homewood at Frederick', image: 'chapel', description: 'Gather for hymns, Scripture, and a message of hope. Communion served the first Sunday of each month.', category: 'Worship' },
  { id: 'ev-3', title: 'Prayer & Praise Breakfast', date: '2026-06-18T08:30:00', location: 'Garden Room', campus: 'Homewood at Plum Creek', image: 'prayer', description: 'Start your morning with prayer, testimony, and a shared breakfast among friends.', category: 'Fellowship' },
  { id: 'ev-4', title: 'Caregiver Support & Devotion', date: '2026-06-20T15:00:00', location: 'Wellness Center', campus: 'Homewood at Williamsport', image: 'support', description: 'Encouragement and Scripture for those caring for loved ones. Facilitated by Homewood chaplaincy.', category: 'Support', roles: ['employee', 'community'] },
  { id: 'ev-5', title: 'Summer Hymn Sing', date: '2026-06-27T18:30:00', location: 'Courtyard Lawn', campus: 'Homewood at Martinsburg', image: 'worship', description: 'An outdoor evening of favorite hymns and fellowship. Bring a friend and a lawn chair.', category: 'Worship' },
];

// ─── Photos ─────────────────────────────────────────────────────────────────
export const PHOTO_ALBUMS: PhotoAlbum[] = [
  { id: 'al-1', title: 'Sunday Worship', subtitle: 'Chapel gatherings', cover: 'chapel', date: '2026-06-08T00:00:00Z', photos: ['chapel', 'worship', 'prayer', 'sanctuary', 'community', 'gathering'] },
  { id: 'al-2', title: 'Community Life', subtitle: 'Fellowship & friendship', cover: 'community', date: '2026-06-01T00:00:00Z', photos: ['community', 'portrait', 'support', 'children', 'gathering', 'peaceful'] },
  { id: 'al-3', title: 'Bible Study Groups', subtitle: 'Growing in the Word together', cover: 'scripture', date: '2026-05-25T00:00:00Z', photos: ['scripture', 'community', 'support', 'peaceful'] },
  { id: 'al-4', title: 'Grounds & Gardens', subtitle: 'Peaceful places to reflect', cover: 'nature', date: '2026-05-18T00:00:00Z', photos: ['nature', 'peaceful', 'sanctuary', 'hope'] },
];

// ─── Resources ──────────────────────────────────────────────────────────────
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { key: 'bible-studies', title: 'Bible Studies', description: 'Guided studies to go deeper in Scripture.', image: 'scripture', itemCount: 12 },
  { key: 'parenting', title: 'Parenting & Family', description: 'Grace-filled wisdom for families and grandparents.', image: 'children', itemCount: 8 },
  { key: 'discipleship', title: 'Discipleship', description: 'Growing as a follower of Jesus, one step at a time.', image: 'support', itemCount: 10 },
  { key: 'financial', title: 'Financial Literacy', description: 'Faithful stewardship and practical financial wisdom.', image: 'peaceful', itemCount: 6 },
  { key: 'bible-academy', title: 'Bible Academy', description: 'Learn to read and study the Bible with confidence.', image: 'chapel', itemCount: 4 },
];

export const RESOURCE_ITEMS: ResourceItem[] = [
  { id: 'rs-1', categoryKey: 'bible-studies', title: 'The Gospel of John: Believe', author: 'Homewood Chaplaincy', format: 'course', minutes: 240, image: 'scripture', description: 'An eight-session journey through John’s Gospel.' },
  { id: 'rs-2', categoryKey: 'bible-studies', title: 'Psalms for Every Season', author: 'Pastor James Whitfield', format: 'guide', minutes: 90, image: 'nature', description: 'Praying the Psalms through joy and sorrow.' },
  { id: 'rs-3', categoryKey: 'parenting', title: 'Grandparenting with Grace', author: 'Ruth Alvarez', format: 'article', minutes: 12, image: 'children', description: 'Passing on faith to the next generation.' },
  { id: 'rs-4', categoryKey: 'discipleship', title: 'First Steps of Faith', author: 'Homewood Chaplaincy', format: 'course', minutes: 120, image: 'support', description: 'A gentle introduction to walking with Christ.' },
  { id: 'rs-5', categoryKey: 'financial', title: 'Stewardship & Contentment', author: 'Guest Teacher', format: 'video', minutes: 35, image: 'peaceful', description: 'Biblical principles for a peaceful relationship with money.' },
];

// Bible Academy modules (future-ready placeholders).
export const ACADEMY_MODULES: AcademyModule[] = [
  { id: 'ac-101', code: '101', title: 'How to Read the Bible', summary: 'Genres, context, and reading Scripture as one grand story.', lessons: 6, image: 'scripture', status: 'available' },
  { id: 'ac-102', code: '102', title: 'How the English Bible Came to Be', summary: 'Manuscripts, translation, and the story behind your Bible.', lessons: 5, image: 'chapel', status: 'coming-soon' },
  { id: 'ac-103', code: '103', title: 'Hermeneutics & Interpretation', summary: 'Faithful principles for understanding and applying the text.', lessons: 7, image: 'peaceful', status: 'coming-soon' },
  { id: 'ac-104', code: '104', title: 'Studying with Cross References', summary: 'Letting Scripture interpret Scripture using cross references.', lessons: 5, image: 'support', status: 'coming-soon' },
];

// ─── Curated ministries (trusted partners) ──────────────────────────────────
export const CURATED_MINISTRIES: CuratedMinistry[] = [
  { id: 'cm-1', name: 'Family Radio', tagline: 'Christian radio & teaching', url: 'https://www.familyradio.com' },
  { id: 'cm-2', name: 'Truth For Life', tagline: 'Alistair Begg — teaching the Word', url: 'https://www.truthforlife.org' },
  { id: 'cm-3', name: 'Ligonier Ministries', tagline: 'Trusted discipleship resources', url: 'https://www.ligonier.org' },
  { id: 'cm-4', name: 'Desiring God', tagline: 'John Piper — God-centered resources', url: 'https://www.desiringgod.org' },
  { id: 'cm-5', name: 'BibleProject', tagline: 'Animated Bible explainer videos', url: 'https://bibleproject.com' },
  { id: 'cm-6', name: 'Grace to You', tagline: 'John MacArthur — verse-by-verse teaching', url: 'https://www.gty.org' },
  { id: 'cm-7', name: 'The Gospel Coalition', tagline: 'Gospel-centered articles & media', url: 'https://www.thegospelcoalition.org' },
  { id: 'cm-8', name: 'GotQuestions', tagline: 'Biblical answers to your questions', url: 'https://www.gotquestions.org' },
];

// ─── Study Bible ────────────────────────────────────────────────────────────
export const COMMENTARY_SOURCES: CommentarySource[] = [
  { id: 'henry', name: 'Matthew Henry', era: '1706', available: true },
  { id: 'clarke', name: 'Adam Clarke', era: '1831', available: false },
  { id: 'barnes', name: 'Barnes’ Notes', era: '1834', available: false },
  { id: 'gill', name: 'John Gill', era: '1748', available: false },
  { id: 'jfb', name: 'Jamieson-Fausset-Brown', era: '1871', available: false },
  { id: 'tsk', name: 'Treasury of Scripture Knowledge', era: '1836', available: true },
  { id: 'pulpit', name: 'Pulpit Commentary', era: '1890', available: false },
  { id: 'keil', name: 'Keil & Delitzsch', era: '1866', available: false },
  { id: 'wesley', name: 'John Wesley', era: '1765', available: false },
  { id: 'vincent', name: 'Vincent’s Word Studies', era: '1887', available: false },
];

/** A worked example passage. In production this is generated per reference. */
export const STUDY_PASSAGE_SAMPLE: StudyPassage = {
  reference: 'Philippians 4:6–7',
  background: 'Paul writes to the church at Philippi from prison, yet his letter overflows with joy. These verses come near the close, as he urges a worried community to bring everything to God in prayer.',
  keyThemes: ['Prayer over anxiety', 'The peace of God', 'Thanksgiving', 'God’s nearness'],
  howToStudy: [
    'Observe: What is Paul telling the Philippians to do — and not do? Note the words “anything,” “everything,” and “all.”',
    'Interpret: Why is thanksgiving paired with petition? What does “the peace of God” guard, and how?',
    'Apply: What specific worry can you turn into a thankful prayer today?',
  ],
  crossReferences: [
    { ref: '1 Peter 5:7', note: 'Casting all your care upon him, for he cares for you.' },
    { ref: 'Matthew 6:25–34', note: 'Do not be anxious about your life.' },
    { ref: 'John 14:27', note: 'Peace I leave with you; my peace I give unto you.' },
    { ref: 'Isaiah 26:3', note: 'Perfect peace for the mind stayed on God.' },
  ],
  footnotes: [
    { marker: 'a', text: '“Careful” (KJV) renders a Greek word meaning anxious or worried — the same used in Matthew 6.' },
    { marker: 'b', text: '“Passeth all understanding” — a peace that exceeds human reasoning or explanation.' },
  ],
  reflectionQuestions: [
    'Where are you most tempted to be anxious right now?',
    'What would it look like to pray “with thanksgiving” in that area?',
    'How have you experienced God’s peace guarding your heart before?',
  ],
  commentaryPreview: [
    { source: 'Matthew Henry', text: 'The way to get and keep peace is by prayer. We must not only ask, but ask with thanksgiving, remembering past mercies as we seek new ones.' },
    { source: 'Treasury of Scripture Knowledge', text: 'See parallels in 1 Peter 5:7; Matthew 6:25; John 14:27 — Scripture consistently answers anxiety with trustful prayer.' },
  ],
};
