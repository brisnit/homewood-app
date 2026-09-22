import { BibleProvider, BiblePassage, BibleVersion } from './types';
import { BIBLE_PLANS, getPlanDay, getPlanDays } from '../../data/bibleReadingPlans';
import { BibleReadingDay, BibleReadingPlanId, BibleReadingPlanMeta } from '../../types/models';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const VERSIONS: BibleVersion[] = [
  { id: 'NIV', name: 'New International Version', supportsRedLetter: true, supportsAudio: true },
  { id: 'ESV', name: 'English Standard Version', supportsRedLetter: true, supportsAudio: true },
  { id: 'KJV', name: 'King James Version', supportsRedLetter: true, supportsAudio: false },
  { id: 'NLT', name: 'New Living Translation', supportsRedLetter: false, supportsAudio: true },
  { id: 'CSB', name: 'Christian Standard Bible', supportsRedLetter: true, supportsAudio: false },
  { id: 'NKJV', name: 'New King James Version', supportsRedLetter: true, supportsAudio: true },
];

const SAMPLE_VERSES = [
  'In the beginning God created the heavens and the earth.',
  'Now the earth was formless and empty, darkness was over the surface of the deep.',
  'And God said, “Let there be light,” and there was light.',
  'God saw that the light was good, and he separated the light from the darkness.',
  'The Lord is my shepherd, I lack nothing.',
  'He makes me lie down in green pastures, he leads me beside quiet waters.',
];

export class MockBibleProvider implements BibleProvider {
  readonly name = 'mock';

  getVersions() {
    return delay(VERSIONS);
  }

  getReadingPlans(): Promise<BibleReadingPlanMeta[]> {
    return delay(BIBLE_PLANS);
  }

  getReadingPlan(planId: BibleReadingPlanId): Promise<BibleReadingDay[]> {
    return delay(getPlanDays(planId));
  }

  getReadingDay(planId: BibleReadingPlanId, dayNumber: number): Promise<BibleReadingDay | null> {
    return delay(getPlanDay(planId, dayNumber));
  }

  getPassage(reference: string, translation: string): Promise<BiblePassage> {
    const version = VERSIONS.find((v) => v.id === translation) ?? VERSIONS[0];
    const passage: BiblePassage = {
      reference,
      translation,
      verses: SAMPLE_VERSES.map((text, i) => ({
        number: i + 1,
        text,
        // Demo: mark a couple of verses as words of Christ when supported.
        redLetter: version.supportsRedLetter && i >= 2 && i <= 3,
      })),
      audioUrl: version.supportsAudio ? `mock://audio/${encodeURIComponent(reference)}` : null,
      copyright: `${version.name} — sample text for demonstration only.`,
    };
    return delay(passage);
  }

  async hasAudio(translation: string): Promise<boolean> {
    return VERSIONS.find((v) => v.id === translation)?.supportsAudio ?? false;
  }
}
