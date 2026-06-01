import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AppIcon,
  Button,
  useCart,
  useFavorites,
  useProductDetail,
  variantLabel as buildVariantLabel,
  buildVariantId,
  type ProductItem,
  type ProductOptionDimension,
  type ProductModifier,
} from '@jf/app-elements'

interface LivePreviewProductDetailPageProps {
  currency?: string
}

/** Resolve the first defined choice price across the selected option dimensions. */
function resolvePrice(product: ProductItem, selected: Record<string, string>): string {
  let price = product.price
  for (const dim of product.optionDimensions ?? []) {
    const choice = dim.values.find((v) => v.name === selected[dim.label])
    if (choice?.price) price = choice.price
  }
  return price
}

/** Whether a given option choice can be selected (defaults to in stock). */
function choiceInStock(dim: ProductOptionDimension, name: string): boolean {
  const choice = dim.values.find((v) => v.name === name)
  return choice ? choice.inStock !== false : true
}

// ============================================
// Dropdown — used for text-type option dimensions
// ============================================
function DetailDropdown({
  label,
  value,
  options,
  onSelect,
  isOptionDisabled,
}: {
  label: string
  value: string
  options: string[]
  onSelect: (value: string) => void
  isOptionDisabled?: (value: string) => boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div className="live-preview__detail-dropdown" ref={ref}>
      <button
        type="button"
        className="live-preview__detail-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="live-preview__detail-dropdown-label">{label}</span>
        <span className="live-preview__detail-dropdown-value">
          {value}
          <AppIcon name="ChevronDown" size={18} />
        </span>
      </button>
      {open && (
        <ul className="live-preview__detail-dropdown-list" role="listbox">
          {options.map((opt) => {
            const disabled = isOptionDisabled?.(opt) ?? false
            return (
              <li key={opt} role="option" aria-selected={opt === value}>
                <button
                  type="button"
                  className={`live-preview__detail-dropdown-option${opt === value ? ' live-preview__detail-dropdown-option--active' : ''}`}
                  disabled={disabled}
                  onClick={() => {
                    onSelect(opt)
                    setOpen(false)
                  }}
                >
                  <span>{opt}</span>
                  {disabled && <span className="live-preview__detail-oos">Out of stock</span>}
                  {!disabled && opt === value && <AppIcon name="Check" size={16} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ============================================
// Pill selector — color-type options & text modifiers
// ============================================
function PillSelect({
  options,
  value,
  onSelect,
  isOptionDisabled,
}: {
  options: string[]
  value: string
  onSelect: (value: string) => void
  isOptionDisabled?: (value: string) => boolean
}) {
  return (
    <div className="live-preview__detail-pills">
      {options.map((opt) => {
        const disabled = isOptionDisabled?.(opt) ?? false
        return (
          <button
            key={opt}
            type="button"
            className={`live-preview__detail-pill${opt === value ? ' live-preview__detail-pill--active' : ''}`}
            disabled={disabled}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// Color swatches — color-type modifiers (carry a hex)
// ============================================
function ColorSwatchSelect({
  choices,
  value,
  onSelect,
}: {
  choices: { id: string; value: string; color?: string }[]
  value: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="live-preview__detail-swatches">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          className={`live-preview__detail-swatch${choice.value === value ? ' live-preview__detail-swatch--active' : ''}`}
          title={choice.value}
          aria-label={choice.value}
          onClick={() => onSelect(choice.value)}
        >
          <span
            className="live-preview__detail-swatch-dot"
            style={{ background: choice.color || 'var(--bg-fill-secondary)' }}
          />
        </button>
      ))}
    </div>
  )
}

// ============================================
// Modifier renderer
// ============================================
function ModifierField({
  modifier,
  value,
  onChange,
}: {
  modifier: ProductModifier
  value: string
  onChange: (value: string) => void
}) {
  if (modifier.fieldType === 'textbox') {
    const limit = modifier.characterLimit
    return (
      <div className="live-preview__detail-field">
        <span className="live-preview__detail-field-label">
          {modifier.textBoxTitle || modifier.name}
          {modifier.required && <span className="live-preview__detail-required">*</span>}
        </span>
        <textarea
          className="live-preview__detail-textarea"
          value={value}
          maxLength={limit}
          rows={3}
          placeholder="Type here…"
          onChange={(e) => onChange(e.target.value)}
        />
        {limit ? (
          <span className="live-preview__detail-charcount">
            {value.length}/{limit}
          </span>
        ) : null}
      </div>
    )
  }

  const choices = modifier.choices ?? []
  return (
    <div className="live-preview__detail-field">
      <span className="live-preview__detail-field-label">
        {modifier.name}
        {modifier.required && <span className="live-preview__detail-required">*</span>}
      </span>
      {modifier.fieldType === 'color' ? (
        <ColorSwatchSelect choices={choices} value={value} onSelect={onChange} />
      ) : (
        <PillSelect options={choices.map((c) => c.value)} value={value} onSelect={onChange} />
      )}
    </div>
  )
}

export function LivePreviewProductDetailPage({
  currency = '$',
}: LivePreviewProductDetailPageProps) {
  const productDetail = useProductDetail()
  const cart = useCart()
  const favorites = useFavorites()
  const product = productDetail?.product ?? null

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [descOpen, setDescOpen] = useState(true)

  // Seed selections from the product's first choices whenever a new product opens.
  useEffect(() => {
    if (!product) return
    const opts: Record<string, string> = {}
    for (const dim of product.optionDimensions ?? []) {
      const firstInStock = dim.values.find((v) => v.inStock !== false) ?? dim.values[0]
      if (firstInStock) opts[dim.label] = firstInStock.name
    }
    const mods: Record<string, string> = {}
    for (const mod of product.modifiers ?? []) {
      if (mod.fieldType === 'textbox') mods[mod.id] = ''
      else if (mod.choices?.length) mods[mod.id] = mod.choices[0].value
    }
    setSelectedOptions(opts)
    setSelectedModifiers(mods)
    setQuantity(1)
    setDescOpen(true)
  }, [product])

  const effectivePrice = useMemo(
    () => (product ? resolvePrice(product, selectedOptions) : ''),
    [product, selectedOptions],
  )

  if (!product) return null

  const hasVariants = (product.optionDimensions?.length ?? 0) > 0
  const variantId = hasVariants ? buildVariantId(selectedOptions) : undefined
  const variantLabel = hasVariants ? buildVariantLabel(selectedOptions) : undefined
  const inCart = cart?.has(product.name, variantId) ?? false
  const liked = favorites?.has(product.name) ?? false

  const addToCart = () => {
    cart?.add(
      { name: product.name, price: effectivePrice, image: product.image, variantId, variantLabel },
      quantity,
    )
  }

  return (
    <aside className="live-preview__detail-page app-scope" role="dialog" aria-label={product.name}>
      <div className="live-preview__detail-scroll">
        {/* Image hero */}
        <div className="live-preview__detail-hero">
          {product.image ? (
            <img className="live-preview__detail-hero-img" src={product.image} alt={product.name} />
          ) : (
            <div className="live-preview__detail-hero-placeholder">
              <AppIcon name="Image" size={64} />
            </div>
          )}
          <button
            type="button"
            className="live-preview__detail-circle live-preview__detail-back"
            aria-label="Back"
            onClick={() => productDetail?.close()}
          >
            <AppIcon name="ChevronLeft" size={20} />
          </button>
          <div className="live-preview__detail-hero-actions">
            <button
              type="button"
              className={`live-preview__detail-circle${liked ? ' live-preview__detail-circle--liked' : ''}`}
              aria-label="Favorite"
              aria-pressed={liked}
              onClick={() =>
                favorites?.toggle({ name: product.name, price: product.price, image: product.image })
              }
            >
              <AppIcon name="Heart" size={18} forceStyle={liked ? 'fill' : 'outline'} />
            </button>
          </div>
        </div>

        <div className="live-preview__detail-body">
          {/* Title + price */}
          <h1 className="live-preview__detail-title">{product.name}</h1>
          <p className="live-preview__detail-price">
            {currency}
            {effectivePrice}
          </p>

          {/* Options */}
          {product.optionDimensions?.map((dim) =>
            dim.type === 'color' ? (
              <div key={dim.id} className="live-preview__detail-field">
                <span className="live-preview__detail-field-label">{dim.label}</span>
                <PillSelect
                  options={dim.values.map((v) => v.name)}
                  value={selectedOptions[dim.label] ?? ''}
                  onSelect={(name) => setSelectedOptions((prev) => ({ ...prev, [dim.label]: name }))}
                  isOptionDisabled={(name) => !choiceInStock(dim, name)}
                />
              </div>
            ) : (
              <DetailDropdown
                key={dim.id}
                label={dim.label}
                value={selectedOptions[dim.label] ?? ''}
                options={dim.values.map((v) => v.name)}
                onSelect={(name) => setSelectedOptions((prev) => ({ ...prev, [dim.label]: name }))}
                isOptionDisabled={(name) => !choiceInStock(dim, name)}
              />
            ),
          )}

          {/* Modifiers */}
          {product.modifiers?.map((mod) => (
            <ModifierField
              key={mod.id}
              modifier={mod}
              value={selectedModifiers[mod.id] ?? ''}
              onChange={(val) => setSelectedModifiers((prev) => ({ ...prev, [mod.id]: val }))}
            />
          ))}

          {/* Quantity */}
          <div className="live-preview__detail-field live-preview__detail-qty-field">
            <span className="live-preview__detail-field-label">Quantity</span>
            <div className="live-preview__detail-stepper" role="group" aria-label="Quantity">
              <button
                type="button"
                className="live-preview__detail-stepper-btn"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <AppIcon name="Minus" size={16} />
              </button>
              <span className="live-preview__detail-stepper-count">{quantity}</span>
              <button
                type="button"
                className="live-preview__detail-stepper-btn"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <AppIcon name="Plus" size={16} />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="live-preview__detail-cta">
            <Button
              variant="Default"
              corner="Default"
              size="Default"
              fullWidth
              leftIcon={inCart ? 'Check' : 'none'}
              rightIcon="none"
              state={inCart ? 'Disabled' : 'Default'}
              label={inCart ? 'Added to bag' : 'Add to bag'}
              onClick={inCart ? undefined : addToCart}
            />
          </div>

          {/* Description */}
          {product.description && (
            <div className="live-preview__detail-accordion">
              <button
                type="button"
                className="live-preview__detail-accordion-head"
                aria-expanded={descOpen}
                onClick={() => setDescOpen((v) => !v)}
              >
                <span>Description</span>
                <AppIcon name={descOpen ? 'ChevronUp' : 'ChevronDown'} size={18} />
              </button>
              {descOpen && (
                <p className="live-preview__detail-accordion-body">{product.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
