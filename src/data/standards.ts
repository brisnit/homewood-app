/**
 * Homewood Living Ministries — Standards of Conduct.
 *
 * The text people read and accept at signup, and can re-read any time from the
 * bottom of the Profile screen. Kept here (not inline in the screen) so the
 * wording is reviewable on its own and can move to a CMS later without touching
 * the UI.
 *
 * Bump STANDARDS_VERSION whenever the substance changes — acceptance is stored
 * against the version, so a change re-prompts everyone.
 */
export const STANDARDS_VERSION = '2026-06-01';

export interface StandardsSection {
  id: string;
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  /** Concrete commitments, shown as a checklist under the body. */
  points?: string[];
}

export const STANDARDS_INTRO =
  'Homewood Living is a shared space for residents, employees, and community members to grow in faith together. These standards describe how we treat one another here. They are short on rules and long on charity, and they ask the same of everyone.';

export const STANDARDS_SECTIONS: StandardsSection[] = [
  {
    id: 'welcome',
    heading: 'We welcome one another',
    body: [
      'People come to Homewood Living from different churches, different backgrounds, and different points in their walk with God. Some have read Scripture their whole lives; some are opening it for the first time. Both belong here.',
      'Assume the best of the person you are reading. Ask before you correct. Leave room for someone to be at an earlier place than you are.',
    ],
    points: [
      'Treat every member with respect, whatever their age, role, campus, or background.',
      'Make space for questions — no question about faith is too basic to ask here.',
      'Disagree about ideas without diminishing the person holding them.',
    ],
  },
  {
    id: 'speech',
    heading: 'We speak with grace',
    body: [
      'What we post in groups, prayer walls, and messages is public to the people who see it. Scripture asks that our words build up rather than tear down, and that standard holds in an app the same as it does in a hallway.',
    ],
    points: [
      'No harassment, threats, slurs, or demeaning language toward any person or group.',
      'No sexually explicit, violent, or otherwise graphic content.',
      'No language intended to shame, provoke, or single someone out.',
    ],
  },
  {
    id: 'privacy',
    heading: 'We protect what is shared in confidence',
    body: [
      'Prayer requests, journal entries, and conversations in a study group carry real trust. A great deal of what people share here they would not share anywhere else.',
      'Your journal and personal notes are private to you by default and are never shown to staff or other members. What you choose to share in a group, treat as belonging to the person who shared it.',
    ],
    points: [
      'Do not repeat, screenshot, or forward what someone shares in confidence.',
      'Do not share another person’s photo, contact details, or health information.',
      'Ask before adding someone to a group or naming them in a prayer request.',
    ],
  },
  {
    id: 'safety',
    heading: 'We keep this a safe place',
    body: [
      'Many Homewood residents are older adults, and some are in vulnerable seasons. Protecting them is everyone’s responsibility, not only the staff’s.',
    ],
    points: [
      'No soliciting, selling, fundraising, or promoting a business or campaign.',
      'No requesting money, gifts, or financial information from another member.',
      'No political campaigning or partisan advocacy in shared spaces.',
      'Report anything that concerns you — see “If something goes wrong” below.',
    ],
  },
  {
    id: 'honesty',
    heading: 'We are who we say we are',
    body: [
      'Use your real name and your own account. Impersonating another member, a chaplain, or Homewood staff is a serious breach and is handled as one.',
    ],
    points: [
      'One account per person; do not share your login.',
      'Do not impersonate anyone or misrepresent your role at Homewood.',
      'Do not use the app to gather members’ information for outside purposes.',
    ],
  },
  {
    id: 'content',
    heading: 'We handle Scripture and content with care',
    body: [
      'Teaching, devotionals, and study materials here are prepared by Homewood chaplaincy and trusted partners. Sharing them within the app is welcome; republishing them elsewhere is not, and some are licensed to us rather than owned by us.',
    ],
    points: [
      'Do not copy or redistribute study materials outside Homewood Living.',
      'Do not present outside teaching as though it came from Homewood.',
      'Respect the copyright of Bible translations and third-party resources.',
    ],
  },
  {
    id: 'accountability',
    heading: 'If something goes wrong',
    body: [
      'If you see something that breaks these standards, tell us. You can reach the chaplaincy through Messages, or speak with any Homewood staff member on your campus.',
      'We look into every report. Depending on what we find, we may remove content, speak with the people involved, limit an account, or in serious cases close one. Where safety is at risk, we involve the appropriate authorities.',
      'If a report is about you, we will tell you what was raised and give you a chance to respond.',
    ],
  },
];

export const STANDARDS_CLOSING =
  'These standards apply everywhere in Homewood Living — messages, prayer requests, Bible studies, events, and comments. They may be updated as the community grows; we will ask you to review any substantial change.';

/** Short summary shown on the signup gate above the full text. */
export const STANDARDS_SUMMARY = [
  { icon: 'heart-outline', text: 'Treat every member with respect and charity.' },
  { icon: 'chatbubble-ellipses-outline', text: 'Speak in a way that builds people up.' },
  { icon: 'lock-closed-outline', text: 'Keep what is shared in confidence, confidential.' },
  { icon: 'shield-checkmark-outline', text: 'No soliciting, harassment, or impersonation.' },
] as const;
