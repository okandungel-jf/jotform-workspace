import { ComponentRegistry } from '../../types/registry';
import { Divider } from './Divider';
import type { DividerSpacing, DividerLineStyle } from './Divider';
import type { VariantValues, PropertyValues } from '../../types/component';
import dividerScss from './Divider.scss?raw';

ComponentRegistry.register({
  id: 'divider',
  name: 'Divider',
  category: 'Layout',
  icon: 'Minus',

  variants: {
    Spacing: {
      options: ['Small', 'Medium', 'Large'],
      default: 'Medium',
    },
    'Line Style': {
      options: ['Solid', 'Dashed'],
      default: 'Solid',
    },
  },

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
  ],

  states: [],

  scss: dividerScss,

  colorTokens: [
    { token: 'Line', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
  ],

  usage: `import { Divider } from '@/components/Divider';

// Default rule
<Divider />

// Looser spacing, dashed
<Divider spacing="Large" lineStyle="Dashed" />`,

  propDocs: [
    { name: 'spacing', type: '"Small" | "Medium" | "Large"', default: '"Medium"', description: 'Vertical padding above/below the rule.' },
    { name: 'lineStyle', type: '"Solid" | "Dashed"', default: '"Solid"', description: 'Solid or dashed line.' },
    { name: 'selected', type: 'boolean', default: 'false', description: 'Outline shown when selected on the canvas.' },
    { name: 'shrinked', type: 'boolean', default: 'false', description: 'Constrains the element to a smaller width.' },
  ],

  render(variants: VariantValues, props: PropertyValues): React.ReactNode {
    return (
      <Divider
        spacing={variants['Spacing'] as DividerSpacing}
        lineStyle={variants['Line Style'] as DividerLineStyle}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
      />
    );
  },
});
