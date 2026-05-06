import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '@jf/design-system'

type View = 'login' | 'signup'

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
]

const SIGNUP_PROVIDERS = [
  { id: 'google', label: 'Google', icon: 'google-color' },
  { id: 'microsoft', label: 'Microsoft', icon: 'microsoft-color' },
]

export function LivePreviewLoginPopover({
  open,
  onClose,
  onLoggedIn,
}: LivePreviewLoginPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (open) setView('login')
  }, [open])

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
    <div
      ref={ref}
      className="live-preview__login-popover app-scope"
      role="dialog"
      aria-label={view === 'login' ? 'Log in' : 'Sign up'}
    >
      {view === 'login' ? (
        <>
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
            <button
              type="button"
              className="live-preview__login-popover-link"
              onClick={() => setView('signup')}
            >
              Sign up
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="live-preview__login-popover-signup-providers">
            {SIGNUP_PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="live-preview__login-popover-signup-provider"
              >
                <Icon name={p.icon} category="brands" size={24} />
                <span>Sign up with {p.label}</span>
              </button>
            ))}
          </div>

          <div className="live-preview__login-popover-divider">
            <span>OR</span>
          </div>

          <button type="button" className="live-preview__login-popover-email-signup">
            <Icon name="envelope-closed-filled" category="communication" size={20} />
            <span>Sign up with Email</span>
          </button>

          <div className="live-preview__login-popover-footer">
            Already have an account?{' '}
            <button
              type="button"
              className="live-preview__login-popover-link"
              onClick={() => setView('login')}
            >
              Log in
            </button>
          </div>
        </>
      )}
    </div>
  )
}
