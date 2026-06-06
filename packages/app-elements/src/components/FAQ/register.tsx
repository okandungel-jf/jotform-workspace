import { ComponentRegistry } from '../../types/registry';
import { FAQ, type FaqItem, type FaqStyle, type FaqIcon, type FaqIconPosition } from './FAQ';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import faqScss from './FAQ.scss?raw';

const DEFAULT_ITEMS: FaqItem[] = [
  { question: 'What is included in my plan?', answer: 'Every plan includes the core features you need to get started. Higher tiers unlock advanced options, more usage, and priority support.' },
  { question: 'Can I change my plan later?', answer: 'Yes — you can upgrade or downgrade at any time. Changes take effect immediately and your billing is prorated.' },
  { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee. If you are not satisfied, reach out to our support team for a full refund.' },
];

ComponentRegistry.register({
  id: 'faq',
  name: 'FAQ',
  category: 'Data Display',
  icon: 'CircleHelp',

  variants: {
    Style: {
      options: ['Divider', 'Card'],
      default: 'Divider',
    },
    Icon: {
      options: ['Chevron', 'Plus/Minus'],
      default: 'Chevron',
    },
    'Icon Position': {
      options: ['Left', 'Right'],
      default: 'Right',
    },
  },

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
    { name: 'Items', type: 'text', default: JSON.stringify(DEFAULT_ITEMS) },
  ],

  states: [],

  scss: faqScss,

  colorTokens: [
    { token: 'Question', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Answer', variable: '--fg-secondary', value: '#6C73A8', description: '--fg-secondary → neutral-400' },
    { token: 'Chevron Icon', variable: '--fg-secondary', value: '#6C73A8', description: '--fg-secondary → neutral-400' },
    { token: 'Plus/Minus Icon', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Divider / Card Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Card Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
  ],

  usage: `import { FAQ } from '@/components/FAQ';

// Divider list with chevron indicators (default)
<FAQ
  items={[
    { question: "Is it safe?", answer: "Yes — your data is encrypted end to end." },
    { question: "Can I cancel anytime?", answer: "Absolutely, no questions asked." },
  ]}
/>

// Card style with plus/minus indicators on the left
<FAQ
  style="Card"
  icon="Plus/Minus"
  iconPosition="Left"
  items={[
    { question: "How does billing work?", answer: "You are billed monthly and can change plans anytime." },
  ]}
/>`,

  propDocs: [
    {
      name: 'style',
      type: '"Divider" | "Card"',
      default: '"Divider"',
      description:
        'Container treatment. **Divider** renders a borderless list separated by hairlines. **Card** wraps each question in a filled, rounded surface with gaps between items.',
    },
    {
      name: 'icon',
      type: '"Chevron" | "Plus/Minus"',
      default: '"Chevron"',
      description:
        'Toggle indicator. **Chevron** rotates 180° when open. **Plus/Minus** swaps a plus for a minus and is tinted with `fg-brand`.',
    },
    {
      name: 'iconPosition',
      type: '"Left" | "Right"',
      default: '"Right"',
      description: 'Which side of the question the toggle indicator sits on.',
    },
    {
      name: 'items',
      type: 'FaqItem[]',
      default: '[{question, answer}, ...]',
      description:
        'Array of `{ question, answer }` objects. Single-open accordion — opening one item closes the others; all items start collapsed. Questions and answers are editable inline on the canvas; the full list (add / delete) is managed from the properties panel.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, applies a 2px `border-info` outline around the whole element.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues, onPropertyChange?: (name: string, value: string | boolean | number) => void): React.ReactNode {
    let items: FaqItem[] | undefined;
    try {
      const parsed = JSON.parse(props['Items'] as string);
      items = Array.isArray(parsed) ? parsed : undefined;
    } catch {
      items = undefined;
    }
    return (
      <FAQ
        style={variants['Style'] as FaqStyle}
        icon={variants['Icon'] as FaqIcon}
        iconPosition={variants['Icon Position'] as FaqIconPosition}
        items={items}
        selected={props['Selected'] as boolean}
        skeleton={props['Skeleton'] as boolean}
        onItemsChange={onPropertyChange ? (next) => onPropertyChange('Items', JSON.stringify(next)) : undefined}
      />
    );
  },
});
