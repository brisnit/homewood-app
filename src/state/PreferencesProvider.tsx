import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPrefs {
  verseOfTheDay: boolean;
  planReminders: boolean;
  friendActivity: boolean;
  streakReminders: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "21:00"
  quietHoursEnd: string; // "07:00"
}

export interface AudioPrefs {
  voiceId: string | null; // null = device default voice
  rate: number; // 0.1–2.0 (1 = normal)
}

interface Preferences {
  language: string; // code
  notifications: NotificationPrefs;
  audio: AudioPrefs;
}

const DEFAULTS: Preferences = {
  language: 'en',
  notifications: {
    verseOfTheDay: true,
    planReminders: true,
    friendActivity: true,
    streakReminders: true,
    quietHoursEnabled: false,
    quietHoursStart: '21:00',
    quietHoursEnd: '07:00',
  },
  audio: {
    voiceId: null,
    rate: 0.9, // a measured, reverent pace for scripture
  },
};

interface PreferencesContextValue extends Preferences {
  setLanguage: (code: string) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean | string) => void;
  setAudio: (patch: Partial<AudioPrefs>) => void;
}

const STORAGE_KEY = '@homewood/preferences';
const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<Preferences>;
          setPrefs({
            language: parsed.language ?? DEFAULTS.language,
            notifications: { ...DEFAULTS.notifications, ...(parsed.notifications ?? {}) },
            audio: { ...DEFAULTS.audio, ...(parsed.audio ?? {}) },
          });
        } catch {
          /* keep defaults */
        }
      }
    });
  }, []);

  const persist = useCallback((next: Preferences) => {
    setPrefs(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setLanguage = useCallback(
    (code: string) => persist({ ...prefs, language: code }),
    [prefs, persist],
  );

  const setNotification = useCallback(
    (key: keyof NotificationPrefs, value: boolean | string) =>
      persist({ ...prefs, notifications: { ...prefs.notifications, [key]: value } }),
    [prefs, persist],
  );

  const setAudio = useCallback(
    (patch: Partial<AudioPrefs>) => persist({ ...prefs, audio: { ...prefs.audio, ...patch } }),
    [prefs, persist],
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({ ...prefs, setLanguage, setNotification, setAudio }),
    [prefs, setLanguage, setNotification, setAudio],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
}
