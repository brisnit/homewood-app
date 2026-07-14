/**
 * External courses surfaced in Resources. These are hosted by third parties
 * (Robert J. Morgan) — the app links out; Homewood does not own or deliver them.
 *
 * TODO(admin): move to the admin-managed content system so courses can be
 *   added/edited without a code change (mirror the admin Media/Content pattern).
 */
import { ImageKey } from '../lib/images';

export interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: string;
  url: string;
  image: ImageKey;
  featured?: boolean;
  external: true;
}

export const COURSES: Course[] = [
  {
    id: 'rjm-god-hasnt-forgotten-you',
    title: 'God Hasn’t Forgotten You',
    provider: 'Robert J. Morgan',
    description: 'Encouragement from Scripture that God sees you and has not forgotten your story.',
    category: 'Encouragement',
    url: 'https://www.robertjmorgan.com/courses/god-hasnt-forgotten-you/',
    image: 'hope',
    featured: true,
    external: true,
  },
  {
    id: 'rjm-whatever-happens',
    title: 'Whatever Happens',
    provider: 'Robert J. Morgan',
    description: 'Finding steady faith and peace no matter what circumstances come your way.',
    category: 'Faith',
    url: 'https://www.robertjmorgan.com/courses/whatever-happens/',
    image: 'peaceful',
    external: true,
  },
  {
    id: 'rjm-jordan-river-rules',
    title: 'The Jordan River Rules — Video Study',
    provider: 'Robert J. Morgan',
    description: 'Ten timeless principles for facing life’s hardest crossings with courage.',
    category: 'Bible Study',
    url: 'https://www.robertjmorgan.com/courses/the-jordan-river-rules-video-study/',
    image: 'nature',
    featured: true,
    external: true,
  },
  {
    id: 'rjm-romans-828',
    title: 'Romans 8:28 — Video Study',
    provider: 'Robert J. Morgan',
    description: 'A study of the promise that God works all things together for good.',
    category: 'Bible Study',
    url: 'https://www.robertjmorgan.com/courses/romans828-video-study/',
    image: 'scripture',
    external: true,
  },
  {
    id: 'rjm-save-the-hymns',
    title: 'Save the Hymns',
    provider: 'Robert J. Morgan',
    description: 'Rediscover the great hymns of the faith and the stories behind them.',
    category: 'Worship',
    url: 'https://www.robertjmorgan.com/courses/save-the-hymns/',
    image: 'worship',
    external: true,
  },
  {
    id: 'rjm-100-bible-verses-america',
    title: '100 Bible Verses That Made America',
    provider: 'Robert J. Morgan',
    description: 'How Scripture shaped the founding and story of a nation.',
    category: 'History',
    url: 'https://www.robertjmorgan.com/courses/100-bible-verses-made-america/',
    image: 'sanctuary',
    external: true,
  },
  {
    id: 'rjm-50-final-events',
    title: '50 Final Events in World History',
    provider: 'Robert J. Morgan',
    description: 'A clear, hopeful look at what the Bible says about the days to come.',
    category: 'Prophecy',
    url: 'https://www.robertjmorgan.com/courses/50-final-events-world-history/',
    image: 'chapel',
    external: true,
  },
];
