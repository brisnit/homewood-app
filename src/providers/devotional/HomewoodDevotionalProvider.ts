import { DevotionalProvider } from './types';
import { MockDevotionalProvider } from './MockDevotionalProvider';
import { Devotional, DevotionalCategory, Plan, PlanDay, VerseOfTheDay } from '../../types/models';
import { config } from '../../lib/config';

/**
 * Homewood-owned devotional API provider (our fallback content service).
 *
 * This is the primary path when YouVersion cannot supply devotionals/plans.
 * Until the Homewood content API is deployed, it transparently delegates to the
 * mock provider so the app never blocks.
 *
 * TODO(homewood): Implement real REST calls against config.homewood.apiUrl.
 *   Expected endpoints:
 *     GET /verse-of-the-day?date=YYYY-MM-DD
 *     GET /devotionals?limit=
 *     GET /devotionals/:id
 *     GET /categories
 *     GET /plans?category=
 *     GET /plans/:id  and  GET /plans/:id/days
 */
export class HomewoodDevotionalProvider implements DevotionalProvider {
  readonly name = 'homewood';
  private fallback = new MockDevotionalProvider();

  private async get<T>(path: string, mock: () => Promise<T>): Promise<T> {
    if (!config.homewood.isConfigured) return mock();
    try {
      const res = await fetch(`${config.homewood.apiUrl}${path}`);
      if (!res.ok) throw new Error(`Homewood API ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      console.warn(`[HomewoodDevotionalProvider] ${path} failed, using fallback`, err);
      return mock();
    }
  }

  getVerseOfTheDay(date?: string): Promise<VerseOfTheDay> {
    return this.get(`/verse-of-the-day${date ? `?date=${date}` : ''}`, () =>
      this.fallback.getVerseOfTheDay(date),
    );
  }
  getRecommendedDevotionals(limit = 3): Promise<Devotional[]> {
    return this.get(`/devotionals?limit=${limit}`, () => this.fallback.getRecommendedDevotionals(limit));
  }
  getDevotional(id: string): Promise<Devotional | null> {
    return this.get(`/devotionals/${id}`, () => this.fallback.getDevotional(id));
  }
  getCategories(): Promise<DevotionalCategory[]> {
    return this.get(`/categories`, () => this.fallback.getCategories());
  }
  getPlans(category?: string): Promise<Plan[]> {
    return this.get(`/plans${category ? `?category=${category}` : ''}`, () =>
      this.fallback.getPlans(category),
    );
  }
  getPlan(id: string): Promise<Plan | null> {
    return this.get(`/plans/${id}`, () => this.fallback.getPlan(id));
  }
  getPlanDays(planId: string): Promise<PlanDay[]> {
    return this.get(`/plans/${planId}/days`, () => this.fallback.getPlanDays(planId));
  }
}
