// Extracts the app-elements token layer (the design tokens DS components depend
// on when used inside `.app-scope`) into a self-contained stylesheet, so the
// standalone design-system bundle renders with correct spacing/radius/borders/
// colors. Keeps ONLY rule blocks whose body is entirely `--custom-prop:` decls
// (the :root / [data-radius] / [data-theme] token blocks) — drops every
// component class, @font-face, @keyframes, and utility rule.
import * as sass from 'sass';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const aeStyles = resolve(here, '../../app-elements/src/styles');
const entry = resolve(aeStyles, 'app.scss');

const { css } = sass.compile(entry, { loadPaths: [aeStyles], style: 'expanded' });

// Top-level brace-depth scanner → list of {selector, body} for depth-0 rules.
const blocks = [];
let depth = 0, buf = '', selStart = 0;
for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  if (ch === '{') {
    if (depth === 0) { var selector = buf.trim(); buf = ''; var bodyStart = i + 1; }
    depth++;
    if (depth === 1) continue;
  }
  if (ch === '}') {
    depth--;
    if (depth === 0) { blocks.push({ selector, body: css.slice(bodyStart, i) }); buf = ''; continue; }
  }
  if (depth === 0) buf += ch;
}

// Keep only :root / [data-*] blocks whose body is exclusively custom-prop decls
// (no nested rules, no normal properties).
const keep = [];
for (const { selector, body } of blocks) {
  if (!/^(:root|\[data-)/.test(selector.replace(/^[\s\n]+/, ''))) continue;
  if (body.includes('{')) continue; // nested rule — skip
  const decls = body.split(';').map((d) => d.trim()).filter(Boolean);
  if (decls.length === 0) continue;
  const allCustom = decls.every((d) => d.startsWith('--'));
  if (!allCustom) continue;
  keep.push(`${selector.trim()} {\n  ${decls.join(';\n  ')};\n}`);
}

const out = resolve(here, 'host-tokens.css');
const header = '/* app-elements token layer — extracted by extract-host-tokens.mjs.\n' +
  '   DS components reference these (--space-*, --radius-*, --fg-*, --bg-*, --border,\n' +
  '   --font-family, --font-size-*) when used inside .app-scope. Regenerate if the\n' +
  '   app-elements tokens change:  node .design-sync/extract-host-tokens.mjs  */\n';
// Standalone-bundle override: the app uses Inter for body text, but Inter is not
// bundled here. Map --font-family to the bundled Circular (the JF brand font) so
// the synced DS is self-contained and on-brand. Trailing => wins source order.
const fontOverride =
  "\n\n/* standalone-bundle override: Inter is not bundled — use the bundled Circular */\n" +
  ":root {\n  --font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n}\n";
writeFileSync(out, header + keep.join('\n\n') + fontOverride);
console.log(`wrote ${out}: ${keep.length} token block(s)`);
