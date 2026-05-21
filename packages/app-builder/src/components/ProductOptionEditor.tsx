import { useState, type FC } from 'react'
import { Input as DSInput, Icon } from '@jf/design-system'
import { MAX_VALUES_PER_DIMENSION, type ProductOptionDimension } from '@jf/app-elements'

interface ProductOptionEditorProps {
  option: ProductOptionDimension
  onChange: (option: ProductOptionDimension) => void
  onBack: () => void
}

// ── Tag input for an option's values ──
const ValueTagInput: FC<{
  values: string[]
  onChange: (values: string[]) => void
}> = ({ values, onChange }) => {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const value = draft.trim()
    setDraft('')
    if (!value) return
    if (values.some((v) => v.toLowerCase() === value.toLowerCase())) return
    onChange([...values, value])
  }

  return (
    <div className="product-option-editor__tags">
      {values.map((value) => (
        <span key={value} className="product-option-editor__tag">
          {value}
          <button
            type="button"
            className="product-option-editor__tag-remove"
            aria-label={`Remove ${value}`}
            onClick={() => onChange(values.filter((v) => v !== value))}
          >
            <Icon name="xmark" size={12} />
          </button>
        </span>
      ))}
      <input
        className="product-option-editor__tag-input"
        value={draft}
        placeholder={values.length === 0 ? 'Add a value, press Enter' : 'Add value'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit()
          } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
            onChange(values.slice(0, -1))
          }
        }}
        onBlur={commit}
      />
    </div>
  )
}

/** L3 — edits a single product option (a variant dimension): its label and values. */
export const ProductOptionEditor: FC<ProductOptionEditorProps> = ({ option, onChange, onBack }) => {
  return (
    <div className="product-option-editor">
      <div className="product-option-editor__header">
        <button type="button" className="product-option-editor__back" aria-label="Back" onClick={onBack}>
          <Icon name="caret-left" category="arrows" size={20} />
        </button>
        <span className="product-option-editor__title">Product Option</span>
      </div>

      <div className="product-option-editor__body">
        <div className="product-option-editor__field">
          <label className="product-option-editor__field-label">Label</label>
          <DSInput
            value={option.label}
            placeholder="e.g. Color"
            onChange={(e) => onChange({ ...option, label: e.target.value })}
          />
        </div>

        <div className="product-option-editor__field">
          <label className="product-option-editor__field-label">Values</label>
          <ValueTagInput
            values={option.values}
            onChange={(values) => onChange({ ...option, values })}
          />
          {option.values.length > MAX_VALUES_PER_DIMENSION && (
            <p className="product-option-editor__warning">
              {option.values.length} values is a lot — consider splitting this option.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
