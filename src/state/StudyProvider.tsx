import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Bible study membership (persisted locally).
 *
 * Joining a study is a standing commitment to a group, not an RSVP to one date
 * — so it lives apart from RsvpProvider, and tracks which sessions you've
 * completed as the weeks go by.
 *
 * TODO(backend): move to Supabase (bible_study_members) so a leader can see
 *   the roster and membership follows the person across devices.
 */
export interface StudyMembership {
  studyId: string;
  joinedAt: string;
  /** sessionNumbers marked complete. */
  completedSessions: number[];
}

interface StudyContextValue {
  isJoined: (studyId: string) => boolean;
  getMembership: (studyId: string) => StudyMembership | undefined;
  join: (studyId: string) => StudyMembership;
  leave: (studyId: string) => void;
  toggleSession: (studyId: string, sessionNumber: number) => void;
  /** studyIds the person is currently in. */
  joinedIds: string[];
  count: number;
}

const STORAGE_KEY = '@homewood/study-memberships';
const StudyContext = createContext<StudyContextValue | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Record<string, StudyMembership>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        setMemberships(JSON.parse(raw) as Record<string, StudyMembership>);
      } catch {
        /* ignore malformed cache */
      }
    });
  }, []);

  const persist = useCallback((next: Record<string, StudyMembership>) => {
    setMemberships(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo<StudyContextValue>(() => {
    return {
      isJoined: (studyId) => !!memberships[studyId],
      getMembership: (studyId) => memberships[studyId],
      join: (studyId) => {
        const existing = memberships[studyId];
        if (existing) return existing;
        const next: StudyMembership = {
          studyId,
          joinedAt: new Date().toISOString(),
          completedSessions: [],
        };
        persist({ ...memberships, [studyId]: next });
        return next;
      },
      leave: (studyId) => {
        const next = { ...memberships };
        delete next[studyId];
        persist(next);
      },
      toggleSession: (studyId, sessionNumber) => {
        const m = memberships[studyId];
        if (!m) return;
        const done = m.completedSessions.includes(sessionNumber);
        const completedSessions = done
          ? m.completedSessions.filter((n) => n !== sessionNumber)
          : [...m.completedSessions, sessionNumber].sort((a, b) => a - b);
        persist({ ...memberships, [studyId]: { ...m, completedSessions } });
      },
      joinedIds: Object.keys(memberships),
      count: Object.keys(memberships).length,
    };
  }, [memberships, persist]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within a StudyProvider');
  return ctx;
}
