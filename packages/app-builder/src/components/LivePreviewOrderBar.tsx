import { Button, useCart, type CartItem } from '@jf/app-elements'

interface LivePreviewOrderBarProps {
  hidden: boolean
  hasBottomNav: boolean
  onClick: () => void
  currency?: string
}

function totalPrice(items: CartItem[]): string {
  const sum = items.reduce((acc, item) => {
    const num = parseFloat(String(item.price).replace(/[^0-9.]/g, ''))
    return acc + (isNaN(num) ? 0 : num)
  }, 0)
  return sum.toFixed(2)
}

export function LivePreviewOrderBar({
  hidden,
  hasBottomNav,
  onClick,
  currency = '$',
}: LivePreviewOrderBarProps) {
  const cart = useCart()
  const items = cart?.items ?? []

  if (hidden || items.length === 0) return null

  return (
    <div
      className={`live-preview__order-bar${hasBottomNav ? ' live-preview__order-bar--with-nav' : ''}`}
    >
      <Button
        variant="Default"
        corner="Default"
        size="Small"
        fullWidth
        leftIcon="none"
        rightIcon="none"
        label={`Order Now ${currency}${totalPrice(items)}`}
        onClick={onClick}
      />
    </div>
  )
}
