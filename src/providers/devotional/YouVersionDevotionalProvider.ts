import { DevotionalProvider } from './types';
import { HomewoodDevotionalProvider } from './HomewoodDevotionalProvider';
import { Devotional, DevotionalCategory, Plan, PlanDay, VerseOfTheDay } from '../../types/models';
import { config } from '../../lib/config';

/**
 * YouVersion-backed devotional provider.
 *
 * IMPORTANT — licensing/availability:
 * TODO(youversion): The YouVersion Platform API exposes a Verse of the Day and
 *   reading Plans, but devotional *content* and plan *day bodies* are subject to
 *   publisher licensing and may NOT be redistributable in-app. Confirm scope with
 *   YouVersion before relying on this provider. Until confirmed, anything not
 *   covered by the API delegates to the Homewood provider (our own content).
 *
 * Verse of the Day endpoint (when partner access is granted) is wired below;
 * everything else falls back to Homewood content so the MVP is never blocked.
 */
export class YouVersionDevotionalProvider implements DevotionalProvider {
  readonly name = 'youversion';
  private fallback = new HomewoodDevotionalProvider();

  async getVerseOfTheDay(date?: string): Promise<VerseOfTheDay> {
    if (!config.youVersion.isConfigured) return this.fallback.getVerseOfTheDay(date);
    try {
      // TODO(youversion): Replace with the confirmed VOTD endpoint + response mapping.
      const res = await fetch(`${config.youVersion.baseUrl}/verse_of_the_day`, {
        headers: { Authorization: `Bearer ${config.youVersion.apiKey}` },
      });
      if (!res.ok) throw new Error(`YouVersion ${res.status}`);
      // Mapping intentionally deferred until the response shape is confirmed.
      return this.fallback.getVerseOfTheDay(date);
    } catch (err) {
      console.warn('[YouVersionDevotionalProvider] VOTD failed, using fallback', err);
      return this.fallback.getVerseOfTheDay(date);
    }
  }

  // Devotionals + plans are Homewood-owned content (not guaranteed by YouVersion).
  getRecommendedDevotionals(limit?: number): Promise<Devotional[]> {
    return this.fallback.getRecommendedDevotionals(limit);
  }
  getDevotional(id: string): Promise<Devotional | null> {
    return this.fallback.getDevotional(id);
  }
  getCategories(): Promise<DevotionalCategory[]> {
    return this.fallback.getCategories();
  }
  getPlans(category?: string): Promise<Plan[]> {
    return this.fallback.getPlans(category);
  }
  getPlan(id: string): Promise<Plan | null> {
    return this.fallback.getPlan(id);
  }
  getPlanDays(planId: string): Promise<PlanDay[]> {
    return this.fallback.getPlanDays(planId);
  }
}
