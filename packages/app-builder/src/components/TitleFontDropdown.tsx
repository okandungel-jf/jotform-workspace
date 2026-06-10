import { useEffect } from 'react'
import { DropdownSingle as DSDropdownSingle } from '@jf/design-system'
import { HEADING_FONT_OPTIONS, loadGoogleFont } from '@jf/app-elements'

interface TitleFontDropdownProps {
  value: string
  onChange: (value: string) => void
}

// App Header "Title Font" picker. Mirrors the App Designer's Heading Font dropdown
// — same font catalogue (HEADING_FONT_OPTIONS), each option previewed in its own
// typeface — but rendered with our DS DropdownSingle (no leading icon) so it sits
// natively in the properties panel.
export function TitleFontDropdown({ value, onChange }: TitleFontDropdownProps) {
  // Pull the Google fonts so the previews (and trigger) render in the real face.
  useEffect(() => {
    HEADING_FONT_OPTIONS.forEach(loadGoogleFont)
  }, [])

  return (
    <DSDropdownSingle
      value={value}
      onChange={onChange}
      showLeadingIcon={false}
      options={HEADING_FONT_OPTIONS.map((f) => ({
        value: f,
        label: f,
        labelStyle: { fontFamily: `'${f}', sans-serif` },
      }))}
    />
  )
}
