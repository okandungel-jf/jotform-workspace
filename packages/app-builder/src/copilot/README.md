# JotForm App Builder — Copilot Theme System

Bundle for the AI Copilot backend. Source of truth lives in the JotForm App Builder monorepo (`packages/app-elements`); this archive is a snapshot for porting / reference.

## Files

| File | Purpose |
|------|---------|
| `themeSystemPrompt.md` | LLM system prompt — feed verbatim. Output contract: `{ category, moodTags, mode?, themeId? }`. |
| `themeCatalog.json` | Machine-readable theme catalog + picker rules. Mirror of `themeCatalog.ts`. |
| `themeCatalog.ts` | TypeScript source (self-contained — no monorepo imports). Includes `pickTheme()` / `rankThemes()` deterministic picker. |
| `colorPalette.ts` | Generates a 50–950 shade ramp from any base hex (HSL-based, light + dark lightness curves). Apply ramp to DOM via `applySecondaryPaletteToDOM`. |
| `neutralTint.ts` | Generates neutral palette tinted with brand hue. Used to pull greys toward the brand for cohesion. |

## Pipeline overview

```
user prompt
  → LLM (with themeSystemPrompt.md as system prompt)
  → JSON { category, moodTags, mode?, themeId? }
  → pickTheme(...)   ← deterministic, returns one AppTheme
  → AppTheme bundle: { color, font, headingFont, radius, tint, mode, harmonyOffset, scheme }
  → frontend applies via generatePalette + applyNeutralPalette
```

## Using the picker

```ts
import { pickTheme, rankThemes, getThemeById, THEME_CATALOG } from './themeCatalog';

// Direct id (LLM was confident)
const theme = getThemeById(llmResponse.themeId) ?? pickTheme(llmResponse);

// Rank (for showing alternatives or rotating)
const top3 = rankThemes(llmResponse).slice(0, 3);
```

Scoring (`themeCatalog.ts`):
- `+10` if `input.category` ∈ `theme.categories`
- `+3` per `moodTag` ∈ `theme.moods`
- Filtered by `input.mode` if specified
- Highest score wins; ties broken by catalog order

## Custom hex requests

If the LLM emits `customBrandHex` (user said "make it red"), the frontend:
1. Generates a full ramp via `generatePalette(hex)`
2. Validates AA contrast against `--bg-page` / `--bg-surface` in the active mode
3. If contrast fails → snap to nearest passing lightness or fall back to `pickTheme()` result
4. If passes → use the user's hex; pull other theme attrs (font/radius) from the picker's match

## Constraints

- Catalog has **43 hand-tuned themes**, tiered via `surfaceIn`:
  - `'both'` (9) — featured in the AppDesigner UI panel + selectable by copilot
  - `'copilot'` (34) — copilot-only, hidden from the panel; covers pastel/vibrant/retro/industrial/coastal axes plus within-category variants (e.g. multiple coffee shop, fitness, healthcare options)
- Don't generate raw hex on the LLM side — always go through this list (or validated `customBrandHex`).
- Every theme ships with a paired font from the curated list. LLM does NOT pick fonts.
- Light/dark mode is part of the theme. LLM `mode` field is a hint, not the final choice — the picker may downgrade if no in-mode candidate scores well.

## Keeping in sync

When the TS source (`packages/app-elements/src/utils/themeCatalog.ts`) changes:
- Re-export this bundle (regenerate JSON to match)
- Update the system prompt's catalog table if vibes/categories/moods shifted

The `$comment` field in `themeCatalog.json` flags the divergence risk.
