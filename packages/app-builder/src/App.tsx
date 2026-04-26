import { useState, useMemo } from 'react'
import { IconLibraryProvider } from '@jf/app-elements'
import { TopBar } from './shell/TopBar.tsx'
import { BuildPage } from './pages/BuildPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'
import { PublishPage } from './pages/PublishPage.tsx'
import { APP_PRESETS, EMPTY_PRESET_ID, getPresetById } from './presets/appPresets.ts'
import { loadStoredAppTitle } from './presets/storage.ts'

type Page = 'build' | 'settings' | 'publish'

export function App() {
  const [activePage, setActivePage] = useState<Page>('build')
  const [previewMode, setPreviewMode] = useState(true)
  const [activePresetId, setActivePresetId] = useState<string>(EMPTY_PRESET_ID)
  const preset = useMemo(() => getPresetById(activePresetId), [activePresetId])
  const [appTitle, setAppTitle] = useState(() => loadStoredAppTitle(EMPTY_PRESET_ID) ?? preset.appTitle)

  const handlePresetChange = (id: string) => {
    setActivePresetId(id)
    setAppTitle(loadStoredAppTitle(id) ?? getPresetById(id).appTitle)
  }

  return (
    <IconLibraryProvider>
    <div className="builder">
      <TopBar
        activePage={activePage}
        onPageChange={setActivePage}
        previewMode={previewMode}
        onPreviewToggle={() => setPreviewMode(!previewMode)}
        appName={appTitle}
        presets={APP_PRESETS.map((p) => {
          if (p.id === activePresetId) {
            return { id: p.id, name: appTitle === p.appTitle ? p.name : appTitle }
          }
          const storedTitle = loadStoredAppTitle(p.id)
          return { id: p.id, name: storedTitle && storedTitle !== p.appTitle ? storedTitle : p.name }
        })}
        activePresetId={activePresetId}
        onPresetChange={handlePresetChange}
      />
      <div className="builder__content">
        {activePage === 'build' && (
          <BuildPage
            key={activePresetId}
            preset={preset}
            previewMode={previewMode}
            appTitle={appTitle}
            onAppTitleChange={setAppTitle}
          />
        )}
        {activePage === 'settings' && <SettingsPage />}
        {activePage === 'publish' && <PublishPage />}
      </div>
    </div>
    </IconLibraryProvider>
  )
}
