---
name: jf-design-system
description: Use when creating, extending, or reviewing React interfaces that should follow the JotForm Design System. Applies to starter apps, dashboards, forms, settings pages, builder-style mockups, component composition, token-based styling, and consistent UI built with @jf/design-system.
metadata:
  short-description: Build consistent UI with JotForm DS
---

# JotForm Design System

Use this skill whenever a project should use `@jf/design-system` for consistent React UI.

## Start Here

1. Confirm the package is available as `@jf/design-system`.
2. Import the global DS stylesheet once in the app entry:

```ts
import '@jf/design-system/styles'
```

3. Import UI from the public root export:

```tsx
import { Button, Icon, Input, FormField, DropdownSingle } from '@jf/design-system'
```

4. Build screens by composing DS primitives first. Add custom components only for app-specific layout or domain behavior.
5. Run the relevant build or typecheck before final handoff.

## Non-Negotiable Rules

- Use DS tokens for colors, spacing, radius, typography, borders, and shadows.
- Do not hardcode visual values when an existing token covers the need.
- Do not override DS component internals from the consuming app.
- If a reusable component needs a visual fix, change it in the design-system source.
- Use `Icon` from `@jf/design-system` for builder/product UI icons.
- Keep canvas/app-rendered components separate from this DS core unless the user explicitly asks for a builder starter.
- Do not import from private component files unless the root export is missing and the user asks to expose it.

## What To Read When Needed

- For component selection and examples, read `references/components.md`.
- For token rules and CSS patterns, read `references/tokens.md`.
- For starter app layouts and promptable patterns, read `references/starter-patterns.md`.
- For Figma MCP HTML-to-Design capture setup, read `../../tools/figma-html-to-design-capture/README.md`.

## UI Composition Defaults

For business software, prefer quiet, dense, scan-friendly layouts:

- Top app header or compact toolbar.
- Optional left navigation.
- Main work area with clear sections.
- Optional right settings/properties panel.
- Repeated content can use cards, but avoid nesting cards inside cards.
- Use tables, lists, tabs, segmented controls, form fields, and dialogs where they match the workflow.

## Styling Defaults

Create app-level layout classes and style them with DS tokens:

```scss
.app-shell {
  min-height: 100vh;
  background: var(--background-lightest);
  color: var(--text-darkest);
  font-family: var(--font-family-circular);
}

.panel {
  background: var(--background-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
}
```

Prefer semantic token families over raw primitive colors when possible.

## Verification

Before finishing:

- Check that `@jf/design-system/styles` is imported exactly once at the app entry or shared root.
- Check that new UI imports DS components from `@jf/design-system`.
- Search for hardcoded visual values in new CSS.
- If the task involves Figma capture, verify the app includes the MCP `html-to-design` script tag and uses a narrow `figmaselector`.
- Run `pnpm build`, `pnpm typecheck`, or the closest available validation command.
