import { type ReactNode } from 'react'

interface BasicPhonePreviewProps {
  children?: ReactNode
}

export function BasicPhonePreview({ children }: BasicPhonePreviewProps) {
  return (
    <div className="basic-phone">
      <div className="basic-phone__screen">{children}</div>
    </div>
  )
}
