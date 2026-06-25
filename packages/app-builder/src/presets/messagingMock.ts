import type { AppUser, Conversation, Message } from '@jf/app-elements'

// ============================================
// Mock identity + seed conversations (Wave 6, prototype only).
// No backend / real auth exists yet (App Users = Wave 2), so messaging
// fabricates a small app-user directory + a couple of seeded threads.
// Avatars use the initials fallback — no external image URLs to break.
// ============================================

/** The device's current app user in the preview. */
export const CURRENT_USER_ID = 'me'

export const MOCK_APP_USERS: AppUser[] = [
  { id: CURRENT_USER_ID, name: 'You', presence: 'online' },
  { id: 'u_alex', name: 'Alex Rivera', subtitle: 'Product Designer', presence: 'online' },
  { id: 'u_sam', name: 'Sam Carter', subtitle: 'Event Organizer', presence: 'away' },
  { id: 'u_maya', name: 'Maya Patel', subtitle: 'Volunteer Lead', presence: 'online' },
  { id: 'u_jordan', name: 'Jordan Lee', subtitle: 'Customer', presence: 'offline' },
  { id: 'u_nina', name: 'Nina Brooks', subtitle: 'Coach', presence: 'offline' },
  { id: 'u_omar', name: 'Omar Haddad', subtitle: 'Member', presence: 'away' },
]

const MIN = 60_000
const NOW = Date.now()

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'conv_alex', participantIds: [CURRENT_USER_ID, 'u_alex'], lastMessageAt: NOW - 2 * MIN, unreadCount: 2 },
  { id: 'conv_sam', participantIds: [CURRENT_USER_ID, 'u_sam'], lastMessageAt: NOW - 45 * MIN, unreadCount: 0 },
  { id: 'conv_maya', participantIds: [CURRENT_USER_ID, 'u_maya'], lastMessageAt: NOW - 3 * 60 * MIN, unreadCount: 1 },
  { id: 'conv_jordan', participantIds: [CURRENT_USER_ID, 'u_jordan'], lastMessageAt: NOW - 26 * 60 * MIN, unreadCount: 0 },
  { id: 'conv_nina', participantIds: [CURRENT_USER_ID, 'u_nina'], lastMessageAt: NOW - 2 * 24 * 60 * MIN, unreadCount: 0 },
  { id: 'conv_omar', participantIds: [CURRENT_USER_ID, 'u_omar'], lastMessageAt: NOW - 5 * 24 * 60 * MIN, unreadCount: 0 },
]

export const MOCK_MESSAGES: Message[] = [
  // Alex — recent, unread
  { id: 'm_a1', conversationId: 'conv_alex', senderId: 'u_alex', text: 'Hey! Did you get a chance to look at the new layout?', sentAt: NOW - 9 * MIN },
  { id: 'm_a2', conversationId: 'conv_alex', senderId: CURRENT_USER_ID, text: 'Yes — looks great. Just a couple of notes.', sentAt: NOW - 7 * MIN },
  { id: 'm_a3', conversationId: 'conv_alex', senderId: 'u_alex', text: 'Awesome, send them over whenever 🙌', sentAt: NOW - 3 * MIN },
  { id: 'm_a4', conversationId: 'conv_alex', senderId: 'u_alex', text: 'No rush at all.', sentAt: NOW - 2 * MIN },
  // Sam
  { id: 'm_s1', conversationId: 'conv_sam', senderId: 'u_sam', text: 'Are we still on for the event walkthrough?', sentAt: NOW - 50 * MIN },
  { id: 'm_s2', conversationId: 'conv_sam', senderId: CURRENT_USER_ID, text: 'Absolutely, see you at 3.', sentAt: NOW - 45 * MIN },
  // Maya — unread
  { id: 'm_m1', conversationId: 'conv_maya', senderId: 'u_maya', text: 'Thank you for organizing the volunteers!', sentAt: NOW - 3 * 60 * MIN },
  // Jordan
  { id: 'm_j1', conversationId: 'conv_jordan', senderId: 'u_jordan', text: 'Is my order ready for pickup?', sentAt: NOW - 27 * 60 * MIN },
  { id: 'm_j2', conversationId: 'conv_jordan', senderId: CURRENT_USER_ID, text: 'It will be ready by tomorrow morning.', sentAt: NOW - 26 * 60 * MIN },
]
