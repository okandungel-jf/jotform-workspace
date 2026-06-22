# JF Design System — how to build with it

31 React components from `@jf/design-system`, available at `window.JFDesignSystem.*`
(e.g. `window.JFDesignSystem.Button`). The brand font is Circular (bundled). Build
real, on-brand UI by composing these components and styling your own layout with the
design tokens below.

## Setup

No provider or theme wrapper is required. Just ensure the root `styles.css` is loaded —
it carries the fonts, the design tokens, and every component's CSS. Components render
fully styled out of the box. For dark mode, set `data-theme="dark"` on any ancestor
element (the tokens and component styles re-theme automatically).

## Styling idiom — props first, tokens for glue

Style a COMPONENT through its typed props, never by overriding its classes. The design
language is carried by enum props. Examples (see each `<Name>.d.ts` for the full set):

- `Button`: `variant` (`filled` | `ghost` | `transparent`), `colorScheme` (`primary` |
  `secondary` | `constructive` | `destructive`), `size` (`sm` | `md` | `lg`),
  `leftIcon`/`rightIcon` (a `<JFDesignSystem.Icon />`), `loading`, `iconOnly`.
- `Badge`: `status` (`success` | `error` | `warning` | `information` | `neutral`),
  `emphasis` (`subtle` | `bold` | `outlined`), `size`, `shape`.
- `Icon`: `name` + `category` (one of: general[default], arrows, communication, users,
  finance, time-date, media, brands, ai, alerts-feedback, documents, editor, forms-files,
  layout, products, security, technology). Inherits `currentColor`.

For YOUR OWN layout/spacing/color (wrappers, grids, sections), use the DS CSS variables —
never hardcoded px or hex:

- Color: `--fg-primary`, `--fg-secondary`, `--fg-brand`, `--fg-success`, `--fg-error`,
  `--bg-fill` (page), `--bg-surface` (card), `--border`.
- Spacing (4px scale): `--space-1` (4px) … `--space-4` (16) `--space-6` (24) `--space-8`
  (32) `--space-12` (48) `--space-16` (64) `--space-20` (80).
- Radius: `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-rounded` (pill).
- Type: `--font-family`, `--font-size-paragraph-sm|md|lg`, `--font-size-heading-xs|sm|md|lg|xl|xxl`.
- Elevation: `--shadow-xs|sm|md|lg|xl`.

## Where the truth lives

Before styling, read `styles.css` (and the `_ds_bundle.css` it imports) for the full token
set, and each component's `components/<group>/<Name>/<Name>.d.ts` (its prop contract) and
`<Name>.prompt.md` (usage notes).

## Builder Chrome (reference only)

The `builder-chrome` group (`TopBar`, `PagePropertiesPanel`, `AddElementPanel`)
shows the Jotform **App Builder's own UI** for reference — the real top bar, the
page-properties panel, and the add-element panel. These are NOT for building app
content; use them only when designing builder/admin chrome itself.

## Example

```jsx
const { Button, Badge, Icon } = window.JFDesignSystem;

function Toolbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-4)', background: 'var(--bg-surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <Badge status="success" emphasis="subtle">Live</Badge>
      <span style={{ color: 'var(--fg-secondary)', fontSize: 'var(--font-size-paragraph-sm)' }}>
        12 changes
      </span>
      <Button colorScheme="primary" leftIcon={<Icon name="check" size={16} />}>Publish</Button>
    </div>
  );
}
```
