import { useState } from 'react'

type RightPanelMode = 'preview' | 'designer' | 'properties'

export function BuildPage() {
  const [rightPanel, setRightPanel] = useState<RightPanelMode>('preview')

  return (
    <div className="build-page">
      {/* Left Panel - App Elements */}
      <aside className="build-page__left">
        <div className="build-page__panel-header">
          <h2>App Elements</h2>
        </div>
        <div className="build-page__elements">
          <p className="build-page__placeholder">Elements will be listed here</p>
        </div>
      </aside>

      {/* Canvas - App Preview (CSS scoped, app-elements tokens) */}
      <main className="build-page__canvas">
        <div className="app-scope">
          <div className="build-page__canvas-content">
            <p className="build-page__drop-zone">
              Drag your first element here from left.
            </p>
          </div>
        </div>
      </main>

      {/* Right Panel - Designer/Properties or Live Preview */}
      <aside className="build-page__right">
        {rightPanel === 'preview' ? (
          <div className="build-page__live-preview">
            <div className="build-page__device-frame">
              <p>Live Preview (iframe)</p>
            </div>
          </div>
        ) : (
          <div className="build-page__designer">
            <div className="build-page__panel-header">
              <h2>App Designer</h2>
              <nav>
                <button
                  className={rightPanel === 'designer' ? 'active' : ''}
                  onClick={() => setRightPanel('designer')}
                >
                  GENERAL
                </button>
                <button
                  className={rightPanel === 'properties' ? 'active' : ''}
                  onClick={() => setRightPanel('properties')}
                >
                  PROPERTIES
                </button>
              </nav>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
