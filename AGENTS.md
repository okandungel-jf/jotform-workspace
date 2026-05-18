# JotForm App Builder - Monorepo

## Project Context
Before starting any task, read the project memory for full architecture details:
- `~/.codex/memories/jotform-workspace/MEMORY.md`
- Start with `~/.codex/memories/jotform-workspace/project_jf_workspace.md` for the monorepo architecture.
- `CLAUDE.md` contains the legacy Claude project context and should be treated as supplemental context when onboarding.

## Key Rules
- Never override component styles from builder — fix at source in app-elements or design-system
- Never use hardcoded values — always use design tokens
- Builder UI uses `--ds-*` tokens and Circular font from design-system
- Canvas components use app-elements tokens (`--fg-*`, `--bg-*`, `--space-*`, `--radius-*`)
- Icons: builder UI uses design-system Icon (SVG fetch), canvas uses app-elements Icon (lucide/phosphor/tabler)
