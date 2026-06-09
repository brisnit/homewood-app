import { Devotional, DevotionalCategory, Plan, PlanDay, VerseOfTheDay } from '../../types/models';

/**
 * Devotional content provider contract.
 * Swappable implementations: Mock, Homewood (our API), YouVersion (if licensed).
 */
export interface DevotionalProvider {
  readonly name: string;
  getVerseOfTheDay(date?: string): Promise<VerseOfTheDay>;
  getRecommendedDevotionals(limit?: number): Promise<Devotional[]>;
  getDevotional(id: string): Promise<Devotional | null>;
  getCategories(): Promise<DevotionalCategory[]>;
  getPlans(category?: string): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | null>;
  getPlanDays(planId: string): Promise<PlanDay[]>;
}
