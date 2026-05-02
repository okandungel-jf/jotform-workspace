import { Badge, Button, Icon, Input } from '@jf/design-system'

const SHARE_URL = 'https://www.jotform.com/agent/019258399c697472a8b3a22bcd7b1fcae586'

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M17.6 14.5c-.3-.2-1.7-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.3 3.1c.2.2 2.2 3.4 5.4 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.1-1.3c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.8-3.1-.2-.3C3.9 14.7 3.5 13.4 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8.3 18H5.7V9.7h2.6V18zM7 8.5C6.2 8.5 5.5 7.8 5.5 7s.7-1.5 1.5-1.5S8.5 6.2 8.5 7 7.8 8.5 7 8.5zM18 18h-2.6v-4.4c0-1.2-.4-2-1.5-2-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V18H9.6V9.7h2.6v1.1c.3-.5 1-1.3 2.4-1.3 1.7 0 3.3 1.1 3.3 3.6V18z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M14.3 10.5L21 3h-1.6l-5.8 6.5L9 3H3l7 9.9L3 21h1.6l6.1-6.9L15.6 21H21l-6.7-10.5zm-2.2 2.4l-.7-1L5.2 4.2h2.5l4.5 6.4.7 1 5.9 8.3h-2.5l-4.7-6.7z" />
    </svg>
  )
}

interface SocialActionProps {
  icon: React.ReactNode
  label: string
}

function SocialAction({ icon, label }: SocialActionProps) {
  return (
    <button type="button" className="quick-share-panel__social">
      <span className="quick-share-panel__social-icon">{icon}</span>
      <span className="quick-share-panel__social-label">{label}</span>
    </button>
  )
}

export function QuickSharePanel() {
  return (
    <section className="quick-share-panel">
      <div className="quick-share-panel__topbar">
        <Badge
          status="success"
          shape="rounded"
          emphasis="outlined"
          size="lg"
          icon={<Icon name="unlock-filled" category="security" size={16} />}
        >
          Public Access
        </Badge>
        <p className="quick-share-panel__topbar-desc">Anyone with the link can see the app.</p>
        <button type="button" className="quick-share-panel__settings">
          <Icon name="gear-filled" category="general" size={16} />
          <span>Settings</span>
        </button>
      </div>

      <div className="quick-share-panel__body">
        <div className="quick-share-panel__share">
          <div className="quick-share-panel__qr" aria-label="App QR code preview">
            <Icon name="qr" category="media" size={64} />
          </div>
          <div className="quick-share-panel__share-controls">
            <Input
              readOnly
              value={SHARE_URL}
              leftContent={<Icon name="link-diagonal" category="general" size={20} />}
            />
            <div className="quick-share-panel__share-actions">
              <Button colorScheme="constructive">Copy Link</Button>
              <Button colorScheme="primary">Open New Tab</Button>
            </div>
          </div>
        </div>

        <div className="quick-share-panel__divider" />

        <div className="quick-share-panel__socials">
          <SocialAction icon={<Icon name="qr" category="media" size={24} />} label="QR Code" />
          <SocialAction icon={<WhatsappIcon />} label="Whatsapp" />
          <SocialAction icon={<FacebookIcon />} label="Facebook" />
          <SocialAction icon={<LinkedinIcon />} label="Linkedin" />
          <SocialAction icon={<TwitterIcon />} label="Twitter" />
        </div>
      </div>
    </section>
  )
}
