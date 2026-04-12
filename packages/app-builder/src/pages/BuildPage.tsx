import { useState, useEffect, useCallback, useRef, memo } from 'react'
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
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

// Maps component selectors to property names for inline editing
const INLINE_EDITABLE_MAP: Record<string, { selector: string; property: string }[]> = {
  card: [
    { selector: '.jf-card__title', property: 'Title' },
    { selector: '.jf-card__description', property: 'Description' },
  ],
  button: [
    { selector: '.jf-btn__label', property: 'Label' },
  ],
  heading: [
    { selector: '.jf-heading__title', property: 'Heading' },
    { selector: '.jf-heading__subtitle', property: 'Subheading' },
  ],
  form: [
    { selector: '.jf-form__title', property: 'Label' },
    { selector: '.jf-form__desc', property: 'Description' },
  ],
  table: [
    { selector: '.jf-table__title', property: 'Label' },
    { selector: '.jf-table__desc', property: 'Description' },
  ],
  document: [
    { selector: '.jf-doc__title', property: 'File Name' },
    { selector: '.jf-doc__desc', property: 'Description' },
  ],
  'sign-document': [
    { selector: '.jf-sign-doc__title', property: 'Label' },
    { selector: '.jf-sign-doc__desc', property: 'Description' },
  ],
  'product-list': [
    { selector: '.jf-product-list__title', property: 'Title' },
    { selector: '.jf-product-list__subtitle', property: 'Subtitle' },
  ],
  'donation-box': [
    { selector: '.jf-donation__title', property: 'Title' },
    { selector: '.jf-donation__description', property: 'Description' },
  ],
}

const SortableElement = memo(function SortableElement({
  element,
  isSelected,
  isDragActive,
  onSelect,
  onPropertyChange,
}: {
  element: CanvasElement
  isSelected: boolean
  isDragActive: boolean
  onSelect: (id: string) => void
  onPropertyChange: (elementId: string, property: string, value: string) => void
}) {
  const comp = ComponentRegistry.get(element.componentId)
  const isShrinked = element.properties['Shrinked'] === true
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging || isDragActive ? 0.4 : 1,
  }

  // Enable inline editing when selected
  useEffect(() => {
    const container = contentRef.current
    if (!container || !comp) return

    const editableFields = INLINE_EDITABLE_MAP[element.componentId] || []
    const cleanups: (() => void)[] = []

    for (const field of editableFields) {
      const el = container.querySelector(field.selector) as HTMLElement | null
      if (!el) continue

      if (isSelected) {
        el.contentEditable = 'true'
        el.style.outline = 'none'
        el.style.cursor = 'text'
        const propDef = ComponentRegistry.get(element.componentId)?.properties.find((p) => p.name === field.property)
        const defaultValue = String(propDef?.default || '')
        const placeholderText = defaultValue || field.property
        el.dataset.placeholder = placeholderText

        // If content is empty, immediately show placeholder
        if (!el.textContent) {
          el.classList.add('build-page__inline-placeholder')
        }

        const handleFocus = () => {
          // If text is still the default (and default is not empty), clear it and show placeholder
          if (defaultValue && el.textContent === defaultValue) {
            el.textContent = ''
            el.classList.add('build-page__inline-placeholder')
          }
          // If empty (no default), show placeholder
          if (!el.textContent) {
            el.classList.add('build-page__inline-placeholder')
          }
        }

        const handleInput = () => {
          if (el.textContent) {
            el.classList.remove('build-page__inline-placeholder')
          } else {
            el.classList.add('build-page__inline-placeholder')
          }
        }

        const handleBlur = () => {
          const newText = el.textContent || ''
          el.classList.remove('build-page__inline-placeholder')
          if (newText) {
            onPropertyChange(element.id, field.property, newText)
          } else {
            onPropertyChange(element.id, field.property, defaultValue)
            el.textContent = defaultValue
          }
        }

        const handleMouseDown = (e: MouseEvent) => {
          if (isSelected) e.stopPropagation()
        }

        el.addEventListener('focus', handleFocus)
        el.addEventListener('input', handleInput)
        el.addEventListener('blur', handleBlur)
        el.addEventListener('mousedown', handleMouseDown)
        cleanups.push(() => {
          el.contentEditable = 'false'
          el.style.cursor = ''
          el.classList.remove('build-page__inline-placeholder')
          delete el.dataset.placeholder
          el.removeEventListener('focus', handleFocus)
          el.removeEventListener('input', handleInput)
          el.removeEventListener('blur', handleBlur)
          el.removeEventListener('mousedown', handleMouseDown)
        })
      } else {
        el.contentEditable = 'false'
        el.style.cursor = ''
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [isSelected, element.componentId, element.id, comp, onPropertyChange])

  if (!comp) return null

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`themes-view__section build-page__canvas-element ${isSelected ? 'build-page__canvas-element--selected' : ''} ${isShrinked ? 'build-page__canvas-element--shrinked' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(element.id)
      }}
    >
      <div
        className="build-page__drag-handle"
        {...attributes}
        {...listeners}
      >
        <Icon name="grid-dots-vertical" category="general" size={24} />
      </div>
      <div ref={contentRef} className="build-page__canvas-element-content">
        {comp.render(element.variants, element.properties, element.states)}
      </div>
    </section>
  )
})

const DragOverlayContent = memo(function DragOverlayContent({ element }: { element: CanvasElement }) {
  const comp = ComponentRegistry.get(element.componentId)
  if (!comp) return null

  return (
    <section className="themes-view__section build-page__canvas-element build-page__canvas-element--dragging">
      <div className="build-page__canvas-element-content">
        {comp.render(element.variants, element.properties, element.states)}
      </div>
    </section>
  )
})

function DroppablePage({ pageId, children }: { pageId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: pageId })
  return (
    <div
      ref={setNodeRef}
      className={`themes-view__app ${isOver ? 'build-page__droppable--over' : ''}`}
    >
      {children}
    </div>
  )
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
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

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

  // Find which page an element belongs to
  const findPageForElement = useCallback((elementId: string): string | null => {
    for (const page of pages) {
      if (page.elements.some((el) => el.id === elementId)) {
        return page.id
      }
    }
    return null
  }, [pages])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    // Determine source and target pages
    const sourcePageId = findPageForElement(activeId)

    let targetPageId = findPageForElement(overId)
    if (!targetPageId) {
      const isPage = pages.some((p) => p.id === overId)
      if (isPage) targetPageId = overId
    }



    // Only move if crossing pages
    if (!sourcePageId || !targetPageId || sourcePageId === targetPageId) return

    // Move element to target page immediately for visual feedback
    setPages((prev) => {
      const sourcePage = prev.find((p) => p.id === sourcePageId)!
      const element = sourcePage.elements.find((el) => el.id === activeId)!
      if (!element) return prev

      const destPage = prev.find((p) => p.id === targetPageId)!
      const overIndex = destPage.elements.findIndex((el) => el.id === overId)
      const insertIndex = overIndex >= 0 ? overIndex : destPage.elements.length

      return prev.map((page) => {
        if (page.id === sourcePageId) {
          return { ...page, elements: page.elements.filter((el) => el.id !== activeId) }
        }
        if (page.id === targetPageId) {
          const newElements = [...page.elements]
          newElements.splice(insertIndex, 0, element)
          return { ...page, elements: newElements }
        }
        return page
      })
    })
  }, [findPageForElement, pages])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setDragActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const sourcePageId = findPageForElement(activeId)
    if (!sourcePageId) return

    // Determine target page
    let targetPageId = findPageForElement(overId)
    if (!targetPageId) {
      const isPage = pages.some((p) => p.id === overId)
      if (isPage) targetPageId = overId
    }
    if (!targetPageId) return

    if (sourcePageId === targetPageId) {
      // Same page reorder
      if (activeId === overId) return
      setPages((prev) =>
        prev.map((page) => {
          if (page.id !== sourcePageId) return page
          const oldIndex = page.elements.findIndex((el) => el.id === activeId)
          const newIndex = page.elements.findIndex((el) => el.id === overId)
          if (oldIndex === -1 || newIndex === -1) return page
          const newElements = [...page.elements]
          const [moved] = newElements.splice(oldIndex, 1)
          newElements.splice(newIndex, 0, moved)
          return { ...page, elements: newElements }
        })
      )
    } else {
      // Cross-page move — already handled in handleDragOver
      // Just reorder within the target page if needed
      if (activeId !== overId) {
        setPages((prev) =>
          prev.map((page) => {
            if (page.id !== targetPageId) return page
            const oldIndex = page.elements.findIndex((el) => el.id === activeId)
            const newIndex = page.elements.findIndex((el) => el.id === overId)
            if (oldIndex === -1 || newIndex === -1) return page
            const newElements = [...page.elements]
            const [moved] = newElements.splice(oldIndex, 1)
            newElements.splice(newIndex, 0, moved)
            return { ...page, elements: newElements }
          })
        )
      }
    }
  }, [findPageForElement, pages])

  // Find dragged element for overlay
  let draggedElement: CanvasElement | null = null
  if (dragActiveId) {
    for (const page of pages) {
      const found = page.elements.find((el) => el.id === dragActiveId)
      if (found) {
        draggedElement = found
        break
      }
    }
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
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
                    <SortableContext
                      items={page.elements.map((el) => el.id)}
                      strategy={verticalListSortingStrategy}
                      id={page.id}
                    >
                      <DroppablePage pageId={page.id}>
                        {page.elements.length === 0 ? (
                          <section className="themes-view__section themes-view__section--center build-page__empty-state">
                            <EmptyState />
                          </section>
                        ) : (
                          page.elements.map((element) => (
                            <SortableElement
                              key={element.id}
                              element={element}
                              isSelected={selectedElementId === element.id}
                              isDragActive={dragActiveId === element.id}
                              onSelect={handleSelectElement}
                              onPropertyChange={handlePropertyChange}
                            />
                          ))
                        )}
                      </DroppablePage>
                    </SortableContext>
                  </div>

                  {(pageIndex > 0 || page.elements.length > 0) && (
                    <AddPageDivider onClick={() => handleAddPage(page.id)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <DragOverlay>
            {draggedElement ? <DragOverlayContent element={draggedElement} /> : null}
          </DragOverlay>
        </DndContext>
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
