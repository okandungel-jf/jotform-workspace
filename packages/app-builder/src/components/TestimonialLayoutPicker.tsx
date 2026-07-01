import './TestimonialLayoutPicker.scss'

// The Testimonial layout archetypes, shown as visual thumbnails in the Style tab
// (mirrors the App Header's Header Layout picker).
export type TestimonialLayout = 'Carousel' | 'Slider' | 'Grid' | 'Spotlight'

const OPTIONS: { value: TestimonialLayout; label: string }[] = [
  { value: 'Carousel', label: 'Carousel' },
  { value: 'Slider', label: 'Slider' },
  { value: 'Grid', label: 'Grid' },
  { value: 'Spotlight', label: 'Spotlight' },
]

// Solid mock-shape colour; the translucent card/nav placeholders reuse it at low
// opacity. The card surface itself comes from the __box background token.
const FILL = 'var(--secondary-text-white)'

// A single card cell (two text lines) used to build the Grid's 2×2 wall.
const gridCard = (x: number, y: number) => (
  <g key={`${x}-${y}`}>
    <rect x={x} y={y} width={28} height={20} rx={2} fill={FILL} fillOpacity={0.1} />
    <rect x={x + 4} y={y + 6} width={16} height={3} rx={1} fill={FILL} />
    <rect x={x + 4} y={y + 11} width={12} height={3} rx={1} fill={FILL} />
  </g>
)

const grid2x2 = (
  <>
    {gridCard(18.25, 12)}
    {gridCard(48.25, 12)}
    {gridCard(18.25, 34)}
    {gridCard(48.25, 34)}
  </>
)

// Each option renders a tiny abstract mock of the layout, transcribed 1:1 from the
// reference SVGs (viewBox 95×66). Colors are DS tokens — no hardcoded values.
function LayoutArt({ value }: { value: TestimonialLayout }) {
  return (
    <svg
      className="testimonial-layout-picker__art"
      viewBox="0 0 95 66"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {value === 'Carousel' && (
        <>
          <circle cx={18.25} cy={33} r={4} fill={FILL} fillOpacity={0.1} />
          <rect x={26.25} y={19} width={42} height={28} rx={2} fill={FILL} fillOpacity={0.1} />
          <rect x={30.25} y={29} width={32} height={3} rx={1} fill={FILL} />
          <rect x={30.25} y={34} width={16} height={3} rx={1} fill={FILL} />
          <circle cx={76.25} cy={33} r={4} fill={FILL} fillOpacity={0.1} />
        </>
      )}
      {value === 'Slider' && (
        <>
          <rect x={18.25} y={19} width={10} height={28} rx={2} fill="url(#tlp-slider-l)" fillOpacity={0.1} />
          <rect x={30.25} y={19} width={34} height={28} rx={2} fill={FILL} fillOpacity={0.1} />
          <rect x={34.25} y={29} width={24} height={3} rx={1} fill={FILL} />
          <rect x={34.25} y={34} width={16} height={3} rx={1} fill={FILL} />
          <rect x={66.25} y={19} width={10} height={28} rx={2} fill="url(#tlp-slider-r)" fillOpacity={0.1} />
          <defs>
            <linearGradient id="tlp-slider-l" x1={28.25} y1={33} x2={18.25} y2={33} gradientUnits="userSpaceOnUse">
              <stop stopColor={FILL} />
              <stop offset={1} stopColor={FILL} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tlp-slider-r" x1={76.25} y1={33} x2={66.25} y2={33} gradientUnits="userSpaceOnUse">
              <stop stopColor={FILL} stopOpacity={0} />
              <stop offset={1} stopColor={FILL} />
            </linearGradient>
          </defs>
        </>
      )}
      {value === 'Grid' && grid2x2}
      {value === 'Spotlight' && (
        <>
          <circle cx={18.25} cy={33} r={4} fill={FILL} fillOpacity={0.1} />
          <rect x={31.25} y={26.5} width={32} height={3} rx={1} fill={FILL} />
          <rect x={33.25} y={31.5} width={28} height={3} rx={1} fill={FILL} />
          <rect x={39.25} y={36.5} width={16} height={3} rx={1} fill={FILL} />
          <circle cx={76.25} cy={33} r={4} fill={FILL} fillOpacity={0.1} />
        </>
      )}
    </svg>
  )
}

interface TestimonialLayoutPickerProps {
  value: string
  onChange: (value: string) => void
}

export function TestimonialLayoutPicker({ value, onChange }: TestimonialLayoutPickerProps) {
  return (
    <div className="testimonial-layout-picker" role="radiogroup" aria-label="Testimonial layout">
      {OPTIONS.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`testimonial-layout-picker__option${selected ? ' testimonial-layout-picker__option--selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="testimonial-layout-picker__box">
              <LayoutArt value={opt.value} />
            </span>
            <span className="testimonial-layout-picker__label">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
