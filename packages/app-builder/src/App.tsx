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
  // Empty App is a sandbox — never restore from storage.
  const titleForPreset = (id: string) =>
    id === EMPTY_PRESET_ID ? getPresetById(id).appTitle : (loadStoredAppTitle(id) ?? getPresetById(id).appTitle)
  const [appTitle, setAppTitle] = useState(() => titleForPreset(EMPTY_PRESET_ID))

  const handlePresetChange = (id: string) => {
    setActivePresetId(id)
    setAppTitle(titleForPreset(id))
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
          // Empty App never reads from storage — always show its preset name.
          if (p.id === EMPTY_PRESET_ID) return { id: p.id, name: p.name }
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
