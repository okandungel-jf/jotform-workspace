import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import {
  ComponentRegistry,
  AppHeader,
  AppDesigner,
  applyDefaultTheme,
  BottomNavigation,
  EmptyState,
  BottomSheet,
  type RegisteredComponent,
  type VariantValues,
  type PropertyValues,
  type StateValues,
} from '@jf/app-elements'
import { Icon, Button as DSButton } from '@jf/design-system'
import phoneHomeIndicator from '@jf/design-system/src/assets/phone-home-indicator.svg'
import { PhoneStatusBar } from '../components/PhoneStatusBar'
import { PageNavigationBar, getPageIconName } from '../components/PageNavigationBar'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  pointerWithin,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
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
  icon?: string
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
  'progress-indicator': { icon: 'list-check-square-filled', iconCategory: 'general' },
  'spacer': { icon: 'spacer-vertical-filled', iconCategory: 'layout' },
}

interface PanelGroup {
  label?: string
  elementIds: string[]
}

const BASIC_GROUPS: PanelGroup[] = [
  { elementIds: ['form', 'heading', 'list', 'paragraph', 'card', 'sign-document', 'document', 'image-gallery', 'button', 'spacer'] },
  { label: 'PAYMENT ELEMENTS', elementIds: ['product-list', 'donation-box'] },
  { label: 'FEATURED WIDGETS', elementIds: ['social-follow', 'testimonial'] },
  { label: 'DATA ELEMENTS', elementIds: ['table'] },
]

const WIDGETS_GROUPS: PanelGroup[] = [
  { elementIds: ['chart', 'daily-task-manager', 'login-signup', 'progress-indicator'] },
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
  isPending,
  onSelect,
  onPropertyChange,
}: {
  element: CanvasElement
  isSelected: boolean
  isPending: boolean
  onSelect: (id: string) => void
  onPropertyChange: (elementId: string, property: string, value: string | boolean | number) => void
}) {
  const comp = ComponentRegistry.get(element.componentId)
  const isShrinked = element.properties['Shrinked'] === true
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: 'transform 200ms ease',
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

  const showLine = isDragging || isPending

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`themes-view__section build-page__canvas-element ${showLine ? 'build-page__canvas-element--dragging-line' : ''} ${isSelected ? 'build-page__canvas-element--selected' : ''} ${isShrinked ? 'build-page__canvas-element--shrinked' : ''}`}
      data-element-id={element.id}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(element.id)
      }}
    >
      {showLine ? (
        <div className="build-page__drag-line" aria-hidden />
      ) : (
        <>
          <div
            className="build-page__drag-handle"
            {...attributes}
            {...listeners}
          >
            <Icon name="grid-dots-vertical" category="general" size={24} />
          </div>
          <div ref={contentRef} className="build-page__canvas-element-content">
            {comp.render(element.variants, element.properties, element.states, (name, value) => onPropertyChange(element.id, name, value))}
          </div>
        </>
      )}
    </section>
  )
})

function PanelDragOverlay({ componentId }: { componentId: string }) {
  const iconInfo = ELEMENT_ICON_MAP[componentId]
  const comp = ComponentRegistry.get(componentId)
  if (!comp) return null

  return (
    <div className="build-page__element-item build-page__panel-overlay">
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
  )
}

function DraggablePanelItem({
  comp,
  children,
}: {
  comp: RegisteredComponent
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `panel:${comp.id}`,
    data: { type: 'panel-item', component: comp },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? 'build-page__element-item--dragging' : ''}
    >
      {children}
    </div>
  )
}

function DropLinePlaceholder() {
  return (
    <section className="themes-view__section build-page__canvas-element build-page__canvas-element--dragging-line">
      <div className="build-page__drag-line" aria-hidden />
    </section>
  )
}

function DroppablePage({ pageId, isDropTarget, children }: { pageId: string; isDropTarget: boolean; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: pageId })
  return (
    <div
      ref={setNodeRef}
      data-page-id={pageId}
      className={`themes-view__app ${isDropTarget ? 'build-page__droppable--over' : ''}`}
    >
      {children}
    </div>
  )
}

// Modifier: center overlay on cursor
const snapCenterToCursor: import('@dnd-kit/core').Modifier = ({ activatorEvent, draggingNodeRect, transform }) => {
  if (activatorEvent && draggingNodeRect) {
    const evt = activatorEvent as PointerEvent
    const offsetX = evt.clientX - draggingNodeRect.left
    const offsetY = evt.clientY - draggingNodeRect.top
    return {
      ...transform,
      x: transform.x + offsetX - draggingNodeRect.width / 2,
      y: transform.y + offsetY - draggingNodeRect.height / 2,
    }
  }
  return transform
}

// Prefer real pointer position over active.rect for collisions. This is crucial
// for panel drags where DragOverlay is centered on cursor via snapCenterToCursor
// but active.rect.current.translated stays at the panel-origin + drag-delta.
const pointerFirstCollision: CollisionDetection = (args) => {
  const pointer = pointerWithin(args)
  if (pointer.length > 0) return pointer
  return closestCorners(args)
}

function TabMenu({ activeTab, onTabChange }: { activeTab: 'basic' | 'widgets'; onTabChange: (tab: 'basic' | 'widgets') => void }) {
  return (
    <div className="build-page__tab-menu">
      <button
        className={`build-page__tab${activeTab === 'basic' ? ' build-page__tab--active' : ''}`}
        onClick={() => onTabChange('basic')}
      >
        BASIC
      </button>
      <button
        className={`build-page__tab${activeTab === 'widgets' ? ' build-page__tab--active' : ''}`}
        onClick={() => onTabChange('widgets')}
      >
        WIDGETS
      </button>
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

export function BuildPage({ previewMode = true, appTitle: appTitleProp = 'App Title', onAppTitleChange }: { previewMode?: boolean; appTitle?: string; onAppTitleChange?: (title: string) => void }) {
  const [rightPanel, setRightPanel] = useState<RightPanelMode>('preview')
  const [components, setComponents] = useState<RegisteredComponent[]>(ComponentRegistry.getAll())
  const [pages, setPages] = useState<AppPage[]>([
    { id: 'page-1', name: 'Home', icon: 'House', elements: [] },
  ])
  const [activePageId, setActivePageId] = useState('page-1')
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [dragSession, setDragSession] = useState<{
    type: 'panel' | 'canvas'
    activeId: string
    pendingElementId?: string
    overPageId?: string
  } | null>(null)
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [mobileElementsSheet, setMobileElementsSheet] = useState(false)
  const [forceTargetPageId, setForceTargetPageId] = useState<string | null>(null)
  const [isMobileView, setIsMobileView] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  // Mirror of pages for stable access in drag handlers without re-binding on pages change.
  const pagesRef = useRef<AppPage[]>([])
  useEffect(() => { pagesRef.current = pages }, [pages])
  const dragSessionRef = useRef<{ type: 'panel' | 'canvas'; activeId: string; pendingElementId?: string } | null>(null)
  // Real pointer Y for before/after decisions in handleDragOver (active.rect
  // may not match cursor when DragOverlay uses snapCenterToCursor).
  const cursorYRef = useRef(0)
  useEffect(() => {
    const handle = (e: PointerEvent) => { cursorYRef.current = e.clientY }
    window.addEventListener('pointermove', handle)
    return () => window.removeEventListener('pointermove', handle)
  }, [])

  // Stable items arrays per page for SortableContext. Exclude the pending
  // element (panel drag) from sortable items so dnd-kit doesn't manage a phantom
  // sortable item that isn't registered as a useSortable hook. We also cache by
  // content so an array reference is only replaced when its ids actually change;
  // this prevents sortable's effects from firing on every pages mutation.
  const pendingElementId = dragSession?.type === 'panel' ? dragSession.pendingElementId : undefined
  const itemsByPageCacheRef = useRef<Map<string, string[]>>(new Map())
  const itemsByPage = useMemo(() => {
    const m: Record<string, string[]> = {}
    for (const p of pages) {
      const newIds = pendingElementId
        ? p.elements.filter((el) => el.id !== pendingElementId).map((el) => el.id)
        : p.elements.map((el) => el.id)
      const cached = itemsByPageCacheRef.current.get(p.id)
      if (cached && cached.length === newIds.length && cached.every((id, i) => id === newIds[i])) {
        m[p.id] = cached
      } else {
        itemsByPageCacheRef.current.set(p.id, newIds)
        m[p.id] = newIds
      }
    }
    return m
  }, [pages, pendingElementId])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobileView(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const appTitle = appTitleProp
  const setAppTitle = (title: string) => onAppTitleChange?.(title)
  const [appSubtitle, setAppSubtitle] = useState('')
  const appHeaderRef = useRef<HTMLDivElement>(null)
  const designBtnRef = useRef<HTMLButtonElement>(null)
  const [designBtnOnHeader, setDesignBtnOnHeader] = useState(true)

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

  const handleCloseDesigner = useCallback(() => {
    setRightPanel('preview')
  }, [])

  // Apply default theme on mount so components are styled before AppDesigner opens
  useEffect(() => {
    applyDefaultTheme()
  }, [])

  // Toggle design-mode class on .builder for CSS targeting
  useEffect(() => {
    const builder = document.querySelector('.builder')
    if (!builder) return
    if (rightPanel === 'designer' && isMobileView) {
      builder.classList.add('builder--design-mode')
    } else {
      builder.classList.remove('builder--design-mode')
    }
  }, [rightPanel, isMobileView])

  // Track whether design button overlaps app header
  useEffect(() => {
    const canvas = document.querySelector('.build-page__canvas')
    if (!canvas || !appHeaderRef.current || !designBtnRef.current) return
    const check = () => {
      const headerRect = appHeaderRef.current!.getBoundingClientRect()
      const btnRect = designBtnRef.current!.getBoundingClientRect()
      setDesignBtnOnHeader(btnRect.top + btnRect.height / 2 < headerRect.bottom)
    }
    check()
    canvas.addEventListener('scroll', check, { passive: true })
    return () => canvas.removeEventListener('scroll', check)
  }, [])

  // Toggle elements-sheet class on .builder for CSS targeting
  useEffect(() => {
    const builder = document.querySelector('.builder')
    if (!builder) return
    if (mobileElementsSheet && isMobileView) {
      builder.classList.add('builder--elements-sheet')
    } else {
      builder.classList.remove('builder--elements-sheet')
    }
  }, [mobileElementsSheet, isMobileView])

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
    setPages((prev) => {
      // Priority: forceTargetPageId (from empty state click) > selected element's page > activePageId
      let targetPageId = activePageId
      if (forceTargetPageId) {
        targetPageId = forceTargetPageId
      } else if (selectedElementId) {
        const selectedPage = prev.find((p) => p.elements.some((el) => el.id === selectedElementId))
        if (selectedPage) targetPageId = selectedPage.id
      }
      return prev.map((page) => {
        if (page.id !== targetPageId) return page
        const selectedIdx = selectedElementId && !forceTargetPageId
          ? page.elements.findIndex((el) => el.id === selectedElementId)
          : -1
        if (selectedIdx !== -1) {
          const newElements = [...page.elements]
          newElements.splice(selectedIdx + 1, 0, element)
          return { ...page, elements: newElements }
        }
        return { ...page, elements: [...page.elements, element] }
      })
    })
    setForceTargetPageId(null)
    setSelectedElementId(element.id)
    if (!mobileElementsSheet) {
      setRightPanel('properties')
    }
    // Scroll to newly added element after render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.querySelector(`[data-element-id="${element.id}"]`)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollContainer = isMobileView
          ? document.querySelector('.builder')
          : document.querySelector('.build-page__canvas')
        if (!scrollContainer) return
        const containerRect = scrollContainer.getBoundingClientRect()
        const targetY = scrollContainer.scrollTop + rect.top - containerRect.top - containerRect.height / 2 + rect.height / 2
        const start = scrollContainer.scrollTop
        const distance = targetY - start
        const duration = 500
        let startTime: number | null = null
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          scrollContainer.scrollTop = start + distance * ease(progress)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, 100)
    })
  }, [activePageId, isMobileView, mobileElementsSheet, selectedElementId, forceTargetPageId])

  const handleSelectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId)
    setRightPanel('properties')
    setMobileElementsSheet(false)
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
    // Scroll to new page after render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.querySelector(`[data-page-id="${newPage.id}"]`)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollContainer = isMobileView
          ? document.querySelector('.builder')
          : document.querySelector('.build-page__canvas')
        if (!scrollContainer) return
        const containerRect = scrollContainer.getBoundingClientRect()
        const targetY = scrollContainer.scrollTop + rect.top - containerRect.top - containerRect.height / 2 + rect.height / 2
        const start = scrollContainer.scrollTop
        const distance = targetY - start
        const duration = 500
        let startTime: number | null = null
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          scrollContainer.scrollTop = start + distance * ease(progress)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, 200)
    })
  }, [isMobileView])

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string
    const isPanel = id.startsWith('panel:')
    if (isPanel) {
      setSelectedElementId(null)
      setRightPanel('preview')
      const comp = event.active.data.current?.component as RegisteredComponent | undefined
      if (!comp) return
      // Pending uses a unique canvas id (NOT active.id) to avoid dnd-kit duplicate
      // registration conflicts between the panel's useDraggable and the pending's
      // useSortable. Sortable auto-shift won't trigger for active (since active.id
      // isn't in items) — panel drag uses isPending prop to render the 4px line.
      const pending = createCanvasElement(comp)
      dragSessionRef.current = { type: 'panel', activeId: id, pendingElementId: pending.id }
      setDragSession({ type: 'panel', activeId: id, pendingElementId: pending.id })
      setPages((prev) =>
        prev.map((page) =>
          page.id === activePageId
            ? { ...page, elements: [...page.elements, pending] }
            : page
        )
      )
    } else {
      dragSessionRef.current = { type: 'canvas', activeId: id }
      setDragSession({ type: 'canvas', activeId: id })
    }
  }, [activePageId])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const overId = over.id as string
    const currentPages = pagesRef.current
    const session = dragSessionRef.current

    const findPage = (id: string): string | null => {
      for (const p of currentPages) {
        if (p.elements.some((el) => el.id === id)) return p.id
      }
      return null
    }

    let hoverPageId = findPage(overId)
    if (!hoverPageId && currentPages.some((p) => p.id === overId)) hoverPageId = overId
    if (hoverPageId) {
      setDragSession((prev) => (prev && prev.overPageId !== hoverPageId ? { ...prev, overPageId: hoverPageId } : prev))
    }

    // MC cross-page move + same-page reorder for the tracked canvas element
    // (pending for panel drag, active for canvas drag).
    const movingId = session?.type === 'panel' ? session.pendingElementId : (active.id as string)
    if (!movingId) return
    const sourcePageId = findPage(movingId)
    let targetPageId = findPage(overId)
    if (!targetPageId && currentPages.some((p) => p.id === overId)) targetPageId = overId
    if (!sourcePageId || !targetPageId) return

    // Cross-page: relocate moving element to target page (handles MC case).
    if (sourcePageId !== targetPageId) {
      setPages((prev) => {
        const sourcePage = prev.find((p) => p.id === sourcePageId)
        const destPage = prev.find((p) => p.id === targetPageId)
        if (!sourcePage || !destPage) return prev
        const element = sourcePage.elements.find((el) => el.id === movingId)
        if (!element) return prev
        const overIndex = destPage.elements.findIndex((el) => el.id === overId)
        const insertIndex = overIndex >= 0 ? overIndex : destPage.elements.length
        return prev.map((page) => {
          if (page.id === sourcePageId) {
            return { ...page, elements: page.elements.filter((el) => el.id !== movingId) }
          }
          if (page.id === targetPageId) {
            const newElements = [...page.elements]
            newElements.splice(insertIndex, 0, element)
            return { ...page, elements: newElements }
          }
          return page
        })
      })
      return
    }

    // Same-page reorder (panel drag only — canvas drag's same-page reorder is
    // handled visually by sortable transforms and committed on drag end).
    if (session?.type !== 'panel') return
    const page = currentPages.find((p) => p.id === sourcePageId)
    if (!page) return
    const pendingIdx = page.elements.findIndex((e) => e.id === movingId)
    const overIdx = page.elements.findIndex((e) => e.id === overId)
    if (pendingIdx === -1 || overIdx === -1) return

    // Decide before/after based on cursor Y vs over element's midpoint.
    const overMidY = over.rect.top + over.rect.height / 2
    const cursorY = cursorYRef.current
    const insertAfter = cursorY > overMidY
    const reducedOverIdx = pendingIdx < overIdx ? overIdx - 1 : overIdx
    const newIdx = insertAfter ? reducedOverIdx + 1 : reducedOverIdx
    if (newIdx === pendingIdx) return // idempotent — already in the right slot

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== sourcePageId) return p
        return { ...p, elements: arrayMove(p.elements, pendingIdx, newIdx) }
      })
    )
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    const session = dragSessionRef.current
    const pendingId = session?.pendingElementId
    dragSessionRef.current = null
    setDragSession(null)

    const activeId = active.id as string
    const isPanel = activeId.startsWith('panel:')
    const currentPages = pagesRef.current

    const findPage = (id: string): string | null => {
      for (const p of currentPages) {
        if (p.elements.some((el) => el.id === id)) return p.id
      }
      return null
    }

    if (!over) {
      if (pendingId) {
        setPages((prev) =>
          prev.map((page) => ({
            ...page,
            elements: page.elements.filter((el) => el.id !== pendingId),
          }))
        )
      }
      return
    }

    const overId = over.id as string

    if (isPanel && pendingId) {
      const overPageId = findPage(overId)
      const isOverPage = currentPages.some((p) => p.id === overId)
      // Drop outside any page → cancel (remove pending)
      if (!overPageId && !isOverPage) {
        setPages((prev) =>
          prev.map((page) => ({
            ...page,
            elements: page.elements.filter((el) => el.id !== pendingId),
          }))
        )
        return
      }
      const pendingPageId = findPage(pendingId)
      if (!pendingPageId) return
      // Pending already has a real canvas id (no rename needed). If dropped on a
      // sibling element, arrayMove pending to that element's position.
      setPages((prev) =>
        prev.map((page) => {
          if (page.id !== pendingPageId) return page
          const pendingIdx = page.elements.findIndex((e) => e.id === pendingId)
          const overIdx = page.elements.findIndex((e) => e.id === overId)
          if (overIdx === -1 || overIdx === pendingIdx) return page
          return { ...page, elements: arrayMove(page.elements, pendingIdx, overIdx) }
        })
      )
      setSelectedElementId(pendingId)
      setActivePageId(pendingPageId)
      setRightPanel('properties')
      return
    }

    // Canvas drag
    const sourcePageId = findPage(activeId)
    if (!sourcePageId || activeId === overId) return
    const targetPageId = findPage(overId)
    if (sourcePageId !== targetPageId) return

    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== sourcePageId) return page
        const oldIndex = page.elements.findIndex((el) => el.id === activeId)
        const newIndex = page.elements.findIndex((el) => el.id === overId)
        if (oldIndex === -1 || newIndex === -1) return page
        return { ...page, elements: arrayMove(page.elements, oldIndex, newIndex) }
      })
    )

    setPages((prev) => {
      if (prev.length <= 1 || prev[0].elements.length > 0) return prev
      const remaining = prev.slice(1)
      setActivePageId(remaining[0].id)
      return remaining
    })
  }, [])

  const handleDragCancel = useCallback(() => {
    const pendingId = dragSessionRef.current?.pendingElementId
    dragSessionRef.current = null
    setDragSession(null)
    if (pendingId) {
      setPages((prev) =>
        prev.map((page) => ({
          ...page,
          elements: page.elements.filter((el) => el.id !== pendingId),
        }))
      )
    }
  }, [])

  // Find dragged element for overlay
  let draggedElement: CanvasElement | null = null
  if (dragSession && dragSession.type === 'canvas') {
    for (const page of pages) {
      const found = page.elements.find((el) => el.id === dragSession.activeId)
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
    <>
    <DndContext
      id="build-page-dnd"
      sensors={sensors}
      collisionDetection={pointerFirstCollision}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
    <div className="build-page">
      {/* Left Panel - App Elements */}
      <aside className={`build-page__left${leftPanelOpen ? '' : ' build-page__left--hidden'}`}>
        <div className="build-page__left-header">
          <h2>App Elements</h2>
          <button className="build-page__left-close" onClick={() => setLeftPanelOpen(false)}>
            <Icon name="xmark" size={24} />
          </button>
        </div>
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
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
                      <DraggablePanelItem comp={comp}>
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
                      </DraggablePanelItem>
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
      <div className={`build-page__canvas-wrapper${dragSession ? ' build-page__canvas--dragging' : ''}`}>
      <main className="build-page__canvas" onClick={() => {
        setSelectedElementId(null)
        setRightPanel('preview')
      }}>
          {/* Floating Buttons */}
          <div className="build-page__floating-buttons">
            <button className={`build-page__add-element-btn${leftPanelOpen ? ' build-page__add-element-btn--hidden' : ''}`} onClick={(e) => { e.stopPropagation(); if (isMobileView) { setMobileElementsSheet(true); } else { setLeftPanelOpen(true); } }}>
              <Icon name="plus" category="general" size={24} />
              <span className="build-page__add-element-btn-tooltip">Add Element</span>
            </button>
            <button ref={designBtnRef} className={`build-page__design-btn${rightPanel === 'designer' ? ' build-page__design-btn--hidden' : ''}${!designBtnOnHeader ? ' build-page__design-btn--brand' : ''}`} onClick={(e) => {
              e.stopPropagation()
              setSelectedElementId(null)
              setRightPanel('designer')
            }}>
              <Icon name="paint-roller-vertical-filled" category="editor" size={32} />
              <span className="build-page__design-btn-tooltip">App Designer</span>
            </button>
          </div>
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
                      items={itemsByPage[page.id] ?? []}
                      strategy={verticalListSortingStrategy}
                      id={page.id}
                    >
                      <DroppablePage pageId={page.id} isDropTarget={dragSession?.overPageId === page.id}>
                        {page.elements.length === 0 ? (
                          <section
                            className="themes-view__section themes-view__section--center build-page__empty-state"
                            onClick={(e) => { e.stopPropagation(); setActivePageId(page.id); setForceTargetPageId(page.id); setSelectedElementId(null); if (isMobileView) { if (rightPanel === 'designer') setRightPanel('preview'); setMobileElementsSheet(true); } else { setLeftPanelOpen(true); } }}
                          >
                            <EmptyState mobile={isMobileView} />
                          </section>
                        ) : (
                          page.elements.map((element) => {
                            if (dragSession?.type === 'panel' && dragSession.pendingElementId === element.id) {
                              return <DropLinePlaceholder key={element.id} />
                            }
                            return (
                              <SortableElement
                                key={element.id}
                                element={element}
                                isSelected={selectedElementId === element.id}
                                isPending={false}
                                onSelect={handleSelectElement}
                                onPropertyChange={handlePropertyChange}
                              />
                            )
                          })
                        )}
                      </DroppablePage>
                    </SortableContext>
                  </div>

                  {(pageIndex > 0 || page.elements.length > 0 || dragSession) && (
                    <AddPageDivider onClick={() => handleAddPage(page.id)} />
                  )}
                </div>
              ))}
            </div>
          </div>

      </main>

      {/* Page Navigation Bar */}
      {!isMobileView && pages.length > 1 && (
        <PageNavigationBar
          pages={pages}
          activePageId={activePageId}
          onPageSelect={(pageId) => {
            setActivePageId(pageId)
            requestAnimationFrame(() => {
              const el = document.querySelector(`[data-page-id="${pageId}"]`)
              const scrollContainer = document.querySelector('.build-page__canvas')
              if (!el || !scrollContainer) return
              const containerRect = scrollContainer.getBoundingClientRect()
              const elRect = el.getBoundingClientRect()
              const targetY = scrollContainer.scrollTop + elRect.top - containerRect.top - containerRect.height / 2 + elRect.height / 2
              scrollContainer.scrollTo({ top: targetY, behavior: 'smooth' })
            })
          }}
          onPageReorder={(reordered) => setPages(reordered as AppPage[])}
          onPageRename={(pageId, name) => setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, name } : p))}
          onChangeIcon={(pageId, icon) => setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, icon } : p))}
          onDeletePage={(pageId) => {
            setPages((prev) => {
              const filtered = prev.filter((p) => p.id !== pageId)
              if (filtered.length === 0) return prev
              return filtered
            })
            if (activePageId === pageId) {
              const idx = pages.findIndex((p) => p.id === pageId)
              const next = pages[idx - 1] || pages[idx + 1]
              if (next) setActivePageId(next.id)
            }
          }}
          onAddPage={() => handleAddPage(pages[pages.length - 1].id)}
        />
      )}
      </div>

      {/* Right Panel - Designer/Properties or Live Preview */}
      <aside className={`build-page__right ${previewMode || rightPanel === 'designer' ? '' : 'build-page__right--hidden'}`}>

        {/* Sliding content wrapper */}
        <div className={`build-page__right-slider${rightPanel === 'designer' || !previewMode ? ' build-page__right-slider--designer' : ''}`}>

          {/* Slide 1: Live Preview / Properties */}
          <div className="build-page__right-slide">
            {/* Properties Panel */}
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
                    ) : prop.type === 'number' ? (
                      <div className="build-page__prop-number-wrap">
                        <input
                          type="number"
                          className="build-page__prop-number"
                          min={prop.min ?? 0}
                          max={prop.max ?? 200}
                          value={Number(selectedElement.properties[prop.name]) || 0}
                          onChange={(e) =>
                            handlePropertyChange(selectedElement.id, prop.name, Number(e.target.value))
                          }
                        />
                        <span className="build-page__prop-unit">px</span>
                      </div>
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
              <div className="live-preview">
                <div className="live-preview__header">
                  <span className="live-preview__title">Live Preview</span>
                  <div className="live-preview__toolbar">
                    <button className="live-preview__dropdown">
                      <Icon name="mobile" category="technology" size={16} />
                      <span>Phone</span>
                      <Icon name="angle-down" category="arrows" size={16} />
                    </button>
                    <button className="live-preview__tool-btn">
                      <Icon name="magnifying-glass-plus" size={16} />
                    </button>
                    <button className="live-preview__tool-btn">
                      <Icon name="qr" category="media" size={16} />
                    </button>
                  </div>
                </div>
                <div className="live-preview__body">
                  <div className="live-preview__phone">
                    {/* Layer 1: Gray shell */}
                    <div className="live-preview__phone-shell app-scope" />
                    {/* Layer 3: Black bezel */}
                    <div className="live-preview__phone-bezel" />
                    {/* Layer 4: Screen */}
                    <div className="live-preview__phone-screen">
                      <div className={`live-preview__status-bar-bg app-scope${activePageId === pages[0]?.id ? ' live-preview__status-bar-bg--header' : ''}`} />
                      <PhoneStatusBar className={`live-preview__status-bar app-scope${activePageId === pages[0]?.id ? ' live-preview__status-bar--header' : ''}`} style={{ color: activePageId === pages[0]?.id ? 'var(--fg-inverse)' : 'var(--fg-primary, #000)' }} />
                      <div className="live-preview__content-scaler app-scope">
                        <div className="live-preview__content app-scope">
                          {(() => {
                            const activePage = pages.find((p) => p.id === activePageId) || pages[0]
                            const isFirstPage = activePage?.id === pages[0]?.id
                            return activePage ? (
                              <>
                              {isFirstPage && <AppHeader layout="Center" title={appTitle} subtitle={appSubtitle} />}
                              <div className={`themes-view__canvas${isFirstPage ? ' themes-view__canvas--first' : ''}`}>
                                <div className="themes-view__app">
                                  {activePage.elements.map((element) => {
                                    const comp = ComponentRegistry.get(element.componentId)
                                    if (!comp) return null
                                    const previewProps = {
                                      ...element.properties,
                                      'Add New Card': false,
                                    }
                                    return (
                                      <section key={element.id} className="themes-view__section">
                                        {comp.render(element.variants, previewProps, element.states)}
                                      </section>
                                    )
                                  })}
                                </div>
                              </div>
                              </>
                            ) : null
                          })()}
                        </div>
                      </div>
                      {pages.length > 1 && (
                        <div className="live-preview__bottom-nav app-scope">
                          <BottomNavigation
                            items={pages.slice(0, 5).map((p, i) => ({ icon: getPageIconName(p, i), label: p.name }))}
                            activeIndex={pages.slice(0, 5).findIndex((p) => p.id === activePageId)}
                            onItemClick={(index) => setActivePageId(pages[index].id)}
                          />
                        </div>
                      )}
                      <img src={phoneHomeIndicator} alt="" className="live-preview__home-indicator" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slide 2: App Designer */}
          <div className="build-page__right-slide build-page__right-slide--designer" data-theme="dark">
            <AppDesigner
              onClose={handleCloseDesigner}
              targetSelector=".app-scope"
              isMobile={isMobileView}
              visible={rightPanel === 'designer'}
              renderIcon={(name, size) => <Icon name={name} category="editor" size={size} />}
              doneButton={<DSButton variant="filled" colorScheme="primary" shape="rounded" size="md" onClick={handleCloseDesigner}>Done</DSButton>}
            />
          </div>

        </div>
      </aside>
    </div>

      <DragOverlay dropAnimation={dragSession?.type === 'panel' ? null : undefined} modifiers={[snapCenterToCursor]}>
        {dragSession?.type === 'panel' ? (
          <PanelDragOverlay componentId={dragSession.activeId.replace('panel:', '')} />
        ) : draggedElement ? (
          <PanelDragOverlay componentId={draggedElement.componentId} />
        ) : null}
      </DragOverlay>
    </DndContext>

    {/* Mobile: Add Element Bottom Sheet */}
    <BottomSheet
      open={mobileElementsSheet}
      onClose={() => setMobileElementsSheet(false)}
      title="App Elements"
      noOverlay
      dark
      renderCloseButton={(onClose) => (
        <button className="sidebar-panel__close" onClick={onClose}>
          <Icon name="xmark" category="general" size={20} />
        </button>
      )}
    >
      <div className="mobile-elements-sheet v2-sheet">
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
        {activeGroups.map((group, groupIndex) => {
          const validItems = group.elementIds.map((id) => componentMap[id]).filter(Boolean)
          if (validItems.length === 0) return null
          return (
            <div key={group.label || groupIndex}>
              {group.label && (
                <div className="mobile-elements-grid__separator">{group.label}</div>
              )}
              <div className="mobile-elements-grid">
                {validItems.map((comp) => {
                  const iconInfo = ELEMENT_ICON_MAP[comp.id]
                  return (
                    <button
                      key={comp.id}
                      className="mobile-elements-grid__item"
                      onClick={() => { handleAddElement(comp); }}
                    >
                      <div className="mobile-elements-grid__icon">
                        {iconInfo ? (
                          <Icon name={iconInfo.icon} category={iconInfo.iconCategory} size={24} />
                        ) : (
                          <Icon name="grid-2-filled" category="layout" size={24} />
                        )}
                      </div>
                      <span className="mobile-elements-grid__label">{comp.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </BottomSheet>

    </>
  )
}
