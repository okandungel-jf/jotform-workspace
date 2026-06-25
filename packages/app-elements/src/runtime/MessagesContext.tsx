import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

// ============================================
// Types — the messaging data model (Wave 6).
// Lives at the app-elements layer so both the runtime components and the
// builder (seed + persistence) can share it. Persisted under appData.
// ============================================

export interface AppUser {
  id: string;
  name: string;
  /** Avatar image URL. Falls back to initials / User icon when absent. */
  avatar?: string;
  presence?: 'online' | 'offline' | 'away';
  /** Optional one-line subtitle (role, handle, etc.). */
  subtitle?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  /** AppUser id of the sender (or the current user's id). */
  senderId: string;
  text: string;
  /** Epoch ms. */
  sentAt: number;
}

export interface Conversation {
  id: string;
  /** [currentUserId, otherUserId] for 1:1 (group deferred to Wave 6b). */
  participantIds: string[];
  lastMessageAt: number;
  unreadCount?: number;
}

export interface MessagesContextValue {
  currentUserId: string;
  users: AppUser[];
  /** Directory = all users except the current one (the people you can message). */
  directory: AppUser[];
  conversations: Conversation[];
  userById(id: string): AppUser | undefined;
  messagesFor(conversationId: string): Message[];
  /** Get-or-create the 1:1 conversation with a user. */
  conversationWith(userId: string): Conversation;
  /** The non-current participant of a conversation. */
  otherParticipant(conversation: Conversation): AppUser | undefined;
  send(conversationId: string, text: string): void;
  markRead(conversationId: string): void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

/** Returns null on the builder canvas (no provider) so elements stay inert there. */
export function useMessages() {
  return useContext(MessagesContext);
}

let idCounter = 0;
function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;
}

/** Canned replies — the prototype simulates the other side with no backend. */
const CANNED_REPLIES = [
  'Sounds good! 👍',
  'Let me check and get back to you.',
  'Thanks for the message!',
  'Got it — talk soon.',
  'Sure, that works for me.',
  'Appreciate it 🙏',
];

interface MessagesProviderProps {
  children: ReactNode;
  currentUserId: string;
  users: AppUser[];
  initialConversations?: Conversation[];
  initialMessages?: Message[];
  /** Simulated auto-reply after sending. Disabled on the inert canvas preview. */
  autoReply?: boolean;
}

export function MessagesProvider({
  children,
  currentUserId,
  users,
  initialConversations = [],
  initialMessages = [],
  autoReply = true,
}: MessagesProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const replyTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear any pending simulated replies on unmount.
  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const userById = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const messagesFor = useCallback(
    (conversationId: string) =>
      messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => a.sentAt - b.sentAt),
    [messages],
  );

  const conversationWith = useCallback(
    (userId: string): Conversation => {
      const existing = conversations.find(
        (c) => c.participantIds.includes(userId) && c.participantIds.includes(currentUserId),
      );
      if (existing) return existing;
      const created: Conversation = {
        id: makeId('conv'),
        participantIds: [currentUserId, userId],
        lastMessageAt: Date.now(),
        unreadCount: 0,
      };
      setConversations((prev) => [created, ...prev]);
      return created;
    },
    [conversations, currentUserId],
  );

  const otherParticipant = useCallback(
    (conversation: Conversation) => {
      const otherId = conversation.participantIds.find((id) => id !== currentUserId);
      return otherId ? userById(otherId) : undefined;
    },
    [currentUserId, userById],
  );

  const send = useCallback(
    (conversationId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const sentAt = Date.now();
      const mine: Message = { id: makeId('msg'), conversationId, senderId: currentUserId, text: trimmed, sentAt };
      setMessages((prev) => [...prev, mine]);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, lastMessageAt: sentAt } : c)),
      );

      if (!autoReply) return;
      const conv = conversations.find((c) => c.id === conversationId);
      const otherId = conv?.participantIds.find((id) => id !== currentUserId);
      if (!otherId) return;
      const reply = CANNED_REPLIES[messages.length % CANNED_REPLIES.length];
      const timer = setTimeout(() => {
        const repliedAt = Date.now();
        setMessages((prev) => [
          ...prev,
          { id: makeId('msg'), conversationId, senderId: otherId, text: reply, sentAt: repliedAt },
        ]);
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, lastMessageAt: repliedAt } : c)),
        );
      }, 900);
      replyTimers.current.push(timer);
    },
    [autoReply, conversations, currentUserId, messages.length],
  );

  const markRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    );
  }, []);

  const directory = useMemo(() => users.filter((u) => u.id !== currentUserId), [users, currentUserId]);

  const value = useMemo<MessagesContextValue>(
    () => ({
      currentUserId,
      users,
      directory,
      conversations,
      userById,
      messagesFor,
      conversationWith,
      otherParticipant,
      send,
      markRead,
    }),
    [currentUserId, users, directory, conversations, userById, messagesFor, conversationWith, otherParticipant, send, markRead],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
