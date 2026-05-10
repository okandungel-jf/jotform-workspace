import { Icon, Button as DSButton } from '@jf/design-system'
import { QrPlaceholder } from './QrPlaceholder'

export function QrPopover() {
  return (
    <div className="qr-popover" role="dialog" aria-label="Preview QR code">
      <div className="qr-popover__header">
        <p className="qr-popover__title">See app in action</p>
        <p className="qr-popover__description">Use your camera to scan the QR code and preview the app on your device.</p>
      </div>
      <div className="qr-popover__qr-area">
        <QrPlaceholder size={120} className="qr-popover__qr-icon" />
      </div>
      <div className="qr-popover__actions">
        <DSButton
          className="qr-popover__action"
          variant="filled"
          colorScheme="secondary"
          size="sm"
          leftIcon={<Icon name="arrow-up-right-from-square" category="arrows" size={16} />}
        >
          Open
        </DSButton>
        <DSButton
          className="qr-popover__action"
          variant="filled"
          colorScheme="secondary"
          size="sm"
          leftIcon={<Icon name="arrow-down-to-line" category="arrows" size={16} />}
        >
          Download
        </DSButton>
      </div>
    </div>
  )
}
