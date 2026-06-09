import { DevotionalProvider } from './types';
import {
  CATEGORIES,
  DEVOTIONALS,
  PLANS,
  VERSE_OF_THE_DAY,
  makePlanDays,
} from '../../data/mockData';

/** Simulates async latency so loading states are exercised in development. */
const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class MockDevotionalProvider implements DevotionalProvider {
  readonly name = 'mock';

  getVerseOfTheDay(_date?: string) {
    return delay(VERSE_OF_THE_DAY);
  }

  getRecommendedDevotionals(limit = 3) {
    return delay(DEVOTIONALS.slice(0, limit));
  }

  getDevotional(id: string) {
    return delay(DEVOTIONALS.find((d) => d.id === id) ?? null);
  }

  getCategories() {
    return delay(CATEGORIES);
  }

  getPlans(category?: string) {
    return delay(category ? PLANS.filter((p) => p.category === category) : PLANS);
  }

  getPlan(id: string) {
    return delay(PLANS.find((p) => p.id === id) ?? null);
  }

  getPlanDays(planId: string) {
    const plan = PLANS.find((p) => p.id === planId);
    return delay(plan ? makePlanDays(plan) : []);
  }
}
