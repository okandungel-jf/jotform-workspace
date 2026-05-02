import { type ReactNode } from 'react'

interface QuickPreviewProps {
  children?: ReactNode
}

export function QuickPreview({ children }: QuickPreviewProps) {
  return (
    <aside className="quick-preview">
      <div className="quick-preview__header">
        <p className="quick-preview__title">Quick Preview</p>
      </div>
      <div className="quick-preview__body">{children}</div>
    </aside>
  )
}
