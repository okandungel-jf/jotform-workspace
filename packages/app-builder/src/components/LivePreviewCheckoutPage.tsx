import { useState } from 'react'
import { AppIcon, Button, useCart, type CartItem } from '@jf/app-elements'

interface LivePreviewCheckoutPageProps {
  open: boolean
  onClose: () => void
  avatarUrl: string
  currency?: string
}

function totalPrice(items: CartItem[]): string {
  const sum = items.reduce((acc, item) => {
    const num = parseFloat(String(item.price).replace(/[^0-9.]/g, ''))
    return acc + (isNaN(num) ? 0 : num)
  }, 0)
  return sum.toFixed(2)
}

export function LivePreviewCheckoutPage({
  open,
  onClose,
  avatarUrl,
  currency = '$',
}: LivePreviewCheckoutPageProps) {
  const cart = useCart()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  if (!open) return null

  const items = cart?.items ?? []
  const total = totalPrice(items)

  return (
    <aside className="live-preview__checkout-page app-scope" role="dialog" aria-label="Checkout">
      <header className="live-preview__checkout-header">
        <button
          type="button"
          className="live-preview__checkout-back"
          aria-label="Back"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="live-preview__checkout-title">Checkout</h1>
        <img className="live-preview__checkout-avatar" src={avatarUrl} alt="" aria-hidden="true" />
      </header>

      <div className="live-preview__checkout-body">
        <div className="live-preview__checkout-section-title">
          <span className="live-preview__checkout-section-icon">
            <AppIcon name="IdCard" size={24} />
          </span>
          <span>Contact Information</span>
        </div>

        <div className="jf-form-open__section">
          <div className="jf-form-open__field">
            <label className="jf-form-open__label">
              Full Name <span className="live-preview__checkout-required">*</span>
            </label>
            <div className="jf-form-open__row">
              <div className="jf-form-open__field">
                <input
                  className="jf-form-open__input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <span className="jf-form-open__hint">First Name</span>
              </div>
              <div className="jf-form-open__field">
                <input
                  className="jf-form-open__input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <span className="jf-form-open__hint">Last Name</span>
              </div>
            </div>
          </div>

          <div className="jf-form-open__field">
            <label className="jf-form-open__label">
              Email <span className="live-preview__checkout-required">*</span>
            </label>
            <input
              className="jf-form-open__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="jf-form-open__hint">example@example.com</span>
          </div>
        </div>
      </div>

      <div className="live-preview__checkout-cta">
        <Button
          variant="Default"
          corner="Default"
          size="Small"
          fullWidth
          leftIcon="none"
          rightIcon="none"
          label={`Order ${currency}${total}`}
        />
      </div>
    </aside>
  )
}
