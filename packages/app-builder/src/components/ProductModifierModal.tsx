import { useEffect, useState, type FC } from 'react'
import {
  Modal as DSModal,
  Input as DSInput,
  DropdownSingle as DSDropdownSingle,
  FormField as DSFormField,
  Checkbox as DSCheckbox,
} from '@jf/design-system'
import type { ProductModifier, ProductModifierFieldType } from '@jf/app-elements'

interface ProductModifierModalProps {
  open: boolean
  /** When set, the modal edits this modifier; otherwise it adds a new one. */
  modifier?: ProductModifier | null
  onClose: () => void
  onSubmit: (name: string, fieldType: ProductModifierFieldType, required: boolean) => void
}

const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text choices' },
  { value: 'color', label: 'Color swatches' },
  { value: 'textbox', label: 'Text box' },
]

/** Builder modal for adding or editing a product modifier. */
export const ProductModifierModal: FC<ProductModifierModalProps> = ({ open, modifier, onClose, onSubmit }) => {
  const [name, setName] = useState('')
  const [fieldType, setFieldType] = useState('text')
  const [required, setRequired] = useState(false)

  // Prefill once when the modal opens — blank for add, existing values for edit.
  useEffect(() => {
    if (!open) return
    setName(modifier?.name ?? '')
    setFieldType(modifier?.fieldType ?? 'text')
    setRequired(modifier?.required ?? false)
  }, [open])

  const canSubmit = name.trim() !== ''

  return (
    <DSModal
      open={open}
      onClose={onClose}
      size="md"
      title={modifier ? 'Edit Modifier' : 'Add Modifier'}
      description="Add a customization field that won't affect price or stock."
      cancelLabel="Cancel"
      confirmLabel={modifier ? 'Save' : 'Add'}
      confirmDisabled={!canSubmit}
      onConfirm={() => {
        if (!canSubmit) return
        onSubmit(name.trim(), fieldType as ProductModifierFieldType, required)
        onClose()
      }}
    >
      <div className="product-modifier-modal">
        <DSFormField
          title="Modifier name"
          required
          size="md"
          showDescription={false}
          showHelpText
          helpText="The name will be used as the field title."
        >
          <DSInput
            value={name}
            placeholder="e.g., Embroidery pattern"
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
          />
        </DSFormField>
        <DSFormField title="Field type" size="md" showDescription={false} showHelpText={false}>
          <DSDropdownSingle
            value={fieldType}
            showLeadingIcon={false}
            onChange={setFieldType}
            options={FIELD_TYPE_OPTIONS}
            usePortal
          />
        </DSFormField>
        <DSCheckbox
          className="product-modifier-modal__required"
          label="This is a required field"
          size="sm"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
      </div>
    </DSModal>
  )
}
