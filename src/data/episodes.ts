/**
 * The Robert J. Morgan Podcast — episodes surfaced in Media and Resources.
 * Hosted externally on Captivate; the app links out to the player. Homewood
 * does not own or deliver this podcast.
 *
 * Titles/scripture verified against the live Captivate episode pages.
 *
 * TODO(admin): move to the admin-managed content system so episodes can be
 *   added without a code change (mirrors the admin Media library).
 * TODO(api): Captivate exposes an RSS feed — pull episodes automatically later.
 */
import { ImageKey } from '../lib/images';

export interface Episode {
  id: string;
  episode: number;
  title: string;
  provider: string;
  scripture: string;
  description: string;
  category: string;
  url: string;
  image: ImageKey;
  featured?: boolean;
  external: true;
}

export const PODCAST_NAME = 'The Robert J. Morgan Podcast';

export const RJM_EPISODES: Episode[] = [
  {
    id: 'rjm-329',
    episode: 329,
    title: 'What To Do When You Feel Down',
    provider: 'Robert J. Morgan',
    scripture: 'Psalm 27:7–14',
    description: 'Honest help from Psalm 27 for the days when your heart is heavy and hope feels far off.',
    category: 'Encouragement',
    url: 'https://player.captivate.fm/episode/decc2726-3327-47cc-b9c8-7d5ee2ca6a46',
    image: 'hope',
    featured: true,
    external: true,
  },
  {
    id: 'rjm-328',
    episode: 328,
    title: 'What To Do When You Feel Up',
    provider: 'Robert J. Morgan',
    scripture: 'Psalm 27:1–6',
    description: 'Confidence and courage from the opening verses of Psalm 27 — the Lord is my light and my salvation.',
    category: 'Encouragement',
    url: 'https://player.captivate.fm/episode/2928cee6-418d-4eba-951e-8c8ba98a77c5',
    image: 'peaceful',
    external: true,
  },
  {
    id: 'rjm-327',
    episode: 327,
    title: 'The Holy Spirit Re-wires Your Desires',
    provider: 'Robert J. Morgan',
    scripture: 'Romans 8:1–6',
    description: 'How the Spirit reshapes what we want, and sets the mind on life and peace.',
    category: 'Spiritual Growth',
    url: 'https://player.captivate.fm/episode/e3ff002a-3f74-4374-a2c2-69145cab6422',
    image: 'scripture',
    external: true,
  },
  {
    id: 'rjm-326',
    episode: 326,
    title: 'Walking in the Spirit',
    provider: 'Robert J. Morgan',
    scripture: 'Romans 8:1–4',
    description: 'What it means to walk day by day in step with the Spirit rather than the flesh.',
    category: 'Spiritual Growth',
    url: 'https://player.captivate.fm/episode/6b481de2-36f5-402f-857b-d76250ee0ac1',
    image: 'nature',
    external: true,
  },
  {
    id: 'rjm-325',
    episode: 325,
    title: 'The Empowered Life',
    provider: 'Robert J. Morgan',
    scripture: 'Romans 8:1–5',
    description: 'There is now no condemnation — living free and empowered in Christ Jesus.',
    category: 'Spiritual Growth',
    url: 'https://player.captivate.fm/episode/248b2b6f-cef5-4e37-a099-70568c9612e4',
    image: 'prayer',
    featured: true,
    external: true,
  },
  {
    id: 'rjm-324',
    episode: 324,
    title: 'The Holy Spirit Activates Our Spiritual Life',
    provider: 'Robert J. Morgan',
    scripture: 'Romans 8:1–2',
    description: 'The law of the Spirit of life, and how He awakens what was dead in us.',
    category: 'Spiritual Growth',
    url: 'https://player.captivate.fm/episode/6d8a38f1-0df8-4c26-a39b-2b5b9efc4590',
    image: 'sanctuary',
    external: true,
  },
  {
    id: 'rjm-323',
    episode: 323,
    title: 'How to Meditate on Scripture: Practical Tips',
    provider: 'Robert J. Morgan',
    scripture: 'Psalm 39:3',
    description: 'Simple, practical habits for pondering God’s Word until the fire burns within.',
    category: 'Bible Study',
    url: 'https://player.captivate.fm/episode/775670d4-66c5-46ce-b46e-907148d447a6',
    image: 'support',
    external: true,
  },
  {
    id: 'rjm-322',
    episode: 322,
    title: 'God’s Formula for Success',
    provider: 'Robert J. Morgan',
    scripture: 'Joshua 1 & Psalm 1',
    description: 'What Joshua 1 and Psalm 1 together teach about a life that prospers in God’s eyes.',
    category: 'Bible Study',
    url: 'https://player.captivate.fm/episode/9f72c938-625d-4e6a-b0c7-616b2560d887',
    image: 'chapel',
    external: true,
  },
];
