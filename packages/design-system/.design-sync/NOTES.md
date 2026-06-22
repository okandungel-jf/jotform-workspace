# design-sync notes — @jf/design-system

Repo-specific gotchas for future syncs. Read this before re-syncing.

## Build shape (why it's non-standard)

`@jf/design-system` ships a Vite **app** (the DesignLibrary docs site), not a
library — `package.json` `main`/`exports` point at `./src/index.ts` (source TS),
there is no `dist/` library entry, and no `.d.ts` are emitted. So the sync adds
its own build, all under `.design-sync/` (run by `cfg.buildCmd`):

1. `extract-host-tokens.mjs` → `host-tokens.css` — see "Host tokens" below.
2. `vite.lib.config.mts` + `lib-entry.ts` → `.cache/lib/jf-ds.{js,css}` — a
   single scss-free ESM chunk (react externalized) + the whole DS stylesheet.
   - `inlineDynamicImports: true` inlines the Icon component's **1226 lazy
     `?raw` SVG imports** into the JS, so icons work fully offline. Cost: the
     bundle is ~4.8 MB (gzip ~1.1 MB). Re-sync risk: size grows with the icon set.
   - `assetsInlineLimit: 100_000_000` inlines the 5 Circular `.otf` as base64
     data URIs → self-contained CSS, no font files to ship.
3. `tsconfig.dts.json` (`tsc --emitDeclarationOnly` → `dist-types/`) — the
   converter extracts props from a **`.d.ts` tree only** (never `.tsx`), so
   without this every Props collapses to `[key: string]: unknown`. The
   `vite/client` types cover the `*.scss` / `?raw` / `import.meta.glob` ambients.

`componentSrcMap` lists all 31 components explicitly: discovery is `.d.ts`-tree
based and the package publishes no types, so omitting them yields `[ZERO_MATCH]`.
`DesignLibrary` is excluded (`null`) — it's the docs-app shell, not a component.

## Host tokens (app-elements dependency)

DS components are designed to live inside `.app-scope`, so they reference
**app-elements tokens** (`--space-*`, `--radius-*`, `--fg-*`, `--bg-*`,
`--border`, `--font-family`, `--font-size-*`) that the DS itself never defines —
bare `var()` with no fallbacks. `extract-host-tokens.mjs` compiles
`../app-elements/src/styles/app.scss` and keeps only the custom-property rule
blocks (`:root` / `[data-radius]` / `[data-theme='dark']`) into `host-tokens.css`,
which `lib-entry.ts` imports first. This is what makes spacing/radius/borders
render correctly standalone.

- **Font:** the app uses **Inter** for `--font-family` (body), but Inter is not
  bundled. The extractor appends a `:root { --font-family: 'Circular' … }`
  override so the standalone bundle renders in the bundled brand font. `cfg.
  runtimeFontPrefixes: ["Inter"]` suppresses the resulting `[FONT_MISSING]`.
  If you want true Inter, bundle it via `cfg.extraFonts` and drop the override.

## Known render warns (triaged — not new)

- **`[RENDER_THIN]` on Icon** — benign false positive. The Icon preview is a grid of
  inline SVGs with no text, so the "mounts have no text and paint nothing" heuristic
  misfires. Confirmed in the screenshot that all icons render. Do not chase.

## Preview authoring notes (all 31 components authored + graded good)

Card overrides live in `cfg.overrides`: Modal + Dialog = `cardMode: single` (overlays,
with a viewport); Table + Header = `cardMode: column` (wide). Everything else is the
default grid.

Reusable gotchas (so re-syncs / new previews don't relearn them):
- **Static state tricks**: uncontrolled inputs use `defaultValue`/`defaultChecked` (no
  onChange, no React warning). Controlled components (Segmented, Slider, Tabs,
  SearchInput) need `value` + a `noop` onChange (+ `readOnly` on SearchInput to silence
  the warning). ColorInput uses `color="#HEX"`. NumberInput takes `value={number}`.
- **Icons are category-specific** — verify with `ls src/assets/icons/<category>/` before
  use. Non-general examples: `lock-filled`→security, `envelope-closed-filled`→
  communication, `calendar`/`calendar-filled`→time-date, `dollar-sign`/`tag`→finance,
  `user-filled`→users. `layout` has NO user/table icon. Icons inherit `currentColor`.
- **DropdownLanguage** flags only exist for us/tr/fr/es/de (`src/components/Dropdown/flags.ts`).
- **Dropdowns** are closed-by-default with no static `open` prop — authored as styled
  closed triggers (`value`+`options`); no overlay override needed.
- **FieldComposer / FieldMapper** render DARK by default (fixed `--gray-*`, no provider).
  FieldComposer inline chip icons only render for two embedded SVG keys
  (`editor/type-square-filled`, `forms-files/paperclip-diagonal`); wrap at ~480px to avoid
  ellipsis. FieldMapper's FieldChip uses the real `<Icon>` so any registry icon works.
- **DropdownMenuShell** preview neutralizes the primitive's `position:absolute` with a
  scoped `className="dsp-static"` + tiny `<style>` so it flows in the card (preview-only).
- **Indicator** `light` style is white-bg + colored text → wrap in a dark backdrop to be
  visible. Enum quirks: Link size is `sm|lg` only; Indicator has no `warning` status;
  Segmented sizes are `sm|md` only.

## Re-sync risks (watch-list)

- **app-elements token drift**: `host-tokens.css` is a point-in-time mirror of
  app-elements' token layer. If app-elements changes tokens, re-run
  `extract-host-tokens.mjs` (it's in `buildCmd`, so a normal re-sync picks it up).
- **Bundle size**: 1226 icons + 5 fonts are inlined. Watch the README size
  warning if the icon set grows a lot.
- **No published types**: prop quality depends on `tsconfig.dts.json` emitting
  cleanly. If a future component uses non-erasable syntax or breaks the dts
  build, its props degrade to `[key: string]: unknown` — check the tsc step.
