#!/usr/bin/env node
// One-off dumper: reads themeCatalog.ts via tsc transpile, writes JSON mirror.
// Run from monorepo root: node packages/app-elements/scripts/dump-theme-catalog.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const tsSrc = resolve(here, '../src/utils/themeCatalog.ts');
const out = resolve(here, '../../app-builder/src/copilot/themeCatalog.json');
const bundleOut = '/tmp/jf-copilot-theme-system/themeCatalog.json';

const source = readFileSync(tsSrc, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;

const dataUrl = 'data:text/javascript;base64,' + Buffer.from(transpiled).toString('base64');
const mod = await import(dataUrl);

const payload = {
  $comment: 'Mirror of packages/app-elements/src/utils/themeCatalog.ts — regenerate via scripts/dump-theme-catalog.mjs',
  moods: mod.MOODS,
  categories: mod.CATEGORIES,
  themes: mod.THEME_CATALOG,
  picker: {
    categoryWeight: 10,
    moodWeight: 3,
    rules: [
      'Filter pool to mode if specified',
      'Score each theme: +10 if input.category ∈ theme.categories, +3 per moodTag ∈ theme.moods',
      'Sort by score desc; ties broken by catalog order',
    ],
  },
};

const json = JSON.stringify(payload, null, 2) + '\n';
writeFileSync(out, json);
try { writeFileSync(bundleOut, json); } catch {}

// Markdown table (id | name | mode | vibe | best for)
const rows = mod.THEME_CATALOG.map(t =>
  `| \`${t.id}\` | ${t.name} | ${t.mode} | ${t.vibe.replace(/\|/g, '\\|')} | ${t.categories.join(', ')} |`
).join('\n');
const tableHeader = '| id | name | mode | vibe | best for |\n|----|------|------|------|----------|\n';
const table = tableHeader + rows + '\n';

// Inject the table into the system prompt template, replacing the existing catalog section
const promptPath = resolve(here, '../../app-builder/src/copilot/themeSystemPrompt.md');
const promptBundle = '/tmp/jf-copilot-theme-system/themeSystemPrompt.md';
const prompt = readFileSync(promptPath, 'utf8');
const updated = prompt.replace(
  /(## Theme catalog\n[\s\S]+?\n)(\| id \|[\s\S]*?\n)(?=\n## )/,
  `$1${table}`
);
if (updated !== prompt) {
  writeFileSync(promptPath, updated);
  try { writeFileSync(promptBundle, updated); } catch {}
  console.log(`Updated ${promptPath}`);
  console.log(`Updated ${promptBundle}`);
}

console.log(`Wrote ${out}`);
console.log(`Wrote ${bundleOut}`);
console.log(`${mod.THEME_CATALOG.length} themes`);
