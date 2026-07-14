import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Event RSVP + ticket store (persisted). In-app RSVP generates a real Homewood
 * ticket (confirmation number + scannable code). External registration only
 * records the click and an optional user self-confirmation — we never fabricate
 * a confirmation for an external platform (e.g. Eventbrite).
 *
 * TODO(backend): move to Supabase (event_registrations) + server-issued
 *   confirmation/ticket codes; add verified external-registration webhooks.
 */
export interface Rsvp {
  eventId: string;
  status: 'going' | 'waitlist' | 'canceled';
  guestCount: number;
  confirmationNumber: string; // e.g. HW-4F2A9
  ticketCode: string; // encoded into the QR
  createdAt: string;
  // External registration provenance (no fabricated confirmations)
  externalClickedAt?: string | null;
  externalSelfConfirmedAt?: string | null;
}

interface RsvpContextValue {
  getRsvp: (eventId: string) => Rsvp | undefined;
  rsvp: (eventId: string, guestCount?: number, waitlist?: boolean) => Rsvp;
  cancel: (eventId: string) => void;
  setGuestCount: (eventId: string, guestCount: number) => void;
  recordExternalClick: (eventId: string) => void;
  selfConfirmExternal: (eventId: string) => void;
  count: number;
}

const STORAGE_KEY = '@homewood/rsvps';
const RsvpContext = createContext<RsvpContextValue | undefined>(undefined);

function makeCode(len: number): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function RsvpProvider({ children }: { children: React.ReactNode }) {
  const [rsvps, setRsvps] = useState<Record<string, Rsvp>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setRsvps(JSON.parse(raw) as Record<string, Rsvp>);
        } catch {
          /* ignore */
        }
      }
    });
  }, []);

  const persist = useCallback((next: Record<string, Rsvp>) => {
    setRsvps(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo<RsvpContextValue>(() => {
    const upsert = (eventId: string, patch: Partial<Rsvp>) => {
      const existing = rsvps[eventId];
      const next: Rsvp = existing
        ? { ...existing, ...patch }
        : {
            eventId,
            status: 'going',
            guestCount: 0,
            confirmationNumber: `HW-${makeCode(5)}`,
            ticketCode: `HWLIVE:${eventId}:${makeCode(8)}`,
            createdAt: new Date().toISOString(),
            externalClickedAt: null,
            externalSelfConfirmedAt: null,
            ...patch,
          };
      persist({ ...rsvps, [eventId]: next });
      return next;
    };

    return {
      getRsvp: (eventId) => rsvps[eventId],
      rsvp: (eventId, guestCount = 0, waitlist = false) =>
        upsert(eventId, { status: waitlist ? 'waitlist' : 'going', guestCount }),
      cancel: (eventId) => upsert(eventId, { status: 'canceled' }),
      setGuestCount: (eventId, guestCount) => upsert(eventId, { guestCount: Math.max(0, guestCount) }),
      recordExternalClick: (eventId) => upsert(eventId, { externalClickedAt: new Date().toISOString() }),
      selfConfirmExternal: (eventId) => upsert(eventId, { externalSelfConfirmedAt: new Date().toISOString() }),
      count: Object.values(rsvps).filter((r) => r.status === 'going').length,
    };
  }, [rsvps, persist]);

  return <RsvpContext.Provider value={value}>{children}</RsvpContext.Provider>;
}

export function useRsvp(): RsvpContextValue {
  const ctx = useContext(RsvpContext);
  if (!ctx) throw new Error('useRsvp must be used within an RsvpProvider');
  return ctx;
}
