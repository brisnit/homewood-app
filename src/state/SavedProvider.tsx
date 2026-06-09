import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem } from '../types/models';
import { SAVED } from '../data/mockData';

type NewSave = Pick<SavedItem, 'kind' | 'refId' | 'title'>;

interface SavedContextValue {
  items: SavedItem[];
  isSaved: (kind: SavedItem['kind'], refId: string) => boolean;
  /** Add if not saved, remove if already saved. Returns the new saved state. */
  toggleSave: (item: NewSave) => boolean;
  remove: (id: string) => void;
  count: number;
}

const STORAGE_KEY = '@homewood/saved';
const SavedContext = createContext<SavedContextValue | undefined>(undefined);

function uid(): string {
  return `sv-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>(SAVED);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setItems(JSON.parse(raw) as SavedItem[]);
        } catch {
          /* keep seed */
        }
      }
    });
  }, []);

  const persist = useCallback((next: SavedItem[]) => {
    setItems(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const isSaved = useCallback(
    (kind: SavedItem['kind'], refId: string) => items.some((i) => i.kind === kind && i.refId === refId),
    [items],
  );

  const toggleSave = useCallback(
    (item: NewSave): boolean => {
      const existing = items.find((i) => i.kind === item.kind && i.refId === item.refId);
      if (existing) {
        persist(items.filter((i) => i.id !== existing.id));
        return false;
      }
      const created: SavedItem = {
        id: uid(),
        userId: 'me',
        kind: item.kind,
        refId: item.refId,
        title: item.title,
        savedAt: new Date().toISOString(),
      };
      persist([created, ...items]);
      return true;
    },
    [items, persist],
  );

  const remove = useCallback((id: string) => persist(items.filter((i) => i.id !== id)), [items, persist]);

  const value = useMemo<SavedContextValue>(
    () => ({
      items: [...items].sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1)),
      isSaved,
      toggleSave,
      remove,
      count: items.length,
    }),
    [items, isSaved, toggleSave, remove],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within a SavedProvider');
  return ctx;
}
