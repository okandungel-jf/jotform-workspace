import { useState, useEffect, useCallback } from 'react'
import {
  ComponentRegistry,
  IconLibraryProvider,
  AppHeader,
  EmptyState,
  type RegisteredComponent,
  type VariantValues,
  type PropertyValues,
  type StateValues,
} from '@jf/app-elements'

interface CanvasElement {
  id: string
  componentId: string
  variants: VariantValues
  properties: PropertyValues
  states: StateValues
}

let elementCounter = 0

function createCanvasElement(comp: RegisteredComponent): CanvasElement {
  const variants: VariantValues = {}
  for (const [group, config] of Object.entries(comp.variants)) {
    variants[group] = config.default || config.options[0]
  }

  const properties: PropertyValues = {}
  for (const prop of comp.properties) {
    properties[prop.name] = prop.default
  }

  const states: StateValues = {}
  for (const state of comp.states) {
    states[state.name] = state.default || false
  }

  return {
    id: `element-${++elementCounter}`,
    componentId: comp.id,
    variants,
    properties,
    states,
  }
}

type RightPanelMode = 'preview' | 'designer' | 'properties'

export function BuildPage() {
  const [rightPanel, setRightPanel] = useState<RightPanelMode>('preview')
  const [components, setComponents] = useState<RegisteredComponent[]>(ComponentRegistry.getAll())
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  useEffect(() => {
    return ComponentRegistry.subscribe(() => {
      setComponents(ComponentRegistry.getAll())
    })
  }, [])

  const HIDDEN_ELEMENTS = ['empty-state', 'app-header', 'bottom-navigation', 'color-picker']

  const categories = components
    .filter((comp) => !HIDDEN_ELEMENTS.includes(comp.id))
    .reduce<Record<string, RegisteredComponent[]>>((acc, comp) => {
      const cat = comp.category || 'General'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(comp)
      return acc
    }, {})

  const handleAddElement = useCallback((comp: RegisteredComponent) => {
    const element = createCanvasElement(comp)
    setCanvasElements((prev) => [...prev, element])
    setSelectedElementId(element.id)
    setRightPanel('properties')
  }, [])

  const handleSelectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId)
    setRightPanel('properties')
  }, [])

  const handleRemoveElement = useCallback((elementId: string) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== elementId))
    setSelectedElementId((prev) => (prev === elementId ? null : prev))
    setRightPanel('preview')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handleRemoveElement(selectedElementId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, handleRemoveElement])

  const handlePropertyChange = useCallback((elementId: string, name: string, value: string | boolean | number) => {
    setCanvasElements((prev) =>
      prev.map((el) =>
        el.id === elementId
          ? { ...el, properties: { ...el.properties, [name]: value } }
          : el
      )
    )
  }, [])

  const handleVariantChange = useCallback((elementId: string, group: string, value: string) => {
    setCanvasElements((prev) =>
      prev.map((el) =>
        el.id === elementId
          ? { ...el, variants: { ...el.variants, [group]: value } }
          : el
      )
    )
  }, [])

  const selectedElement = canvasElements.find((el) => el.id === selectedElementId) || null
  const selectedComponent = selectedElement
    ? ComponentRegistry.get(selectedElement.componentId) || null
    : null

  return (
    <div className="build-page">
      {/* Left Panel - App Elements */}
      <aside className="build-page__left">
        <div className="build-page__panel-header">
          <h2>App Elements</h2>
        </div>
        <div className="build-page__elements">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="build-page__category">
              <h3 className="build-page__category-title">{category}</h3>
              <ul className="build-page__element-list">
                {items.map((comp) => (
                  <li
                    key={comp.id}
                    className="build-page__element-item"
                    onClick={() => handleAddElement(comp)}
                  >
                    <span className="build-page__element-name">{comp.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Canvas - App Preview */}
      <main className="build-page__canvas" onClick={() => {
        setSelectedElementId(null)
        setRightPanel('preview')
      }}>
        <IconLibraryProvider>
        <div className="app-scope">
          <div className="themes-view__device">
            <AppHeader layout="Center" title="App Title" subtitle="Your app subtitle" />
            <div className="themes-view__canvas" onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedElementId(null)
                setRightPanel('preview')
              }
            }}>
              <div className="themes-view__app">
                {canvasElements.length === 0 ? (
                  <section className="themes-view__section themes-view__section--center">
                    <EmptyState />
                  </section>
                ) : (
                  canvasElements.map((element) => {
                    const comp = ComponentRegistry.get(element.componentId)
                    if (!comp) return null
                    return (
                      <section
                        key={element.id}
                        className={`themes-view__section build-page__canvas-element ${selectedElementId === element.id ? 'build-page__canvas-element--selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectElement(element.id)
                        }}
                      >
                        <div className="build-page__canvas-element-content">
                          {comp.render(element.variants, element.properties, element.states)}
                        </div>
                      </section>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        </IconLibraryProvider>
      </main>

      {/* Right Panel - Designer/Properties or Live Preview */}
      <aside className="build-page__right">
        {rightPanel === 'properties' && selectedElement && selectedComponent ? (
          <div className="build-page__properties">
            <div className="build-page__panel-header">
              <h2>{selectedComponent.name}</h2>
              <button
                className="build-page__panel-close"
                onClick={() => {
                  setRightPanel('preview')
                  setSelectedElementId(null)
                }}
              >
                &times;
              </button>
            </div>

            {/* Variants */}
            {Object.entries(selectedComponent.variants).map(([group, config]) => (
              <div key={group} className="build-page__prop-group">
                <label className="build-page__prop-label">{group}</label>
                <div className="build-page__prop-options">
                  {config.options.map((opt) => (
                    <button
                      key={opt}
                      className={`build-page__prop-option ${selectedElement.variants[group] === opt ? 'build-page__prop-option--active' : ''}`}
                      onClick={() => handleVariantChange(selectedElement.id, group, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Properties */}
            {selectedComponent.properties.filter((prop) => prop.name !== 'Selected' && prop.name !== 'Skeleton').map((prop) => (
              <div key={prop.name} className="build-page__prop-group">
                <label className="build-page__prop-label">{prop.name}</label>
                {prop.type === 'boolean' ? (
                  <label className="build-page__prop-toggle">
                    <input
                      type="checkbox"
                      checked={selectedElement.properties[prop.name] as boolean}
                      onChange={(e) =>
                        handlePropertyChange(selectedElement.id, prop.name, e.target.checked)
                      }
                    />
                    <span>{selectedElement.properties[prop.name] ? 'On' : 'Off'}</span>
                  </label>
                ) : (
                  <input
                    type="text"
                    className="build-page__prop-input"
                    value={String(selectedElement.properties[prop.name] || '')}
                    onChange={(e) =>
                      handlePropertyChange(selectedElement.id, prop.name, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="build-page__live-preview">
            <div className="build-page__device-frame">
              <p>Live Preview</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
