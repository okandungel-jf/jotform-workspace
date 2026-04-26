import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ColorInput } from '@jf/design-system'
import { TokenColorPicker } from '@jf/app-elements'

interface ColorInputWithPickerProps {
  size?: 'sm' | 'md' | 'lg'
  color: string
  onColorChange: (color: string) => void
}

export function ColorInputWithPicker({ size = 'md', color, onColorChange }: ColorInputWithPickerProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<CSSProperties>({})
  const wrapperRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Position the picker below the input.
  useEffect(() => {
    if (!open) return
    const el = wrapperRef.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setPos({ position: 'fixed', top: r.bottom + 4, left: r.right, transform: 'translateX(-100%)', zIndex: 1000 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapperRef.current?.contains(t)) return
      if (popoverRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={wrapperRef} style={{ width: '100%' }}>
      <ColorInput
        size={size}
        color={color}
        onColorChange={onColorChange}
        onSwatchClick={() => setOpen((o) => !o)}
      />
      {open && createPortal(
        <div ref={popoverRef} className="color-input-popover" data-theme="dark" style={pos}>
          <TokenColorPicker
            color={color}
            onChange={onColorChange}
            tint={50}
            onTintChange={() => {}}
          />
        </div>,
        document.body
      )}
    </div>
  )
}
