import { AppIcon } from '@jf/app-elements'

interface MenuPage {
  id: string
  name: string
  icon?: string
}

interface AppHeaderLike {
  icon: string
  imageStyle: 'Image' | 'Icon' | 'None'
  imageUrl?: string | null
}

interface LivePreviewMenuDrawerProps {
  open: boolean
  onClose: () => void
  pages: MenuPage[]
  activePageId: string
  onPageSelect: (pageId: string) => void
  appTitle: string
  appHeader: AppHeaderLike
}

export function LivePreviewMenuDrawer({
  open,
  onClose,
  pages,
  activePageId,
  onPageSelect,
  appTitle,
  appHeader,
}: LivePreviewMenuDrawerProps) {
  const handleSelect = (pageId: string) => {
    onPageSelect(pageId)
    onClose()
  }

  return (
    <div
      className={`live-preview__menu${open ? ' live-preview__menu--open' : ''}`}
      aria-hidden={!open}
    >
      <div className="live-preview__menu-overlay" onClick={onClose} />
      <aside className="live-preview__menu-drawer app-scope" role="dialog" aria-label="App menu">
        <header className="live-preview__menu-header">
          <div className="live-preview__menu-app">
            {appHeader.imageStyle !== 'None' && (
              <span className={`live-preview__menu-app-icon${appHeader.imageStyle === 'Image' && appHeader.imageUrl ? ' live-preview__menu-app-icon--image' : ''}`}>
                {appHeader.imageStyle === 'Image' && appHeader.imageUrl ? (
                  <img src={appHeader.imageUrl} alt="" />
                ) : (
                  <AppIcon name={appHeader.icon} size={24} />
                )}
              </span>
            )}
            <span className="live-preview__menu-app-title">{appTitle}</span>
          </div>
          <button
            type="button"
            className="live-preview__menu-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <nav className="live-preview__menu-list">
          {pages.map((page) => {
            const isActive = page.id === activePageId
            return (
              <button
                key={page.id}
                type="button"
                className={`live-preview__menu-item${isActive ? ' live-preview__menu-item--active' : ''}`}
                onClick={() => handleSelect(page.id)}
              >
                {page.name}
              </button>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
