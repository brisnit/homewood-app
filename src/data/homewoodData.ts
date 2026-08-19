/**
 * Homewood Living App — mock content for the ministry sections. Original copy
 * written for Homewood Living Ministries. Everything runs with no API keys.
 *
 * TODO(api): replace these arrays with a content service / CMS. Types in
 *   src/types/homewood.ts are shaped for a clean swap.
 */
import {
  AcademyModule,
  BibleStudy,
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
  { id: 'ev-1', title: 'Wednesday Evening Bible Study', date: '2026-06-11T18:00:00', location: 'Chapel Fellowship Hall', campus: 'Homewood at Frederick', image: 'community', description: 'A warm, guided study through Philippians with coffee and fellowship afterward. All are welcome.', category: 'Bible Study', registrationMethod: 'rsvp', capacity: 60, resources: [
    { id: 'ev1-r1', title: 'Philippians Study Guide (6 weeks)', kind: 'curriculum', description: 'Bring it along or read it on your phone.', minutes: 20 },
    { id: 'ev1-r2', title: 'Session 3 Handout: The Humility Hymn', kind: 'handout', description: 'Philippians 2:6–11 laid out with room to mark up.' },
  ] },
  { id: 'ev-2', title: 'Sunday Chapel Worship', date: '2026-06-14T10:30:00', location: 'Homewood Chapel', campus: 'Homewood at Frederick', image: 'chapel', description: 'Gather for hymns, Scripture, and a message of hope. Communion served the first Sunday of each month.', category: 'Worship' },
  { id: 'ev-3', title: 'Prayer & Praise Breakfast', date: '2026-06-18T08:30:00', location: 'Garden Room', campus: 'Homewood at Plum Creek', image: 'prayer', description: 'Start your morning with prayer, testimony, and a shared breakfast among friends.', category: 'Fellowship' },
  { id: 'ev-4', title: 'Caregiver Support & Devotion', date: '2026-06-20T15:00:00', location: 'Wellness Center', campus: 'Homewood at Williamsport', image: 'support', description: 'Encouragement and Scripture for those caring for loved ones. Facilitated by Homewood chaplaincy.', category: 'Support', roles: ['employee', 'community'], resources: [
    { id: 'ev4-r1', title: 'Caregiver’s Companion (4 weeks)', kind: 'curriculum', description: 'Short readings and questions, designed for tired people.', minutes: 15 },
    { id: 'ev4-r2', title: 'Local Respite & Support Services', kind: 'link', description: 'Practical help available near each campus.', url: 'https://www.homewood.com/resources' },
  ] },
  { id: 'ev-5', title: 'Summer Hymn Sing', date: '2026-06-27T18:30:00', location: 'Courtyard Lawn', campus: 'Homewood at Martinsburg', image: 'worship', description: 'An outdoor evening of favorite hymns and fellowship. Bring a friend and a lawn chair.', category: 'Worship', registrationMethod: 'external', externalRegistrationUrl: 'https://www.eventbrite.com/e/summer-hymn-sing-tickets', externalRegistrationLabel: 'Register on Eventbrite' },
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

// ─── Bible studies ──────────────────────────────────────────────────────────
// Groups that meet over a run of weeks, each with a curriculum and attached
// resources. Open studies can be joined; completed ones stay readable so people
// can catch up on what they missed.
//
// TODO(admin): source from the admin portal's Bible Studies section, which is
//   where leaders attach curriculum + resources today.
export const BIBLE_STUDIES: BibleStudy[] = [
  {
    id: 'bs-philippians',
    title: 'Philippians: Joy in Every Circumstance',
    leader: 'Chaplain Ruth Alvarez',
    description:
      'Paul wrote this letter from prison, and it overflows with joy anyway. Over six weeks we walk through all four chapters, asking what a joy that does not depend on circumstances looks like in an ordinary week.',
    image: 'scripture',
    campus: 'Homewood at Frederick',
    location: 'Chapel Fellowship Hall',
    format: 'hybrid',
    status: 'in-progress',
    schedule: 'Wednesdays · 6:00 PM',
    startDate: '2026-05-27T18:00:00',
    endDate: '2026-07-01T19:30:00',
    sessionCount: 6,
    memberCount: 24,
    capacity: 40,
    topics: ['New Testament', 'Joy', 'Epistles'],
    scriptureFocus: 'Philippians 1–4',
    sessions: [
      { id: 'bs-phil-s1', sessionNumber: 1, title: 'Partnership in the Gospel', scriptureRef: 'Philippians 1:1–11', summary: 'Paul’s thanksgiving and confident hope for a church he loves.', date: '2026-05-27T18:00:00' },
      { id: 'bs-phil-s2', sessionNumber: 2, title: 'To Live Is Christ', scriptureRef: 'Philippians 1:12–30', summary: 'Finding purpose when circumstances close in.', date: '2026-06-03T18:00:00' },
      { id: 'bs-phil-s3', sessionNumber: 3, title: 'The Mind of Christ', scriptureRef: 'Philippians 2:1–18', summary: 'The humility hymn, and what it asks of a community.', date: '2026-06-10T18:00:00' },
      { id: 'bs-phil-s4', sessionNumber: 4, title: 'Everything Else Is Loss', scriptureRef: 'Philippians 3:1–14', summary: 'Paul’s accounting: what he gave up, and what he gained.', date: '2026-06-17T18:00:00' },
      { id: 'bs-phil-s5', sessionNumber: 5, title: 'Anxious for Nothing', scriptureRef: 'Philippians 4:1–9', summary: 'Prayer, thanksgiving, and the peace that guards the heart.', date: '2026-06-24T18:00:00' },
      { id: 'bs-phil-s6', sessionNumber: 6, title: 'Contentment Learned', scriptureRef: 'Philippians 4:10–23', summary: 'Contentment as something learned, not felt.', date: '2026-07-01T18:00:00' },
    ],
    resources: [
      { id: 'bs-phil-r1', title: 'Philippians Study Guide (6 weeks)', kind: 'curriculum', description: 'Week-by-week questions and notes pages. Print or read on your phone.', minutes: 20 },
      { id: 'bs-phil-r2', title: 'Session 3 Handout: The Humility Hymn', kind: 'handout', description: 'The text of Philippians 2:6–11 laid out as a poem, with room to mark it up.' },
      { id: 'bs-phil-r3', title: 'Background: Paul’s Imprisonment', kind: 'reading', description: 'A short piece on where Paul was, and why it matters to the letter.', minutes: 12 },
      { id: 'bs-phil-r4', title: 'When Anxiety Comes: Finding Peace in Prayer', kind: 'reading', resourceId: 'rs-2', description: 'Companion reading for Session 5.', minutes: 15 },
    ],
  },
  {
    id: 'bs-psalms-summer',
    title: 'Psalms for Every Season',
    leader: 'Pastor James Whitfield',
    description:
      'The Psalms give us words when we have none of our own — for joy, for grief, for anger, for waiting. Eight weeks of praying the Psalms together, one type at a time.',
    image: 'nature',
    campus: 'Homewood at Plum Creek',
    location: 'Garden Room',
    format: 'in-person',
    status: 'open',
    schedule: 'Tuesdays · 10:00 AM',
    startDate: '2026-06-23T10:00:00',
    endDate: '2026-08-11T11:30:00',
    sessionCount: 8,
    memberCount: 11,
    capacity: 25,
    topics: ['Old Testament', 'Prayer', 'Psalms'],
    scriptureFocus: 'Selected Psalms',
    sessions: [
      { id: 'bs-ps-s1', sessionNumber: 1, title: 'Psalms of Praise', scriptureRef: 'Psalm 100; 103', summary: 'Beginning where the Psalter ends up — with praise.', date: '2026-06-23T10:00:00' },
      { id: 'bs-ps-s2', sessionNumber: 2, title: 'Psalms of Lament', scriptureRef: 'Psalm 13; 42', summary: 'Permission to say the hard thing out loud to God.', date: '2026-06-30T10:00:00' },
      { id: 'bs-ps-s3', sessionNumber: 3, title: 'Psalms of Trust', scriptureRef: 'Psalm 23; 121', summary: 'The shepherd and the keeper who does not sleep.', date: '2026-07-07T10:00:00' },
      { id: 'bs-ps-s4', sessionNumber: 4, title: 'Psalms of Confession', scriptureRef: 'Psalm 32; 51', summary: 'Honest words for what we would rather not name.', date: '2026-07-14T10:00:00' },
      { id: 'bs-ps-s5', sessionNumber: 5, title: 'Psalms of Waiting', scriptureRef: 'Psalm 27; 130', summary: 'What to do with the time between the prayer and the answer.', date: '2026-07-21T10:00:00' },
      { id: 'bs-ps-s6', sessionNumber: 6, title: 'Psalms of Remembrance', scriptureRef: 'Psalm 77; 78', summary: 'Rehearsing what God has already done.', date: '2026-07-28T10:00:00' },
      { id: 'bs-ps-s7', sessionNumber: 7, title: 'Psalms of Refuge', scriptureRef: 'Psalm 46; 91', summary: 'God as a place to go, not just a truth to hold.', date: '2026-08-04T10:00:00' },
      { id: 'bs-ps-s8', sessionNumber: 8, title: 'Psalms of Ascent', scriptureRef: 'Psalm 120–134 (selections)', summary: 'Songs for the road home.', date: '2026-08-11T10:00:00' },
    ],
    resources: [
      { id: 'bs-ps-r1', title: 'Psalms for Every Season — Study Guide', kind: 'curriculum', resourceId: 'rs-2', description: 'The eight-week guide, one type of psalm per week.', minutes: 25 },
      { id: 'bs-ps-r2', title: 'How to Pray a Psalm', kind: 'handout', description: 'A one-page method you can use with any psalm, on your own.' },
    ],
  },
  {
    id: 'bs-john-gospel',
    title: 'The Gospel of John: Believe',
    leader: 'Homewood Chaplaincy',
    description:
      'John wrote his Gospel with a stated purpose: that you may believe. Eight sessions through the signs, the discourses, and the seven “I am” sayings.',
    image: 'chapel',
    campus: 'Homewood at Frederick',
    location: 'Online (Zoom)',
    format: 'online',
    status: 'open',
    schedule: 'Thursdays · 7:00 PM',
    startDate: '2026-07-09T19:00:00',
    endDate: '2026-08-27T20:15:00',
    sessionCount: 8,
    memberCount: 6,
    capacity: 30,
    topics: ['New Testament', 'Gospels', 'Discipleship'],
    scriptureFocus: 'John 1–21',
    sessions: [
      { id: 'bs-jn-s1', sessionNumber: 1, title: 'The Word Made Flesh', scriptureRef: 'John 1:1–18', summary: 'Where John starts, and why it isn’t Bethlehem.', date: '2026-07-09T19:00:00' },
      { id: 'bs-jn-s2', sessionNumber: 2, title: 'The First Signs', scriptureRef: 'John 2:1–25', summary: 'Water into wine, and what a sign is for.', date: '2026-07-16T19:00:00' },
      { id: 'bs-jn-s3', sessionNumber: 3, title: 'Born Again', scriptureRef: 'John 3:1–21', summary: 'Nicodemus comes at night with a question.', date: '2026-07-23T19:00:00' },
      { id: 'bs-jn-s4', sessionNumber: 4, title: 'Living Water', scriptureRef: 'John 4:1–42', summary: 'The woman at the well, and worship in spirit and truth.', date: '2026-07-30T19:00:00' },
      { id: 'bs-jn-s5', sessionNumber: 5, title: 'I Am the Bread of Life', scriptureRef: 'John 6:25–59', summary: 'A hard saying, and the crowd that left over it.', date: '2026-08-06T19:00:00' },
      { id: 'bs-jn-s6', sessionNumber: 6, title: 'The Good Shepherd', scriptureRef: 'John 10:1–30', summary: 'Knowing the voice, and being known by name.', date: '2026-08-13T19:00:00' },
      { id: 'bs-jn-s7', sessionNumber: 7, title: 'The Vine', scriptureRef: 'John 15:1–17', summary: 'Abiding as the source of everything that grows.', date: '2026-08-20T19:00:00' },
      { id: 'bs-jn-s8', sessionNumber: 8, title: 'That You May Believe', scriptureRef: 'John 20:1–31', summary: 'The empty tomb, Thomas, and John’s stated purpose.', date: '2026-08-27T19:00:00' },
    ],
    resources: [
      { id: 'bs-jn-r1', title: 'The Gospel of John: Believe — Course', kind: 'curriculum', resourceId: 'rs-1', description: 'The eight-session course this study follows.', minutes: 240 },
      { id: 'bs-jn-r2', title: 'Living Water: A Study of John 4', kind: 'video', description: 'Pastor James’ teaching on Session 4’s passage.', minutes: 38 },
      { id: 'bs-jn-r3', title: 'The Seven “I Am” Sayings', kind: 'handout', description: 'All seven in one place, with their contexts.' },
    ],
  },
  {
    id: 'bs-caregivers',
    title: 'Strength for Caregivers',
    leader: 'Chaplain Ruth Alvarez',
    description:
      'A four-week study for those caring for a spouse, parent, or friend. Scripture, practical encouragement, and space to say how it really is.',
    image: 'support',
    campus: 'Homewood at Williamsport',
    location: 'Wellness Center',
    format: 'in-person',
    status: 'open',
    schedule: 'Saturdays · 3:00 PM',
    startDate: '2026-06-20T15:00:00',
    endDate: '2026-07-11T16:15:00',
    sessionCount: 4,
    memberCount: 9,
    capacity: 12,
    topics: ['Care', 'Encouragement', 'Community Life'],
    scriptureFocus: 'Selected passages',
    roles: ['employee', 'community', 'resident'],
    sessions: [
      { id: 'bs-cg-s1', sessionNumber: 1, title: 'Come to Me, All Who Are Weary', scriptureRef: 'Matthew 11:28–30', summary: 'The easy yoke, for people whose load is not.', date: '2026-06-20T15:00:00' },
      { id: 'bs-cg-s2', sessionNumber: 2, title: 'Elijah Under the Broom Tree', scriptureRef: '1 Kings 19:1–18', summary: 'What God did first for a prophet who wanted to die: fed him and let him sleep.', date: '2026-06-27T15:00:00' },
      { id: 'bs-cg-s3', sessionNumber: 3, title: 'Bear One Another’s Burdens', scriptureRef: 'Galatians 6:1–10', summary: 'Why asking for help is part of the instruction.', date: '2026-07-04T15:00:00' },
      { id: 'bs-cg-s4', sessionNumber: 4, title: 'Mercies New Every Morning', scriptureRef: 'Lamentations 3:19–33', summary: 'Enough for today, and again tomorrow.', date: '2026-07-11T15:00:00' },
    ],
    resources: [
      { id: 'bs-cg-r1', title: 'Caregiver’s Companion (4 weeks)', kind: 'curriculum', description: 'Short readings and questions, designed for tired people.', minutes: 15 },
      { id: 'bs-cg-r2', title: 'A Guide to Grieving Well', kind: 'reading', description: 'For those caring through a long decline.', minutes: 18 },
      { id: 'bs-cg-r3', title: 'Local Respite & Support Services', kind: 'link', description: 'Practical help available near each campus.', url: 'https://www.homewood.com/resources' },
    ],
  },
  {
    id: 'bs-romans-spring',
    title: 'Romans: The Gospel Explained',
    leader: 'Pastor James Whitfield',
    description:
      'Ten weeks through Paul’s fullest statement of the gospel — from humanity’s need, through justification by faith, to life in the Spirit.',
    image: 'sanctuary',
    campus: 'Homewood at Frederick',
    location: 'Chapel Fellowship Hall',
    format: 'in-person',
    status: 'completed',
    schedule: 'Wednesdays · 6:00 PM',
    startDate: '2026-02-04T18:00:00',
    endDate: '2026-04-08T19:30:00',
    completedAt: '2026-04-08T19:30:00',
    sessionCount: 10,
    memberCount: 31,
    capacity: 40,
    topics: ['New Testament', 'Doctrine', 'Epistles'],
    scriptureFocus: 'Romans 1–16',
    archiveUrl: 'https://homewoodliving.org/studies/romans',
    sessions: [
      { id: 'bs-rm-s1', sessionNumber: 1, title: 'Not Ashamed of the Gospel', scriptureRef: 'Romans 1:1–17', summary: 'Paul’s thesis statement for the whole letter.' },
      { id: 'bs-rm-s2', sessionNumber: 2, title: 'All Have Sinned', scriptureRef: 'Romans 3:9–26', summary: 'The diagnosis, and the turn at “but now”.' },
      { id: 'bs-rm-s3', sessionNumber: 3, title: 'Justified by Faith', scriptureRef: 'Romans 5:1–11', summary: 'Peace with God, and what suffering produces.' },
      { id: 'bs-rm-s4', sessionNumber: 4, title: 'Dead to Sin', scriptureRef: 'Romans 6:1–14', summary: 'Baptism as a death and a raising.' },
      { id: 'bs-rm-s5', sessionNumber: 5, title: 'The War Within', scriptureRef: 'Romans 7:14–25', summary: 'Paul’s honesty about doing what he hates.' },
      { id: 'bs-rm-s6', sessionNumber: 6, title: 'No Condemnation', scriptureRef: 'Romans 8:1–17', summary: 'Life in the Spirit, and adoption as sons.' },
      { id: 'bs-rm-s7', sessionNumber: 7, title: 'Nothing Can Separate Us', scriptureRef: 'Romans 8:28–39', summary: 'The letter’s summit.' },
      { id: 'bs-rm-s8', sessionNumber: 8, title: 'God’s Mercy to All', scriptureRef: 'Romans 11:25–36', summary: 'Where Paul’s argument breaks into doxology.' },
      { id: 'bs-rm-s9', sessionNumber: 9, title: 'Living Sacrifices', scriptureRef: 'Romans 12:1–21', summary: 'The “therefore” that turns doctrine into a life.' },
      { id: 'bs-rm-s10', sessionNumber: 10, title: 'Welcome One Another', scriptureRef: 'Romans 14:1–15:7', summary: 'Disagreeing without dividing.' },
    ],
    resources: [
      { id: 'bs-rm-r1', title: 'Romans Study Guide (10 weeks)', kind: 'curriculum', description: 'The full guide, still available to work through on your own.', minutes: 30 },
      { id: 'bs-rm-r2', title: 'Session Recordings', kind: 'video', description: 'All ten sessions, recorded in the chapel.', url: 'https://homewoodliving.org/studies/romans' },
    ],
  },
  {
    id: 'bs-first-steps',
    title: 'First Steps of Faith',
    leader: 'Homewood Chaplaincy',
    description:
      'A gentle five-week introduction for new believers and anyone starting over. No background assumed, no question too basic.',
    image: 'hope',
    campus: 'Homewood at Martinsburg',
    location: 'Community Room',
    format: 'in-person',
    status: 'completed',
    schedule: 'Sundays · 12:30 PM',
    startDate: '2026-03-08T12:30:00',
    endDate: '2026-04-05T13:30:00',
    completedAt: '2026-04-05T13:30:00',
    sessionCount: 5,
    memberCount: 14,
    capacity: 20,
    topics: ['Discipleship', 'New Believers'],
    scriptureFocus: 'Selected passages',
    sessions: [
      { id: 'bs-fs-s1', sessionNumber: 1, title: 'Who Is Jesus?', scriptureRef: 'John 1:1–18', summary: 'Starting with the person at the center.' },
      { id: 'bs-fs-s2', sessionNumber: 2, title: 'What Is the Gospel?', scriptureRef: '1 Corinthians 15:1–8', summary: 'The good news in its earliest form.' },
      { id: 'bs-fs-s3', sessionNumber: 3, title: 'How Do I Pray?', scriptureRef: 'Matthew 6:5–15', summary: 'Jesus’ own answer to the same question.' },
      { id: 'bs-fs-s4', sessionNumber: 4, title: 'How Do I Read the Bible?', scriptureRef: '2 Timothy 3:14–17', summary: 'Where to start, and what to expect.' },
      { id: 'bs-fs-s5', sessionNumber: 5, title: 'Why the Church?', scriptureRef: 'Acts 2:42–47', summary: 'Faith was never meant to be carried alone.' },
    ],
    resources: [
      { id: 'bs-fs-r1', title: 'First Steps of Faith — Course', kind: 'curriculum', resourceId: 'rs-4', description: 'The full five-session course.', minutes: 120 },
      { id: 'bs-fs-r2', title: 'Starting Your Walk with Christ', kind: 'reading', description: 'A short guide to the first ninety days.', minutes: 10 },
    ],
  },
];
