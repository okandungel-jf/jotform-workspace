import { useCart, AppIcon } from '@jf/app-elements'

interface LivePreviewCartButtonProps {
  onClick?: () => void
}

export function LivePreviewCartButton({ onClick }: LivePreviewCartButtonProps) {
  const cart = useCart()
  const count = cart?.count ?? 0
  return (
    <button
      type="button"
      className="live-preview__cart-btn"
      aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
      onClick={onClick}
    >
      <AppIcon name="ShoppingCart" size={20} />
      {count > 0 && (
        <span className="live-preview__cart-badge" aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
