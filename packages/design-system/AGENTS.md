# JotForm Design System Agent Instructions

Before building UI with this package, read:

- `skills/jf-design-system/SKILL.md`

Core rules:

- Import `@jf/design-system/styles` once in the app entry.
- Prefer public exports from `@jf/design-system` before creating custom UI.
- Use design tokens for color, spacing, radius, typography, borders, and shadows.
- Do not hardcode values when an existing token covers the need.
- Do not override component internals from the consuming app. Fix reusable behavior in the design-system source.
- Keep builder-specific shells, canvas logic, drag/drop, registry logic, and properties panels outside this core package unless the user explicitly asks for a builder starter.
- For Figma MCP HTML-to-Design capture setup, read `tools/figma-html-to-design-capture/README.md`.
- Verify changes with build or typecheck before handing off.
