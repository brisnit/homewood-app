import { BibleProvider, BiblePassage, BibleVersion } from './types';
import { FallbackBibleProvider } from './FallbackBibleProvider';
import { BibleReadingDay, BibleReadingPlanId, BibleReadingPlanMeta } from '../../types/models';
import { config } from '../../lib/config';

/**
 * YouVersion Platform Bible provider.
 *
 * IMPORTANT — licensing/availability:
 * TODO(youversion): The YouVersion Platform API can provide Bible *metadata*
 *   (versions) and, depending on partner agreement, passage text and audio for
 *   specific versions. The redistributable scope, red-letter data, and the
 *   per-day "Bible in a year" schedule must be confirmed. Where YouVersion does
 *   NOT provide something (notably our 365-day schedule), we use our own
 *   Fallback provider. This keeps the MVP unblocked.
 *
 * Confirm before enabling:
 *   - Versions/metadata endpoint + auth scheme
 *   - Passage text endpoint + red-letter availability per version
 *   - Audio availability + streaming URLs
 */
export class YouVersionBibleProvider implements BibleProvider {
  readonly name = 'youversion';
  private fallback = new FallbackBibleProvider();

  async getVersions(): Promise<BibleVersion[]> {
    if (!config.youVersion.isConfigured) return this.fallback.getVersions();
    try {
      // TODO(youversion): GET {baseUrl}/versions -> map to BibleVersion[]
      const res = await fetch(`${config.youVersion.baseUrl}/versions`, {
        headers: { Authorization: `Bearer ${config.youVersion.apiKey}` },
      });
      if (!res.ok) throw new Error(`YouVersion ${res.status}`);
      return this.fallback.getVersions(); // mapping deferred until shape confirmed
    } catch (err) {
      console.warn('[YouVersionBibleProvider] versions failed, using fallback', err);
      return this.fallback.getVersions();
    }
  }

  // The 365-day schedule is Homewood-owned (YouVersion plans may differ/relicense).
  getReadingPlans(): Promise<BibleReadingPlanMeta[]> {
    return this.fallback.getReadingPlans();
  }
  getReadingPlan(planId: BibleReadingPlanId): Promise<BibleReadingDay[]> {
    return this.fallback.getReadingPlan(planId);
  }
  getReadingDay(planId: BibleReadingPlanId, dayNumber: number): Promise<BibleReadingDay | null> {
    return this.fallback.getReadingDay(planId, dayNumber);
  }

  async getPassage(reference: string, translation: string): Promise<BiblePassage> {
    if (!config.youVersion.isConfigured) return this.fallback.getPassage(reference, translation);
    try {
      // TODO(youversion): GET passage text + red-letter spans + audio for `translation`.
      const res = await fetch(
        `${config.youVersion.baseUrl}/passages?reference=${encodeURIComponent(reference)}&version=${translation}`,
        { headers: { Authorization: `Bearer ${config.youVersion.apiKey}` } },
      );
      if (!res.ok) throw new Error(`YouVersion ${res.status}`);
      return this.fallback.getPassage(reference, translation); // mapping deferred
    } catch (err) {
      console.warn('[YouVersionBibleProvider] passage failed, using fallback', err);
      return this.fallback.getPassage(reference, translation);
    }
  }

  hasAudio(translation: string): Promise<boolean> {
    return this.fallback.hasAudio(translation);
  }
}
