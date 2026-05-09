import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@jf/design-system'
import { QuickSharePanel } from './QuickSharePanel'

export type PreviewDevice = 'phone' | 'tablet' | 'desktop'

interface AppPreviewScreenProps {
  device: PreviewDevice
  onDeviceChange: (device: PreviewDevice) => void
  onBack: () => void
  phoneScreen?: ReactNode
}

const DEVICE_TABS: { id: PreviewDevice; label: string; icon: string }[] = [
  { id: 'phone', label: 'Phone', icon: 'mobile' },
  { id: 'tablet', label: 'Tablet', icon: 'tablet' },
  { id: 'desktop', label: 'Desktop', icon: 'desktop' },
]

export function AppPreviewScreen({ device, onDeviceChange, onBack, phoneScreen }: AppPreviewScreenProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const shareWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shareOpen) return
    const onDown = (e: MouseEvent) => {
      if (shareWrapRef.current && !shareWrapRef.current.contains(e.target as Node)) {
        setShareOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [shareOpen])

  return (
    <div className="app-preview-screen" role="dialog" aria-label="App preview">
      <header className="app-preview-screen__bar">
        <button type="button" className="app-preview-screen__back" onClick={onBack}>
          <Icon name="chevron-left" category="arrows" size={20} />
          <span>Back to builder</span>
        </button>
        <div className="app-preview-screen__tabs" role="tablist">
          {DEVICE_TABS.map((tab) => {
            const isActive = tab.id === device
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`app-preview-screen__tab${isActive ? ' app-preview-screen__tab--active' : ''}`}
                onClick={() => onDeviceChange(tab.id)}
              >
                <Icon name={tab.icon} category="technology" size={24} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <div className="app-preview-screen__share-wrap" ref={shareWrapRef}>
          <button
            type="button"
            className="app-preview-screen__share-btn"
            aria-haspopup="dialog"
            aria-expanded={shareOpen}
            onClick={() => setShareOpen((v) => !v)}
          >
            <Icon name="qr" category="media" size={20} />
            <span>Try on your device</span>
          </button>
          {shareOpen && (
            <div className="app-preview-screen__share-popover" role="dialog" aria-label="Share app">
              <QuickSharePanel />
            </div>
          )}
        </div>
      </header>
      <div className="app-preview-screen__canvas">
        {device === 'phone' ? (
          <div className="live-preview__phone app-preview-screen__phone">
            <div className="live-preview__phone-shell app-scope" />
            <div className="live-preview__phone-bezel" />
            <div className="live-preview__phone-screen">{phoneScreen}</div>
          </div>
        ) : (
          <div className={`app-preview-screen__viewport app-preview-screen__viewport--${device}`} />
        )}
      </div>
    </div>
  )
}
