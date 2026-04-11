type Page = 'build' | 'settings' | 'publish'

interface TopBarProps {
  activePage: Page
  onPageChange: (page: Page) => void
}

const PAGES: { id: Page; label: string }[] = [
  { id: 'build', label: 'BUILD' },
  { id: 'settings', label: 'SETTINGS' },
  { id: 'publish', label: 'PUBLISH' },
]

export function TopBar({ activePage, onPageChange }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <span className="topbar__logo">Jotform</span>
        <span className="topbar__separator">|</span>
        <span className="topbar__title">App Builder</span>
      </div>
      <nav className="topbar__nav">
        {PAGES.map((page) => (
          <button
            key={page.id}
            className={`topbar__nav-item ${activePage === page.id ? 'topbar__nav-item--active' : ''}`}
            onClick={() => onPageChange(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>
      <div className="topbar__right">
        <span className="topbar__app-name">New App</span>
      </div>
    </header>
  )
}
