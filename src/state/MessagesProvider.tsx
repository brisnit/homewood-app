import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, Conversation } from '../types/models';

/**
 * Messaging store — admin→user broadcasts and user→user chats. Persisted to the
 * device. In production, back these with Supabase (conversations + messages
 * tables) and realtime; the admin portal already sends "admin_messages" that
 * would land in the `admin` conversation here.
 */

const STORAGE_KEY = '@homewood/messages';
const ME = 'me';

const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60000).toISOString();

function seed(): Conversation[] {
  return [
    {
      id: 'c-admin',
      partyId: 'admin',
      partyName: 'Homewood Living',
      kind: 'admin',
      subtitle: 'Chaplaincy & Announcements',
      lastReadAt: ago(9999), // unread
      messages: [
        { id: 'am-1', conversationId: 'c-admin', senderId: 'admin', senderName: 'Chaplain Ruth', text: 'Good morning! Join us this Wednesday at 6pm in the Fellowship Hall for our study of Philippians. Coffee and fellowship to follow — all are welcome. 🙏', createdAt: ago(180) },
      ],
    },
    {
      id: 'c-ruth',
      partyId: 'u-ruth',
      partyName: 'Ruth Alvarez',
      kind: 'user',
      lastReadAt: ago(9999), // unread
      messages: [
        { id: 'rm-1', conversationId: 'c-ruth', senderId: ME, senderName: 'You', text: 'Thank you for praying with me yesterday. It meant a lot.', createdAt: ago(220) },
        { id: 'rm-2', conversationId: 'c-ruth', senderId: 'u-ruth', senderName: 'Ruth Alvarez', text: 'Of course, friend. I’m still praying for your family. Psalm 34:18 has been on my heart for you. ❤️', createdAt: ago(60) },
      ],
    },
    {
      id: 'c-samuel',
      partyId: 'u-samuel',
      partyName: 'Samuel Foust',
      kind: 'user',
      lastReadAt: new Date().toISOString(), // read
      messages: [
        { id: 'sm-1', conversationId: 'c-samuel', senderId: 'u-samuel', senderName: 'Samuel Foust', text: 'Are you coming to the hymn sing on Saturday?', createdAt: ago(1500) },
        { id: 'sm-2', conversationId: 'c-samuel', senderId: ME, senderName: 'You', text: 'Wouldn’t miss it! See you there.', createdAt: ago(1440) },
      ],
    },
  ];
}

interface MessagesContextValue {
  conversations: Conversation[]; // sorted by most recent activity
  getConversation: (id: string) => Conversation | undefined;
  unreadCount: (c: Conversation) => number;
  unreadTotal: number;
  send: (conversationId: string, text: string) => void;
  markRead: (conversationId: string) => void;
  startConversation: (partyId: string, partyName: string) => string; // returns id
}

const MessagesContext = createContext<MessagesContextValue | undefined>(undefined);

const lastMsgTime = (c: Conversation) => c.messages[c.messages.length - 1]?.createdAt ?? '';
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e5).toString(36)}`;

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(seed);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setConversations(JSON.parse(raw) as Conversation[]);
        } catch {
          /* keep seed */
        }
      }
    });
  }, []);

  const persist = useCallback((next: Conversation[]) => {
    setConversations(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const unreadCount = useCallback(
    (c: Conversation) => c.messages.filter((m) => m.senderId !== ME && m.createdAt > c.lastReadAt).length,
    [],
  );

  const send = useCallback(
    (conversationId: string, text: string) => {
      const body = text.trim();
      if (!body) return;
      const msg: ChatMessage = { id: uid('m'), conversationId, senderId: ME, senderName: 'You', text: body, createdAt: new Date().toISOString() };
      persist(
        conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, msg], lastReadAt: msg.createdAt } : c,
        ),
      );
    },
    [conversations, persist],
  );

  const markRead = useCallback(
    (conversationId: string) => {
      setConversations((prev) => {
        const next = prev.map((c) => (c.id === conversationId ? { ...c, lastReadAt: new Date().toISOString() } : c));
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const startConversation = useCallback(
    (partyId: string, partyName: string): string => {
      const existing = conversations.find((c) => c.partyId === partyId);
      if (existing) return existing.id;
      const conv: Conversation = { id: uid('c'), partyId, partyName, kind: 'user', lastReadAt: new Date().toISOString(), messages: [] };
      persist([conv, ...conversations]);
      return conv.id;
    },
    [conversations, persist],
  );

  const value = useMemo<MessagesContextValue>(() => {
    const sorted = [...conversations].sort((a, b) => (lastMsgTime(a) < lastMsgTime(b) ? 1 : -1));
    return {
      conversations: sorted,
      getConversation: (id) => conversations.find((c) => c.id === id),
      unreadCount,
      unreadTotal: conversations.reduce((n, c) => n + unreadCount(c), 0),
      send,
      markRead,
      startConversation,
    };
  }, [conversations, unreadCount, send, markRead, startConversation]);

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages(): MessagesContextValue {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within a MessagesProvider');
  return ctx;
}
