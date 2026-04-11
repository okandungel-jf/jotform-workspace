import { useState } from 'react'
import { TopBar } from './shell/TopBar.tsx'
import { BuildPage } from './pages/BuildPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'
import { PublishPage } from './pages/PublishPage.tsx'

type Page = 'build' | 'settings' | 'publish'

export function App() {
  const [activePage, setActivePage] = useState<Page>('build')

  return (
    <div className="builder">
      <TopBar activePage={activePage} onPageChange={setActivePage} />
      <div className="builder__content">
        {activePage === 'build' && <BuildPage />}
        {activePage === 'settings' && <SettingsPage />}
        {activePage === 'publish' && <PublishPage />}
      </div>
    </div>
  )
}
