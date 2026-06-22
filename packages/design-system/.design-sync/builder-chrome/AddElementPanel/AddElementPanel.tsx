// Showcase recreation of the builder's "App Elements" (add-element) left panel.
// The real one is inline JSX inside app-builder BuildPage.tsx (not a component),
// so this faithfully reproduces its markup + classes (styled by chrome-styles.css)
// using the real ELEMENT_ICON_MAP icons. Reference-only — not a reusable component.
import { Icon } from '@jf/design-system';

type Item = { id: string; name: string; icon: string; cat: string };
const GROUPS: { label: string | null; items: Item[] }[] = [
  {
    label: null,
    items: [
      { id: 'form', name: 'Form', icon: 'form-filled', cat: 'forms-files' },
      { id: 'heading', name: 'Heading', icon: 'heading-square-filled', cat: 'editor' },
      { id: 'list', name: 'List', icon: 'list-bullet', cat: 'editor' },
      { id: 'paragraph', name: 'Paragraph', icon: 'text-image', cat: 'general' },
      { id: 'card', name: 'Card', icon: 'grid-2-filled', cat: 'layout' },
      { id: 'image', name: 'Image', icon: 'image-line-filled', cat: 'general' },
      { id: 'button', name: 'Button', icon: 'label-button-filled', cat: 'general' },
    ],
  },
  {
    label: 'PAYMENT ELEMENTS',
    items: [
      { id: 'product-list', name: 'Product List', icon: 'cart-shopping-filled', cat: 'finance' },
      { id: 'donation-box', name: 'Donation Box', icon: 'heart-filled', cat: 'general' },
    ],
  },
  {
    label: 'FEATURED WIDGETS',
    items: [
      { id: 'social-follow', name: 'Social Follow', icon: 'share-nodes-filled', cat: 'general' },
      { id: 'testimonial', name: 'Testimonial', icon: 'message-star-filled', cat: 'communication' },
      { id: 'faq', name: 'FAQ', icon: 'question-circle-filled', cat: 'general' },
    ],
  },
];

export function AddElementPanel() {
  return (
    <aside className="build-page__left" data-theme="dark" style={{ position: 'relative', height: 'auto', maxHeight: 'none' }}>
      <div className="build-page__left-header">
        <h2>App Elements</h2>
        <button className="build-page__left-close" aria-label="Close"><Icon name="xmark" size={24} /></button>
      </div>
      <div className="build-page__elements">
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            {g.label && <div className="build-page__separator">{g.label}</div>}
            {g.items.map((it, i) => (
              <div key={it.id}>
                <div className="build-page__element-item">
                  <div className="build-page__element-icon">
                    <Icon name={it.icon} category={it.cat} size={24} />
                  </div>
                  <div className="build-page__element-content">
                    <span className="build-page__element-name">{it.name}</span>
                  </div>
                </div>
                {i < g.items.length - 1 && <hr className="build-page__element-divider" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
