import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './styles/app.scss'

// Design System styles (builder UI fonts, tokens)
import '@jf/design-system/src/styles/app.scss'

// App Elements tokens & component styles (for canvas area)
import '@jf/app-elements/styles'

import { APP_PRESETS } from './presets/appPresets.ts'
import { initStorage } from './presets/storage.ts'

const presetIds = APP_PRESETS.map((p) => p.id)

initStorage(presetIds).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
