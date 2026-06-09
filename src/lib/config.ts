/**
 * Central runtime config. Reads EXPO_PUBLIC_* env vars (inlined at build time)
 * and falls back to safe mock defaults so the app boots with zero configuration.
 */

export type BibleProviderName = 'youversion' | 'fallback' | 'mock';
export type DevotionalProviderName = 'youversion' | 'homewood' | 'mock';

function pick<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value ?? '') ? (value as T) : fallback;
}

export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    get isConfigured() {
      return Boolean(this.url && this.anonKey);
    },
  },
  providers: {
    bible: pick<BibleProviderName>(
      process.env.EXPO_PUBLIC_BIBLE_PROVIDER,
      ['youversion', 'fallback', 'mock'],
      'mock',
    ),
    devotional: pick<DevotionalProviderName>(
      process.env.EXPO_PUBLIC_DEVOTIONAL_PROVIDER,
      ['youversion', 'homewood', 'mock'],
      'mock',
    ),
  },
  youVersion: {
    apiKey: process.env.EXPO_PUBLIC_YOUVERSION_API_KEY ?? '',
    // TODO(youversion): Confirm base URL + auth scheme once partner access is granted.
    baseUrl: 'https://api.youversion.com/v1',
    get isConfigured() {
      return Boolean(this.apiKey);
    },
  },
  homewood: {
    apiUrl: process.env.EXPO_PUBLIC_HOMEWOOD_API_URL ?? '',
    get isConfigured() {
      return Boolean(this.apiUrl);
    },
  },
  privacyPolicyVersion: '2026-06-01',
} as const;
