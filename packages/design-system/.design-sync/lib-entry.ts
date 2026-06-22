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
// Builder-chrome showcase styles (TopBar / panels / add-element) — app-builder
// app.scss globals stripped (see extract-chrome-styles.mjs).
import './chrome-styles.css';
// Re-export every DS component EXCEPT DesignLibrary (the docs app) — exporting it
// via `export *` pulled the whole ~MB docs shell into the bundle and pushed it
// past the 5MB upload cap. It is excluded as a component anyway (componentSrcMap).
export {
  Icon, Button, SearchInput, DateInput,
  DropdownSingle, DropdownMulti, DropdownLanguage, DropdownMenuShell, useDropdown,
  Toggle, Slider, Input, TextArea, ColorInput, UrlInput,
  FieldChip, FieldMapper, FieldComposer, FormField, NumberInput,
  Modal, Link, Badge, Indicator, Dialog, Tabs, Segmented,
  Checkbox, RadioButton, Header, Table, TableTitle,
} from '../src/index';
// Builder-chrome components (real app-builder shell pieces) shown under the
// "Builder Chrome" group as reference — not part of the DS component library.
export { TopBar } from '../../app-builder/src/shell/TopBar';
export { PagePropertiesPanel } from '../../app-builder/src/components/PagePropertiesPanel';
export { AddElementPanel } from './builder-chrome/AddElementPanel/AddElementPanel';
