import { useState, useRef, useEffect, useLayoutEffect, useMemo, type FC } from 'react'
import { createPortal } from 'react-dom'
import { SearchInput } from '@jf/design-system'
import { icons as lucideIcons } from 'lucide-react'

export function LucideIcon({ name, size = 18 }: { name: string; size?: number }) {
  const IconComp = lucideIcons[name as keyof typeof lucideIcons] as FC<{ size?: number }> | undefined
  if (!IconComp) return null
  return <IconComp size={size} />
}

export const ALL_ICON_NAMES = Object.keys(lucideIcons).filter(
  (name) => name !== 'createLucideIcon' && name !== 'icons' && name !== 'default' && /^[A-Z]/.test(name)
)

export const POPULAR_ICONS = [
  // Core nav
  'Home', 'Search', 'Settings', 'User', 'Heart', 'Star', 'Bell', 'ShoppingCart',
  'MessageCircle', 'Mail', 'Phone', 'MapPin', 'Navigation', 'Calendar', 'Clock',
  // Media & content
  'Camera', 'Image', 'Play', 'Music', 'Bookmark', 'Tag', 'Gift',
  'CreditCard', 'Wallet', 'QrCode', 'ScanLine', 'Barcode',
  // Data & progress
  'BarChart3', 'TrendingUp', 'PieChart', 'Activity', 'Target', 'Gauge',
  // Files & actions
  'FileText', 'Folder', 'Download', 'Upload', 'Share2', 'Send',
  // Status & info
  'CheckCircle2', 'AlertCircle', 'Info', 'HelpCircle', 'ShieldCheck',
  // Interaction
  'Plus', 'Menu', 'Filter', 'SlidersHorizontal', 'ListFilter',
  'Eye', 'Lock', 'Unlock', 'LogIn', 'LogOut',
  // Environment
  'Sun', 'Moon', 'Cloud', 'Flame', 'Zap', 'Sparkles',
  // Lifestyle
  'Coffee', 'Utensils', 'Dumbbell', 'Bike', 'Car', 'Plane', 'Train', 'Ship',
  // Work & education
  'Briefcase', 'GraduationCap', 'Stethoscope', 'Palette', 'Wrench', 'Hammer',
  // Tech
  'Code', 'Terminal', 'Database', 'Cpu', 'Smartphone', 'Laptop', 'Globe', 'Wifi',
  // People & social
  'Users', 'UserPlus', 'CircleUser', 'HandHeart', 'ThumbsUp', 'PartyPopper',
  // Shapes & layout
  'Layers', 'Grid3X3', 'LayoutDashboard', 'Compass', 'Map',
  // Rewards
  'Trophy', 'Medal', 'Crown', 'Gem', 'Rocket',
  // Objects
  'Key', 'Lightbulb', 'Megaphone', 'Newspaper', 'Package', 'Truck',
  'Store', 'Building2', 'Landmark', 'Trees', 'Flower2', 'Leaf',
  'PawPrint', 'Cat', 'Dog', 'Fish', 'Bird',
  'Shirt', 'Watch', 'Glasses', 'Umbrella',
]

const ITEM_SIZE = 42 // 40px + 2px gap
const GRID_PADDING = 8 // --ds-space-sm
const OVERSCAN = 2 // extra rows above/below viewport

export interface IconPickerPopoverProps {
  value: string
  anchorPos: { top: number; left: number }
  /** Default 'top-center' — shifts popover above the anchor. Set 'bottom-left' to render below, left-aligned. */
  placement?: 'top-center' | 'bottom-left'
  /** Override the popover width (defaults to 320px). */
  width?: number
  /** Hide the "Select Icon" header (with title + close button). Default false. */
  hideHeader?: boolean
  onSelect: (icon: string) => void
  onClose: () => void
}

export function IconPickerPopover({ value, anchorPos, placement = 'top-center', width, hideHeader, onSelect, onClose }: IconPickerPopoverProps) {
  const [search, setSearch] = useState('')
  const [tooltip, setTooltip] = useState<{ name: string; top: number; left: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [cols, setCols] = useState(7)
  const [availableWidth, setAvailableWidth] = useState(0)

  const filtered = useMemo(() => {
    const popularSet = new Set(POPULAR_ICONS)
    const popular = POPULAR_ICONS.filter((name) => ALL_ICON_NAMES.includes(name))
    const rest = ALL_ICON_NAMES.filter((name) => !popularSet.has(name))
    let icons = [...popular, ...rest]
    if (value && icons.includes(value)) {
      icons = [value, ...icons.filter((name) => name !== value)]
    }
    if (search) {
      const q = search.toLowerCase()
      icons = icons.filter((name) => name.toLowerCase().includes(q))
    }
    return icons
  }, [search, value])

  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el) return
    const measure = () => {
      const w = el.getBoundingClientRect().width - GRID_PADDING * 2
      if (w <= 0) return
      setAvailableWidth(w)
      setCols(Math.max(1, Math.floor(w / ITEM_SIZE)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const totalRows = Math.ceil(filtered.length / cols)
  const totalHeight = totalRows * ITEM_SIZE
  const gridViewHeight = gridRef.current?.clientHeight ?? 300

  const startRow = Math.max(0, Math.floor(scrollTop / ITEM_SIZE) - OVERSCAN)
  const endRow = Math.min(totalRows, Math.ceil((scrollTop + gridViewHeight) / ITEM_SIZE) + OVERSCAN)

  const visibleItems = useMemo(() => {
    const items: { name: string; row: number; col: number }[] = []
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col
        if (idx < filtered.length) {
          items.push({ name: filtered[idx], row, col })
        }
      }
    }
    return items
  }, [filtered, startRow, endRow, cols])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  useEffect(() => {
    if (gridRef.current) gridRef.current.scrollTop = 0
    setScrollTop(0)
  }, [search])

  return (<>
    {createPortal(
    <div
      ref={popoverRef}
      className={`icon-picker-popover icon-picker-popover--${placement}`}
      data-theme="dark"
      style={{ top: anchorPos.top, left: anchorPos.left, ...(width ? { width } : null) }}
    >
      {!hideHeader && (
        <div className="icon-picker-popover__header">
          <h2>Select Icon</h2>
          <button className="icon-picker-popover__close" onClick={onClose}>
            <LucideIcon name="X" size={18} />
          </button>
        </div>
      )}
      <div className="icon-picker-popover__search">
        <SearchInput
          size="md"
          placeholder={`Search ${filtered.length} icons...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          autoFocus={false}
        />
      </div>
      <div
        ref={gridRef}
        className="icon-picker-popover__grid"
        onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      >
        {filtered.length === 0 && (
          <span className="icon-picker-popover__empty"><LucideIcon name="Frown" size={32} />No icons found</span>
        )}
        {filtered.length > 0 && (
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleItems.map(({ name, row, col }) => (
              <button
                key={name}
                className={`icon-picker-popover__item${name === value ? ' icon-picker-popover__item--active' : ''}`}
                style={{
                  position: 'absolute',
                  top: row * ITEM_SIZE,
                  left: cols > 0 ? col * (availableWidth / cols) : 0,
                  width: cols > 0 ? availableWidth / cols - 2 : ITEM_SIZE - 2,
                  height: ITEM_SIZE - 2,
                }}
                onClick={() => onSelect(name)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget
                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                  tooltipTimer.current = setTimeout(() => {
                    const rect = target.getBoundingClientRect()
                    setTooltip({
                      name,
                      top: rect.top,
                      left: rect.left + rect.width / 2,
                    })
                  }, 400)
                }}
                onMouseLeave={() => {
                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                  setTooltip(null)
                }}
              >
                <LucideIcon name={name} size={20} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )}
  {tooltip && createPortal(
    <div
      className="icon-picker-popover__tooltip"
      style={{ top: tooltip.top, left: tooltip.left }}
    >
      {tooltip.name}
    </div>,
    document.body
  )}
  </>)
}
