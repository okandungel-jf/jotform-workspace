import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '@jf/design-system'

interface LivePreviewLoginPopoverProps {
  open: boolean
  onClose: () => void
  onLoggedIn?: () => void
}

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: 'google-color' },
  { id: 'microsoft', label: 'Microsoft', icon: 'microsoft-color' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook-circle-color' },
  { id: 'apple', label: 'Apple', icon: 'apple-filled' },
  { id: 'salesforce', label: 'Salesforce', icon: 'salesforce-color' },
]

export function LivePreviewLoginPopover({
  open,
  onClose,
  onLoggedIn,
}: LivePreviewLoginPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onLoggedIn?.()
    onClose()
  }

  return (
    <div ref={ref} className="live-preview__login-popover app-scope" role="dialog" aria-label="Log in">
      <div className="live-preview__login-popover-providers">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="live-preview__login-popover-provider">
            <button
              type="button"
              className="live-preview__login-popover-provider-btn"
              aria-label={`Continue with ${p.label}`}
            >
              <Icon name={p.icon} category="brands" size={24} />
            </button>
            <span className="live-preview__login-popover-provider-label">{p.label}</span>
          </div>
        ))}
      </div>

      <div className="live-preview__login-popover-divider">
        <span>OR</span>
      </div>

      <form className="live-preview__login-popover-form" onSubmit={handleSubmit}>
        <div className="live-preview__login-popover-field">
          <label htmlFor="login-popover-email" className="live-preview__login-popover-label">
            Email address or username
          </label>
          <input
            id="login-popover-email"
            type="text"
            className="live-preview__login-popover-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>

        <div className="live-preview__login-popover-field">
          <label htmlFor="login-popover-password" className="live-preview__login-popover-label">
            Password
          </label>
          <input
            id="login-popover-password"
            type="password"
            className="live-preview__login-popover-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="button" className="live-preview__login-popover-forgot">
          Forgot password?
        </button>

        <button type="submit" className="live-preview__login-popover-submit">
          Log in
        </button>
      </form>

      <div className="live-preview__login-popover-footer">
        Don&apos;t have an account?{' '}
        <button type="button" className="live-preview__login-popover-signup">
          Sign up
        </button>
      </div>
    </div>
  )
}
