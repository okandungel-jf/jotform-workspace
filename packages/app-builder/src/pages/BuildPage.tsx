import { useState, useEffect, useCallback } from 'react'
import {
  ComponentRegistry,
  AppHeader,
  EmptyState,
  type RegisteredComponent,
  type VariantValues,
  type PropertyValues,
  type StateValues,
} from '@jf/app-elements'
import { Icon } from '@jf/design-system'

interface CanvasElement {
  id: string
  componentId: string
  variants: VariantValues
  properties: PropertyValues
  states: StateValues
}

interface AppPage {
  id: string
  name: string
  elements: CanvasElement[]
}

let elementCounter = 0
let pageCounter = 1

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

function AddPageDivider({ onClick }: { onClick: () => void }) {
  return (
    <div className="add-page-divider" onClick={(e) => e.stopPropagation()}>
      <div className="add-page-divider__line" />
      <button className="add-page-divider__btn" onClick={onClick}>
        <Icon name="plus-sm" category="general" size={24} />
        <span>Add a Page</span>
      </button>
      <div className="add-page-divider__line" />
    </div>
  )
}

type RightPanelMode = 'preview' | 'designer' | 'properties'

export function BuildPage() {
  const [rightPanel, setRightPanel] = useState<RightPanelMode>('preview')
  const [components, setComponents] = useState<RegisteredComponent[]>(ComponentRegistry.getAll())
  const [pages, setPages] = useState<AppPage[]>([
    { id: 'page-1', name: 'Home', elements: [] },
  ])
  const [activePageId, setActivePageId] = useState('page-1')
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
    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, elements: [...page.elements, element] }
          : page
      )
    )
    setSelectedElementId(element.id)
    setRightPanel('properties')
  }, [activePageId])

  const handleSelectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId)
    setRightPanel('properties')
  }, [])

  const handleRemoveElement = useCallback((elementId: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.filter((el) => el.id !== elementId),
      }))
    )
    setSelectedElementId((prev) => (prev === elementId ? null : prev))
    setRightPanel('preview')
  }, [])

  const handleAddPage = useCallback((afterPageId: string) => {
    const newPage: AppPage = {
      id: `page-${++pageCounter}`,
      name: `Page ${pageCounter}`,
      elements: [],
    }
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === afterPageId)
      const next = [...prev]
      next.splice(idx + 1, 0, newPage)
      return next
    })
    setActivePageId(newPage.id)
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
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === elementId
            ? { ...el, properties: { ...el.properties, [name]: value } }
            : el
        ),
      }))
    )
  }, [])

  const handleVariantChange = useCallback((elementId: string, group: string, value: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === elementId
            ? { ...el, variants: { ...el.variants, [group]: value } }
            : el
        ),
      }))
    )
  }, [])

  // Find selected element across all pages
  let selectedElement: CanvasElement | null = null
  let selectedComponent: RegisteredComponent | null = null
  for (const page of pages) {
    const found = page.elements.find((el) => el.id === selectedElementId)
    if (found) {
      selectedElement = found
      selectedComponent = ComponentRegistry.get(found.componentId) || null
      break
    }
  }

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
        <div className="app-scope">
          <div className="themes-view__device">
            <AppHeader layout="Center" title="App Title" subtitle="Your app subtitle" />

            {pages.map((page, pageIndex) => (
              <div key={page.id}>
                  <div
                  className={`themes-view__canvas ${pageIndex === 0 ? 'themes-view__canvas--first' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActivePageId(page.id)
                    if (e.target === e.currentTarget) {
                      setSelectedElementId(null)
                      setRightPanel('preview')
                    }
                  }}
                >
                  <div className="themes-view__app">
                    {page.elements.length === 0 ? (
                      <section className="themes-view__section themes-view__section--center build-page__empty-state">
                        <EmptyState />
                      </section>
                    ) : (
                      page.elements.map((element) => {
                        const comp = ComponentRegistry.get(element.componentId)
                        if (!comp) return null
                        const isShrinked = element.properties['Shrinked'] === true
                        return (
                          <section
                            key={element.id}
                            className={`themes-view__section build-page__canvas-element ${selectedElementId === element.id ? 'build-page__canvas-element--selected' : ''} ${isShrinked ? 'build-page__canvas-element--shrinked' : ''}`}
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

                {(pageIndex > 0 || page.elements.length > 0) && (
                  <AddPageDivider onClick={() => handleAddPage(page.id)} />
                )}
              </div>
            ))}
          </div>
        </div>
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
