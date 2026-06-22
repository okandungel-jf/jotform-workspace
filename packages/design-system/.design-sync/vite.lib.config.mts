// design-sync library build for @jf/design-system.
// The package itself only ships a Vite *app* (the DesignLibrary docs site), so
// there is no library entry the converter can bundle. This config produces one:
//   .cache/lib/jf-ds.js   — single scss-free ESM chunk (react externalized),
//                            with the 1226 lazy `?raw` SVG imports inlined so
//                            the Icon component works fully offline.
//   .cache/lib/jf-ds.css  — the whole DS stylesheet (tokens + reset + every
//                            component .scss), with the Circular .otf fonts
//                            inlined as base64 data URIs (self-contained).
// Run from the package dir:  vite build -c .design-sync/vite.lib.config.mts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(here, 'lib-entry.ts'),
      formats: ['es'],
      fileName: () => 'jf-ds.js',
    },
    outDir: resolve(here, '.cache/lib'),
    emptyOutDir: true,
    cssCodeSplit: false,
    // Inline fonts (and any url() assets) as data URIs -> self-contained CSS.
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
      ],
      output: {
        // Single JS chunk: inlines the 1226 lazy svg `?raw` dynamic imports so
        // the converter's IIFE bundle has no sibling chunks to resolve.
        inlineDynamicImports: true,
        assetFileNames: 'jf-ds.[ext]',
      },
    },
  },
});
