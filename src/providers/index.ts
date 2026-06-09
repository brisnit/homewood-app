/**
 * Provider registry. Selects the active devotional + bible providers from config.
 * Everything in the app imports content through these singletons, never directly
 * from a concrete provider — so the backing source can be swapped via env only.
 */
import { config } from '../lib/config';

import { DevotionalProvider } from './devotional/types';
import { MockDevotionalProvider } from './devotional/MockDevotionalProvider';
import { HomewoodDevotionalProvider } from './devotional/HomewoodDevotionalProvider';
import { YouVersionDevotionalProvider } from './devotional/YouVersionDevotionalProvider';

import { BibleProvider } from './bible/types';
import { MockBibleProvider } from './bible/MockBibleProvider';
import { FallbackBibleProvider } from './bible/FallbackBibleProvider';
import { YouVersionBibleProvider } from './bible/YouVersionBibleProvider';

function createDevotionalProvider(): DevotionalProvider {
  switch (config.providers.devotional) {
    case 'youversion':
      return new YouVersionDevotionalProvider();
    case 'homewood':
      return new HomewoodDevotionalProvider();
    case 'mock':
    default:
      return new MockDevotionalProvider();
  }
}

function createBibleProvider(): BibleProvider {
  switch (config.providers.bible) {
    case 'youversion':
      return new YouVersionBibleProvider();
    case 'fallback':
      return new FallbackBibleProvider();
    case 'mock':
    default:
      return new MockBibleProvider();
  }
}

export const devotionalProvider: DevotionalProvider = createDevotionalProvider();
export const bibleProvider: BibleProvider = createBibleProvider();

export * from './devotional/types';
export * from './bible/types';
