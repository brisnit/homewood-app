/** Supported app languages (UI localization is staged; selection is persisted). */
export interface Language {
  code: string;
  label: string; // English name
  native: string; // endonym
}

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'tl', label: 'Tagalog', native: 'Tagalog' },
];

export const languageLabel = (code: string): string =>
  LANGUAGES.find((l) => l.code === code)?.label ?? 'English';
