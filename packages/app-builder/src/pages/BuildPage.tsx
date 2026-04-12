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

// Icon mapping: component id → design-system icon name + category
const ELEMENT_ICON_MAP: Record<string, { icon: string; iconCategory: string }> = {
  'form': { icon: 'form-filled', iconCategory: 'forms-files' },
  'heading': { icon: 'heading-square-filled', iconCategory: 'editor' },
  'list': { icon: 'list-bullet', iconCategory: 'editor' },
  'paragraph': { icon: 'text-image', iconCategory: 'general' },
  'card': { icon: 'grid-2-filled', iconCategory: 'layout' },
  'sign-document': { icon: 'document-jf-sign-filled', iconCategory: 'documents' },
  'document': { icon: 'file-filled', iconCategory: 'forms-files' },
  'button': { icon: 'label-button-filled', iconCategory: 'general' },
  'social-follow': { icon: 'share-nodes-filled', iconCategory: 'general' },
  'product-list': { icon: 'cart-shopping-filled', iconCategory: 'finance' },
  'donation-box': { icon: 'heart-filled', iconCategory: 'general' },
  'image-gallery': { icon: 'images-filled', iconCategory: 'media' },
  'table': { icon: 'table', iconCategory: 'general' },
  'testimonial': { icon: 'message-star-filled', iconCategory: 'communication' },
  'login-signup': { icon: 'form-filled', iconCategory: 'forms-files' },
  'chart': { icon: 'form-report-filled', iconCategory: 'forms-files' },
  'daily-task-manager': { icon: 'table', iconCategory: 'general' },
}

interface PanelGroup {
  label?: string
  elementIds: string[]
}

const BASIC_GROUPS: PanelGroup[] = [
  { elementIds: ['form', 'heading', 'list', 'paragraph', 'card', 'sign-document', 'document', 'image-gallery', 'button'] },
  { label: 'PAYMENT ELEMENTS', elementIds: ['product-list', 'donation-box'] },
  { label: 'FEATURED WIDGETS', elementIds: ['social-follow', 'testimonial'] },
  { label: 'DATA ELEMENTS', elementIds: ['table'] },
]

const WIDGETS_GROUPS: PanelGroup[] = [
  { elementIds: ['chart', 'daily-task-manager', 'login-signup'] },
]

const HIDDEN_ELEMENTS = ['empty-state', 'app-header', 'bottom-navigation', 'color-picker']

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
  list: [
    { selector: '.jf-list__title', property: 'Title' },
    { selector: '.jf-list__subtitle', property: 'Subtitle' },
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

    // Auto-activate Paragraph toolbar when selected
    if (isSelected && element.componentId === 'paragraph') {
      const editor = container.querySelector('.jf-paragraph__editor') as HTMLElement | null
      if (editor) {
        requestAnimationFrame(() => editor.click())
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
  const [appTitle, setAppTitle] = useState('App Title')
  const [appSubtitle, setAppSubtitle] = useState('')
  const appHeaderRef = useRef<HTMLDivElement>(null)

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

  // AppHeader inline editing
  useEffect(() => {
    const container = appHeaderRef.current
    if (!container) return

    const titleEl = container.querySelector('.jf-app-header__title') as HTMLElement | null
    const subtitleEl = container.querySelector('.jf-app-header__subtitle') as HTMLElement | null

    const fields = [
      { el: titleEl, defaultValue: 'App Title', setter: setAppTitle },
      { el: subtitleEl, defaultValue: '', setter: setAppSubtitle },
    ]

    const cleanups: (() => void)[] = []

    for (const { el, defaultValue, setter } of fields) {
      if (!el) continue

      el.contentEditable = 'true'
      el.style.outline = 'none'
      el.style.cursor = 'text'
      const placeholderText = defaultValue || (el.className.includes('subtitle') ? 'Subtitle' : 'Title')
      el.dataset.placeholder = placeholderText


      const handleFocus = () => {
        // Show subtitle placeholder when title is focused
        if (!el.className.includes('subtitle')) {
          const sub = container.querySelector('.jf-app-header__subtitle') as HTMLElement | null
          if (sub && sub.classList.contains('jf-app-header__subtitle--empty')) {
            sub.classList.remove('jf-app-header__subtitle--empty')
            sub.classList.add('build-page__inline-placeholder')
          }
        }
        if (el.className.includes('subtitle--empty')) {
          el.classList.remove('jf-app-header__subtitle--empty')
        }
        if (defaultValue && el.textContent === defaultValue) {
          el.textContent = ''
          el.classList.add('build-page__inline-placeholder')
        }
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
          setter(newText)
        } else {
          setter(defaultValue)
          if (defaultValue) {
            el.textContent = defaultValue
          } else if (el.className.includes('subtitle')) {
            el.classList.add('jf-app-header__subtitle--empty')
          }
        }
        // If title blurs and subtitle is still empty, hide it
        if (!el.className.includes('subtitle')) {
          const sub = container.querySelector('.jf-app-header__subtitle') as HTMLElement | null
          if (sub && !sub.textContent) {
            sub.classList.remove('build-page__inline-placeholder')
            sub.classList.add('jf-app-header__subtitle--empty')
          }
        }
      }

      el.addEventListener('focus', handleFocus)
      el.addEventListener('input', handleInput)
      el.addEventListener('blur', handleBlur)
      cleanups.push(() => {
        el.removeEventListener('focus', handleFocus)
        el.removeEventListener('input', handleInput)
        el.removeEventListener('blur', handleBlur)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [appTitle, appSubtitle])

  const [activeTab, setActiveTab] = useState<'basic' | 'widgets'>('basic')

  const componentMap = components.reduce<Record<string, RegisteredComponent>>((acc, comp) => {
    if (!HIDDEN_ELEMENTS.includes(comp.id)) acc[comp.id] = comp
    return acc
  }, {})

  const activeGroups = activeTab === 'basic' ? BASIC_GROUPS : WIDGETS_GROUPS

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
        <div className="build-page__left-header">
          <h2>App Elements</h2>
          <button className="build-page__left-close">
            <Icon name="xmark" size={24} />
          </button>
        </div>
        <div className="build-page__tab-menu">
          <button
            className={`build-page__tab${activeTab === 'basic' ? ' build-page__tab--active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            BASIC
          </button>
          <button
            className={`build-page__tab${activeTab === 'widgets' ? ' build-page__tab--active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >
            WIDGETS
          </button>
        </div>
        <div className="build-page__elements">
          {activeGroups.map((group, groupIndex) => {
            const validItems = group.elementIds
              .map((id) => componentMap[id])
              .filter(Boolean)
            if (validItems.length === 0) return null

            return (
              <div key={group.label || groupIndex}>
                {group.label && (
                  <div className="build-page__separator">{group.label}</div>
                )}
                {validItems.map((comp, itemIndex) => {
                  const iconInfo = ELEMENT_ICON_MAP[comp.id]
                  return (
                    <div key={comp.id}>
                      <div
                        className="build-page__element-item"
                        onClick={() => handleAddElement(comp)}
                      >
                        <div className="build-page__element-icon">
                          {iconInfo ? (
                            <Icon name={iconInfo.icon} category={iconInfo.iconCategory} size={24} />
                          ) : (
                            <Icon name="grid-2-filled" category="layout" size={24} />
                          )}
                        </div>
                        <div className="build-page__element-content">
                          <span className="build-page__element-name">{comp.name}</span>
                        </div>
                      </div>
                      {itemIndex < validItems.length - 1 && (
                        <hr className="build-page__element-divider" />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
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
              <div ref={appHeaderRef}>
                <AppHeader layout="Center" title={appTitle} subtitle={appSubtitle} />
              </div>

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
            {Object.entries(selectedComponent.variants)
              .filter(([, config]) => {
                if (!config.showWhen) return true
                return Object.entries(config.showWhen).every(
                  ([key, val]) => selectedElement.variants[key] === val
                )
              })
              .map(([group, config]) => (
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
            {selectedComponent.properties
              .filter((prop) => prop.name !== 'Selected' && prop.name !== 'Skeleton')
              .filter((prop) => {
                if (!prop.showWhen) return true
                return Object.entries(prop.showWhen).every(
                  ([key, val]) => selectedElement.variants[key] === val || selectedElement.properties[key] === val
                )
              })
              .map((prop) => (
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
