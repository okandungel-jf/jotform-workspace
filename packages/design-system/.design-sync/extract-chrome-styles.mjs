// Extracts the app-builder chrome stylesheet for the "Builder Chrome" showcase
// cards (TopBar, properties panel, add-element panel). app-builder's app.scss is
// app-global, so we compile it and DROP the global rules that would bleed into
// every other card — body / html / the `*` reset / @font-face (Circular already
// ships in the bundle). We keep `:root { --ds-* }` (builder tokens, harmless
// custom props) and all class/keyframe/media rules (inert for non-chrome cards
// since their selectors never match). Regenerate via buildCmd.
import * as sass from 'sass';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const abStyles = resolve(here, '../../app-builder/src/styles');
const dsStyles = resolve(here, '../src/styles');
const entry = resolve(abStyles, 'app.scss');

const { css } = sass.compile(entry, { loadPaths: [abStyles, dsStyles], style: 'expanded' });

// Top-level brace-depth scanner → {selector, body, raw} for depth-0 rules,
// preserving @media/@keyframes (kept whole).
const blocks = [];
let depth = 0, buf = '', start = 0;
for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  if (ch === '{') { if (depth === 0) { var selector = buf.trim(); buf = ''; } depth++; continue; }
  if (ch === '}') { depth--; if (depth === 0) { blocks.push({ selector, raw: css.slice(start, i + 1) }); start = i + 1; buf = ''; continue; } }
  if (depth === 0) buf += ch;
}

// Drop global rules that would affect other cards.
const DROP = /^(@font-face\b|html\b|body\b|\*(\s|,|::|$))/;
const kept = blocks
  .filter((b) => b.selector && !DROP.test(b.selector.replace(/^[\s\n]+/, '')))
  .map((b) => b.raw.trim());

const out = resolve(here, 'chrome-styles.css');
const header = '/* app-builder chrome styles (TopBar / panels / add-element) — extracted by\n' +
  '   extract-chrome-styles.mjs with global body, html, universal-reset and font-face\n' +
  '   rules removed so they do not bleed into other cards. Regenerate if changed. */\n';
writeFileSync(out, header + kept.join('\n') + '\n');
console.log(`wrote ${out}: ${kept.length} rule block(s), ${(header.length + kept.join('\n').length / 1024).toFixed(0)}KB`);
