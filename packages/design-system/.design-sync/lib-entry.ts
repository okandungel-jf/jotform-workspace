// design-sync library entry — NOT part of the app build.
// Pulls the foundation stylesheet (Circular @font-face + token CSS vars + reset)
// plus every component export. Each component imports its own .scss as a side
// effect, so a single-file lib build with cssCodeSplit:false collects the whole
// design system's CSS into one stylesheet and the JS into one scss-free chunk.
// app-elements token layer first (DS components reference --space-*/--radius-*/
// --fg-*/--border/--font-family when used inside .app-scope), then the DS's own
// foundation (Circular @font-face + --gray-*/--background-*/--spacing-* tokens).
import './host-tokens.css';
import '../src/styles/app.scss';
export * from '../src/index';
