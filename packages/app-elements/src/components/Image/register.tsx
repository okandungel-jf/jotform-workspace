import { ComponentRegistry } from '../../types/registry';
import { Image } from './Image';
import type { ImageAlignment, ImageSize } from './Image';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import imageScss from './Image.scss?raw';

ComponentRegistry.register({
  id: 'image',
  name: 'Image',
  category: 'Media',
  icon: 'Image',

  variants: {
    'Has Image': {
      options: ['Yes', 'No'],
      default: 'No',
    },
    Alignment: {
      options: ['Left', 'Center', 'Right'],
      default: 'Center',
      showWhen: { 'Has Image': 'Yes' },
    },
    Size: {
      options: ['Normal', 'Large'],
      default: 'Normal',
      showWhen: { 'Has Image': 'Yes' },
    },
  },

  properties: [
    { name: 'Image URL', type: 'text', default: '' },
    { name: 'Alt Text', type: 'text', default: '', showWhen: { 'Has Image': 'Yes' } },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false, showWhen: { 'Has Image': 'Yes' } },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: imageScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
  ],

  usage: `import { Image } from '@/components/Image';

<Image hasImage imageUrl="..." alignment="Center" size="Normal" />`,

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    const hasImage = variants['Has Image'] === 'Yes';
    const widthValue = Number(props['Width']);
    const heightValue = Number(props['Height']);
    return (
      <Image
        hasImage={hasImage}
        alignment={hasImage ? variants['Alignment'] as ImageAlignment : undefined}
        size={hasImage ? variants['Size'] as ImageSize : undefined}
        imageUrl={props['Image URL'] as string}
        altText={props['Alt Text'] as string}
        width={Number.isFinite(widthValue) && widthValue > 0 ? widthValue : undefined}
        height={Number.isFinite(heightValue) && heightValue > 0 ? heightValue : undefined}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
