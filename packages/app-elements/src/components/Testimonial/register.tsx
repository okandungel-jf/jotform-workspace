import { ComponentRegistry } from '../../types/registry';
import { Testimonial, type TestimonialItem, type TestimonialLayout, type TestimonialAlignment, type TestimonialCardStyle } from './Testimonial';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import testimonialScss from './Testimonial.scss?raw';

const DEFAULT_ITEMS: TestimonialItem[] = [
  { name: 'Sarah Johnson', role: 'Marketing Director', rating: 5, text: '“This platform transformed how we collect donations. The interface is intuitive and our donors love it.”', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
  { name: 'Michael Chen', role: 'Founder, Lumen', rating: 5, text: '“Setup was incredibly easy. We were up and running in minutes, not days.”', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
  { name: 'Emily Davis', role: 'Product Lead', rating: 4, text: '“The best investment we made for our nonprofit. Highly recommended!”', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
  { name: 'David Park', role: 'Operations Manager', rating: 5, text: '“Support has been outstanding and the product keeps getting better. We could not be happier with the results.”', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
];

ComponentRegistry.register({
  id: 'testimonial',
  name: 'Testimonial',
  category: 'Data Display',
  icon: 'Quote',

  variants: {
    Layout: {
      options: ['Carousel', 'Slider', 'Grid', 'Spotlight'],
      default: 'Carousel',
    },
    Alignment: {
      options: ['Left', 'Center'],
      default: 'Left',
    },
    'Card Style': {
      options: ['Border', 'None'],
      default: 'Border',
    },
  },

  properties: [
    { name: 'Show Avatars', type: 'boolean', default: true },
    { name: 'Show Rating', type: 'boolean', default: true },
    { name: 'Show Role', type: 'boolean', default: true },
    { name: 'Show Quote Icon', type: 'boolean', default: false },
    { name: 'Show Arrows', type: 'boolean', default: true },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
    { name: 'Items', type: 'text', default: JSON.stringify(DEFAULT_ITEMS) },
  ],

  states: [],

  scss: testimonialScss,

  colorTokens: [
    { token: 'Card Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Card Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Avatar BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Quote Icon', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Stars', variable: '--fg-warning', value: '#DC7801', description: '--fg-warning → amber' },
    { token: 'Name', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Role / Quote', variable: '--fg-secondary', value: '#6C73A8', description: '--fg-secondary → neutral-400' },
    { token: 'Active Dot', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
  ],

  usage: `import { Testimonial } from '@/components/Testimonial';

// Responsive grid of testimonials with ratings and roles
<Testimonial
  layout="Grid"
  showRating
  showRole
  items={[
    { name: "Jane Doe", role: "Founder, Acme", rating: 5, text: "“Absolutely amazing.”", avatar: "/avatars/jane.jpg" },
    { name: "John Smith", role: "Designer", rating: 5, text: "“Changed how we work.”" },
  ]}
/>

// Large centered single testimonial
<Testimonial layout="Spotlight" alignment="Center" cardStyle="None" />`,

  propDocs: [
    {
      name: 'layout',
      type: '"Carousel" | "Slider" | "Grid" | "Spotlight"',
      default: '"Carousel"',
      description:
        '**Carousel** shows one testimonial at a time with side arrows + dots. **Slider** is a horizontal, swipeable row of cards. **Grid** is a responsive multi-column wall (3→2→1 columns). **Spotlight** is a single large, centered, chromeless testimonial.',
    },
    {
      name: 'alignment',
      type: '"Left" | "Center"',
      default: '"Left"',
      description: 'Text + author alignment within each card. Spotlight is always centered.',
    },
    {
      name: 'cardStyle',
      type: '"Border" | "None"',
      default: '"Border"',
      description: 'Card chrome: a hairline **Border** or **None** (borderless). Spotlight ignores this (always chromeless).',
    },
    {
      name: 'items',
      type: 'TestimonialItem[]',
      default: '[3 default items]',
      description:
        'Array of testimonials. Each item has `avatar` (image), `name`, `role`, `rating` (0–5) and `text` (quote). Managed from the properties panel — add, edit, delete, or hide individual items.',
    },
    {
      name: 'showRating',
      type: 'boolean',
      default: 'true',
      description: 'Toggles the star rating row (uses each item’s `rating`).',
    },
    {
      name: 'showRole',
      type: 'boolean',
      default: 'true',
      description: 'Toggles the role/company line under the name.',
    },
    {
      name: 'showQuoteIcon',
      type: 'boolean',
      default: 'false',
      description: 'Shows a decorative quote mark above the testimonial text.',
    },
    {
      name: 'showArrows',
      type: 'boolean',
      default: 'true',
      description: 'Toggles the prev/next navigation arrows (Carousel, Slider, Spotlight). The Grid has no arrows.',
    },
    {
      name: 'showAvatars',
      type: 'boolean',
      default: 'true',
      description: 'Toggles the avatar/image. When off, cards show only the name and quote.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    let items: TestimonialItem[] | undefined;
    try {
      const parsed = JSON.parse(props['Items'] as string);
      items = Array.isArray(parsed) ? parsed : undefined;
    } catch {
      items = undefined;
    }
    return (
      <Testimonial
        items={items}
        layout={(variants['Layout'] as TestimonialLayout) ?? 'Carousel'}
        alignment={(variants['Alignment'] as TestimonialAlignment) ?? 'Left'}
        cardStyle={(variants['Card Style'] as TestimonialCardStyle) ?? 'Border'}
        showAvatars={props['Show Avatars'] as boolean}
        showRating={props['Show Rating'] as boolean}
        showRole={props['Show Role'] as boolean}
        showQuoteIcon={props['Show Quote Icon'] as boolean}
        showArrows={props['Show Arrows'] as boolean}
        selected={props['Selected'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
