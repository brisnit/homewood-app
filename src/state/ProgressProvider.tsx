import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_PLAN_ID } from '../data/bibleReadingPlans';
import { BibleReadingPlanId } from '../types/models';

interface PlanProgress {
  completedDays: number[];
  notes: Record<number, string>;
}

interface ProgressState {
  plans: Record<string, PlanProgress>;
  /** Completed day numbers per reading method — switching methods keeps each one's progress. */
  bibleDays: Record<string, number[]>;
  activeBiblePlan: BibleReadingPlanId;
  highlights: string[]; // verse keys: `${reference}#${chapter}:${verse}`
}

interface ProgressContextValue {
  // Plans
  getPlanProgress: (planId: string) => PlanProgress;
  isPlanDayDone: (planId: string, day: number) => boolean;
  togglePlanDay: (planId: string, day: number) => void;
  savePlanNote: (planId: string, day: number, note: string) => void;
  planCompletion: (planId: string, totalDays: number) => number; // 0..1
  // Bible in a year (all relative to the active reading method)
  activeBiblePlan: BibleReadingPlanId;
  setActiveBiblePlan: (planId: BibleReadingPlanId) => void;
  isBibleDayDone: (day: number) => boolean;
  toggleBibleDay: (day: number) => void;
  bibleCompletedCount: number;
  // Highlights
  highlights: string[];
  isVerseHighlighted: (key: string) => boolean;
  toggleHighlight: (key: string) => void;
  highlightCount: number;
  // Streak (derived/simple)
  streak: number;
}

/** Stable key for a highlighted verse. */
export function verseKey(reference: string, chapter: number | undefined, verse: number): string {
  return `${reference}#${chapter ?? 1}:${verse}`;
}

const STORAGE_KEY = '@homewood/progress';
const EMPTY_PLAN: PlanProgress = { completedDays: [], notes: {} };

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>({
    plans: {},
    bibleDays: {},
    activeBiblePlan: DEFAULT_PLAN_ID,
    highlights: [],
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<ProgressState> & { bibleDays?: number[] | Record<string, number[]> };
          // Merge defaults so older saved state is safe. Before reading methods
          // existed, `bibleDays` was a flat array — those days were the blended plan.
          const saved = parsed.bibleDays;
          const bibleDays = Array.isArray(saved) ? { [DEFAULT_PLAN_ID]: saved } : (saved ?? {});
          setState({
            plans: parsed.plans ?? {},
            bibleDays,
            activeBiblePlan: parsed.activeBiblePlan ?? DEFAULT_PLAN_ID,
            highlights: parsed.highlights ?? [],
          });
        } catch {
          /* ignore corrupt cache */
        }
      }
    });
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const getPlanProgress = useCallback(
    (planId: string): PlanProgress => state.plans[planId] ?? EMPTY_PLAN,
    [state.plans],
  );

  const togglePlanDay = useCallback(
    (planId: string, day: number) => {
      const prev = state.plans[planId] ?? EMPTY_PLAN;
      const done = prev.completedDays.includes(day);
      const completedDays = done
        ? prev.completedDays.filter((d) => d !== day)
        : [...prev.completedDays, day].sort((a, b) => a - b);
      persist({ ...state, plans: { ...state.plans, [planId]: { ...prev, completedDays } } });
    },
    [state, persist],
  );

  const savePlanNote = useCallback(
    (planId: string, day: number, note: string) => {
      const prev = state.plans[planId] ?? EMPTY_PLAN;
      persist({
        ...state,
        plans: { ...state.plans, [planId]: { ...prev, notes: { ...prev.notes, [day]: note } } },
      });
    },
    [state, persist],
  );

  const toggleBibleDay = useCallback(
    (day: number) => {
      const plan = state.activeBiblePlan;
      const prev = state.bibleDays[plan] ?? [];
      const days = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b);
      persist({ ...state, bibleDays: { ...state.bibleDays, [plan]: days } });
    },
    [state, persist],
  );

  const setActiveBiblePlan = useCallback(
    (planId: BibleReadingPlanId) => persist({ ...state, activeBiblePlan: planId }),
    [state, persist],
  );

  const toggleHighlight = useCallback(
    (key: string) => {
      const has = state.highlights.includes(key);
      const highlights = has ? state.highlights.filter((k) => k !== key) : [...state.highlights, key];
      persist({ ...state, highlights });
    },
    [state, persist],
  );

  const value = useMemo<ProgressContextValue>(() => {
    const planActivity = Object.values(state.plans).reduce((n, p) => n + p.completedDays.length, 0);
    const bibleActivity = Object.values(state.bibleDays).reduce((n, days) => n + days.length, 0);
    const activeDays = state.bibleDays[state.activeBiblePlan] ?? [];
    // Simple streak heuristic for the MVP: base streak + recorded activity.
    const streak = 7 + planActivity + bibleActivity;
    return {
      getPlanProgress,
      isPlanDayDone: (planId, day) => getPlanProgress(planId).completedDays.includes(day),
      togglePlanDay,
      savePlanNote,
      planCompletion: (planId, total) =>
        total === 0 ? 0 : getPlanProgress(planId).completedDays.length / total,
      activeBiblePlan: state.activeBiblePlan,
      setActiveBiblePlan,
      isBibleDayDone: (day) => activeDays.includes(day),
      toggleBibleDay,
      bibleCompletedCount: activeDays.length,
      highlights: state.highlights,
      isVerseHighlighted: (key) => state.highlights.includes(key),
      toggleHighlight,
      highlightCount: state.highlights.length,
      streak,
    };
  }, [state, getPlanProgress, togglePlanDay, savePlanNote, toggleBibleDay, setActiveBiblePlan, toggleHighlight]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
