import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../types/models';

interface NewEntry {
  title: string;
  body: string;
  scriptureRef?: string | null;
}

interface JournalContextValue {
  entries: JournalEntry[];
  reflections: JournalEntry[]; // entries with no scripture reference
  scriptureNotes: JournalEntry[]; // entries captured during a reading
  getEntry: (id: string) => JournalEntry | undefined;
  addEntry: (entry: NewEntry) => string; // returns new id
  updateEntry: (id: string, patch: Partial<NewEntry>) => void;
  deleteEntry: (id: string) => void;
}

const STORAGE_KEY = '@homewood/journal';

const SEED: JournalEntry[] = [
  {
    id: 'seed-1',
    title: 'Learning to rest',
    body: 'Today’s reading reminded me that God leads me beside still waters — He knows I need rest before I do. I want to build a slower morning rhythm this week and start with five quiet minutes before I check my phone.',
    scriptureRef: null,
    createdAt: '2026-06-07T07:30:00Z',
    updatedAt: '2026-06-07T07:30:00Z',
  },
  {
    id: 'seed-2',
    title: 'Note on John 14:27',
    body: 'Peace I leave with you. Christ’s peace is different from the world’s — it doesn’t depend on circumstances. Carry this into the meeting today.',
    scriptureRef: 'John 14:27',
    createdAt: '2026-06-05T19:25:00Z',
    updatedAt: '2026-06-05T19:25:00Z',
  },
];

const JournalContext = createContext<JournalContextValue | undefined>(undefined);

function uid(): string {
  return `j-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(SEED);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setEntries(JSON.parse(raw) as JournalEntry[]);
        } catch {
          /* keep seed on corrupt cache */
        }
      }
    });
  }, []);

  const persist = useCallback((next: JournalEntry[]) => {
    setEntries(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addEntry = useCallback(
    (entry: NewEntry): string => {
      const now = new Date().toISOString();
      const created: JournalEntry = {
        id: uid(),
        title: entry.title.trim() || 'Untitled entry',
        body: entry.body.trim(),
        scriptureRef: entry.scriptureRef ?? null,
        createdAt: now,
        updatedAt: now,
      };
      persist([created, ...entries]);
      return created.id;
    },
    [entries, persist],
  );

  const updateEntry = useCallback(
    (id: string, patch: Partial<NewEntry>) => {
      const now = new Date().toISOString();
      persist(
        entries.map((e) =>
          e.id === id
            ? {
                ...e,
                ...patch,
                title: (patch.title ?? e.title).trim() || 'Untitled entry',
                body: (patch.body ?? e.body).trim(),
                updatedAt: now,
              }
            : e,
        ),
      );
    },
    [entries, persist],
  );

  const deleteEntry = useCallback(
    (id: string) => persist(entries.filter((e) => e.id !== id)),
    [entries, persist],
  );

  const value = useMemo<JournalContextValue>(() => {
    const sorted = [...entries].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    return {
      entries: sorted,
      reflections: sorted.filter((e) => !e.scriptureRef),
      scriptureNotes: sorted.filter((e) => e.scriptureRef),
      getEntry: (id) => entries.find((e) => e.id === id),
      addEntry,
      updateEntry,
      deleteEntry,
    };
  }, [entries, addEntry, updateEntry, deleteEntry]);

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used within a JournalProvider');
  return ctx;
}
