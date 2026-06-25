import { useState } from 'react'
import { Avatar, Badge, Button, Input, AppIcon as Icon, useMessages, type Conversation } from '@jf/app-elements'
import './MessagingPreview.scss'

/** "5m", "3h", "2d", or a short date — relative time for conversation rows. */
function formatTime(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'now'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/**
 * Self-contained Chat surface (Wave 6). Owns its entire chrome: a floating
 * launcher (FAB) when closed, and a full-bleed inbox ↔ thread overlay when open.
 * The builder only has to wrap the preview in a MessagesProvider and mount this
 * once — no header/popover wiring. Composed entirely from app-elements
 * (Avatar / Badge / Input / Button / Icon) so it stays theme-reactive.
 */
export function MessagingPreview() {
  const messages = useMessages()
  const [open, setOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  // No provider (builder canvas) — render nothing, stay inert.
  if (!messages) return null

  const { conversations, messagesFor, otherParticipant, send, markRead, directory, conversationWith } = messages

  const openConversation = (conv: Conversation) => {
    markRead(conv.id)
    setOpenId(conv.id)
  }

  // ---- Closed: floating launcher ----
  if (!open) {
    const totalUnread = conversations.reduce((n, c) => n + (c.unreadCount ?? 0), 0)
    return (
      <button className="msg-fab app-scope" onClick={() => setOpen(true)} aria-label="Messages">
        <Icon name="MessageCircle" size={24} />
        {totalUnread > 0 && (
          <span className="msg-fab__badge">
            <Badge count={totalUnread} tone="danger" />
          </span>
        )}
      </button>
    )
  }

  // ---- Thread view ----
  const openConv = openId ? conversations.find((c) => c.id === openId) : null
  if (openConv) {
    const peer = otherParticipant(openConv)
    const thread = messagesFor(openConv.id)
    return (
      <div className="msg-preview app-scope">
        <header className="msg-preview__thread-bar">
          <button className="msg-preview__icon-btn" onClick={() => setOpenId(null)} aria-label="Back">
            <Icon name="ChevronLeft" size={22} />
          </button>
          <Avatar name={peer?.name} image={peer?.avatar} size={36} presence={peer?.presence} />
          <div className="msg-preview__thread-meta">
            <span className="msg-preview__thread-name">{peer?.name ?? 'Conversation'}</span>
            {peer?.presence && peer.presence !== 'offline' && (
              <span className="msg-preview__thread-presence">{peer.presence === 'online' ? 'Active now' : 'Away'}</span>
            )}
          </div>
        </header>

        <div className="msg-preview__bubbles">
          {thread.map((m) => {
            const mine = m.senderId === messages.currentUserId
            return (
              <div key={m.id} className={`msg-preview__bubble-row${mine ? ' msg-preview__bubble-row--mine' : ''}`}>
                <div className={`msg-preview__bubble${mine ? ' msg-preview__bubble--mine' : ''}`}>
                  <span className="msg-preview__bubble-text">{m.text}</span>
                  <span className="msg-preview__bubble-time">{formatTime(m.sentAt)}</span>
                </div>
              </div>
            )
          })}
        </div>

        <Composer onSend={(text) => send(openConv.id, text)} />
      </div>
    )
  }

  // ---- Inbox view ----
  // Conversations newest-first; directory users with no thread yet are appended.
  const sorted = [...conversations].sort((a, b) => b.lastMessageAt - a.lastMessageAt)
  const withConversation = new Set(sorted.map((c) => otherParticipant(c)?.id))
  const freshUsers = directory.filter((u) => !withConversation.has(u.id))

  return (
    <div className="msg-preview app-scope">
      <header className="msg-preview__inbox-bar">
        <span className="msg-preview__inbox-title">Messages</span>
        <button className="msg-preview__icon-btn" onClick={() => setOpen(false)} aria-label="Close">
          <Icon name="X" size={20} />
        </button>
      </header>

      <div className="msg-preview__list">
        {sorted.map((conv) => {
          const peer = otherParticipant(conv)
          const last = messagesFor(conv.id).slice(-1)[0]
          const lastText = last
            ? `${last.senderId === messages.currentUserId ? 'You: ' : ''}${last.text}`
            : 'Tap to start a conversation'
          return (
            <button key={conv.id} className="msg-preview__row" onClick={() => openConversation(conv)}>
              <Avatar name={peer?.name} image={peer?.avatar} size={48} presence={peer?.presence} />
              <div className="msg-preview__row-main">
                <div className="msg-preview__row-top">
                  <span className="msg-preview__row-name">{peer?.name}</span>
                  <span className="msg-preview__row-time">{formatTime(conv.lastMessageAt)}</span>
                </div>
                <div className="msg-preview__row-bottom">
                  <span className="msg-preview__row-preview">{lastText}</span>
                  {!!conv.unreadCount && <Badge count={conv.unreadCount} />}
                </div>
              </div>
            </button>
          )
        })}

        {freshUsers.length > 0 && (
          <div className="msg-preview__section-label">Start a new chat</div>
        )}
        {freshUsers.map((user) => (
          <button
            key={user.id}
            className="msg-preview__row"
            onClick={() => openConversation(conversationWith(user.id))}
          >
            <Avatar name={user.name} image={user.avatar} size={48} presence={user.presence} />
            <div className="msg-preview__row-main">
              <div className="msg-preview__row-top">
                <span className="msg-preview__row-name">{user.name}</span>
              </div>
              <div className="msg-preview__row-bottom">
                <span className="msg-preview__row-preview">{user.subtitle ?? 'Say hello 👋'}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }
  return (
    <div className="msg-preview__composer">
      <Input
        value={text}
        placeholder="Message…"
        ariaLabel="Message"
        onChange={setText}
        onSubmit={submit}
        rightSlot={
          <Button
            iconOnly
            iconOnlyIcon="Send"
            corner="Rounded"
            size="Default"
            onClick={submit}
          />
        }
      />
    </div>
  )
}
