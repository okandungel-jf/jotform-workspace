# Jotform Builder DS Transfer

Local Figma development plugin for transferring the App Builder page into the
active Figma file with Jotform design-system token variables.

## What It Creates

- `Jotform DS Tokens` local variable collection
- CSS code syntax for the generated variables, e.g. `var(--ds-bg-page)`
- A desktop builder frame named `Builder Page / Desktop - DS Token Bound`
- Token-bound major surfaces: top bar, left elements panel, canvas area,
  floating actions, live preview panel, phone shell, and core typography

## Source

The layout and token names are derived from:

- `packages/app-builder/src/pages/BuildPage.tsx`
- `packages/app-builder/src/styles/app.scss`
- `packages/design-system/src/styles/_primitives.scss`
- `packages/design-system/src/styles/_semantic.scss`

## Run

In Figma Desktop:

1. Open the target Figma design file.
2. Use `Plugins > Development > Import plugin from manifest...`
3. Select `tools/figma-builder-transfer/manifest.json`
4. Run `Jotform Builder DS Transfer`

The plugin places the generated frame to the right of the current canvas
content, so it should not overlap existing work.
