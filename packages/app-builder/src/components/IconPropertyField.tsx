import { useState, useRef } from 'react'
import { Icon } from '@jf/design-system'
import { IconPickerPopover, LucideIcon } from './IconPicker'

interface IconPropertyFieldProps {
  value: string
  onChange: (value: string) => void
}

export function IconPropertyField({ value, onChange }: IconPropertyFieldProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleOpen = () => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left })
    setOpen(true)
  }

  const triggerClass = ['jf-dropdown', 'jf-dropdown--md', 'jf-dropdown--default', open && 'jf-dropdown--open']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="jf-dropdown__root">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleOpen}
      >
        <span className="jf-dropdown__leading">
          {value ? <LucideIcon name={value} size={20} /> : <Icon name="image-line-filled" category="general" size={20} />}
        </span>
        <span className={`jf-dropdown__value${value ? '' : ' jf-dropdown__value--placeholder'}`}>
          {value || 'Select icon'}
        </span>
        <span className="jf-dropdown__trailing">
          <Icon name={open ? 'angle-up' : 'angle-down'} category="arrows" size={24} />
        </span>
      </button>
      {open && (
        <IconPickerPopover
          value={value}
          anchorPos={pos}
          onSelect={(name) => {
            onChange(name)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
