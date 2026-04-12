import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../components/Icon/Icon';
import { useIconLibrary, type IconLibrary, type IconStyle } from '../context/IconLibraryContext';
import { loadLibrary } from '../utils/iconRegistry';
import { generatePalette, applySecondaryPaletteToDOM, resetSecondaryPalette } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { generateNeutralPalette, applyNeutralToDOM } from '../utils/neutralTint';
import { ColorPicker } from './components/ColorPicker';
import { ColorPicker as TokenColorPicker } from '../components/ColorPicker/ColorPicker';

// ── Constants ──────────────────────────────────────────────────────────

const DEFAULT_COLOR = '#7D38EF';
const DEFAULT_FONT = 'Inter';
const DEFAULT_HEADING_FONT = '';
const DEFAULT_RADIUS = 'Medium';
const DEFAULT_TINT = 50;
const DEFAULT_HARMONY = 150;

type RadiusScale = 'Small' | 'Medium' | 'Large' | 'XLarge';

const FONT_OPTIONS = [
  'Inter',
  'Frances',
  'IBM Plex Mono',
  'Fredoka',
  'JetBrains Mono',
  'Instrument Sans',
  'Figtree',
  'Hanken Grotesk',
  'Geist',
  'DM Sans',
  'Public Sans',
  'Google Sans',
  'Bricolage Grotesque',
  'Varela Round',
];

const HEADING_FONT_OPTIONS = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Libre Baskerville',
  'Fraunces',
  'DM Serif Display',
  'Bitter',
  'Sora',
  'Space Grotesk',
  'Outfit',
  ...FONT_OPTIONS,
];

interface ColorScheme {
  brand: string;
  surface: string;
  text: string;
}

interface ThemePreset {
  name: string;
  color: string;
  font: string;
  headingFont: string;
  iconLibrary: IconLibrary;
  radius: RadiusScale;
  tint: number;
  mode: 'light' | 'dark';
  harmonyOffset: number;
  scheme: ColorScheme;
}

const LIGHT_PRESETS: ThemePreset[] = [
  { name: 'Default', color: '#7D38EF', font: 'Inter', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 50, mode: 'light', harmonyOffset: 150, scheme: { brand: '#7D38EF', surface: '#EDE8FE', text: '#7D38EF' } },
  { name: 'Ocean Breeze', color: '#0385C8', font: 'DM Sans', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 30, mode: 'light', harmonyOffset: 150, scheme: { brand: '#0385C8', surface: '#D3E9FF', text: '#0385C8' } },
  { name: 'Sunset', color: '#F97101', font: 'Bricolage Grotesque', headingFont: '', iconLibrary: 'lucide', radius: 'Large', tint: 60, mode: 'light', harmonyOffset: 180, scheme: { brand: '#F97101', surface: '#FEF3C5', text: '#F97101' } },
  { name: 'Forest', color: '#19A44B', font: 'Public Sans', headingFont: 'Lora', iconLibrary: 'tabler', radius: 'Small', tint: 40, mode: 'light', harmonyOffset: 120, scheme: { brand: '#19A44B', surface: '#DDFBE8', text: '#19A44B' } },
];

const DARK_PRESETS: ThemePreset[] = [
  { name: 'Dark Elegance', color: '#8D5DF9', font: 'Figtree', headingFont: 'Playfair Display', iconLibrary: 'phosphor', radius: 'XLarge', tint: 70, mode: 'dark', harmonyOffset: 160, scheme: { brand: '#8D5DF9', surface: '#F0EBFE', text: '#8D5DF9' } },
  { name: 'Cherry Night', color: '#DF2125', font: 'Instrument Sans', headingFont: 'Merriweather', iconLibrary: 'lucide', radius: 'Medium', tint: 35, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#DF2125', surface: '#FDE8E8', text: '#DF2125' } },
  { name: 'Aqua Night', color: '#00B5D4', font: 'JetBrains Mono', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 25, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#00B5D4', surface: '#DDF3FF', text: '#00B5D4' } },
  { name: 'Cozy', color: '#8B5E3C', font: 'Lora', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 80, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#8B5E3C', surface: '#F5EDE6', text: '#8B5E3C' } },
  { name: 'Monochrome', color: '#5A6180', font: 'IBM Plex Mono', headingFont: '', iconLibrary: 'tabler', radius: 'Small', tint: 0, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#5A6180', surface: '#DADEF3', text: '#5A6180' } },
];

const THEME_PRESETS: ThemePreset[] = [...LIGHT_PRESETS, ...DARK_PRESETS];

const PRESET_SHORT_NAMES: Record<string, string> = {
  'Default': 'Default',
  'Ocean Breeze': 'Sky',
  'Sunset': 'Sunset',
  'Forest': 'Mint',
  'Dark Elegance': 'Elegance',
  'Cherry Night': 'Cherry',
  'Aqua Night': 'Aqua',
  'Cozy': 'Cozy',
  'Monochrome': 'Mono',
};

// ── Token Editor ───────────────────────────────────────────────────────

interface SemanticToken {
  variable: string;
  label: string;
}

interface TokenCategory {
  name: string;
  tokens: SemanticToken[];
}

const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    name: 'Background',
    tokens: [
      { variable: '--bg-page', label: 'Main' },
      { variable: '--bg-surface', label: 'Page' },
      { variable: '--bg-fill', label: 'Card' },
    ],
  },
  {
    name: 'Brand',
    tokens: [
      { variable: '--bg-surface-brand', label: 'Icon Background' },
      { variable: '--bg-fill-brand', label: 'Button' },
      { variable: '--fg-brand', label: 'Icon & Link' },
    ],
  },
  {
    name: 'Text',
    tokens: [
      { variable: '--fg-primary', label: 'Heading' },
      { variable: '--fg-secondary', label: 'Body' },
      { variable: '--fg-tertiary', label: 'Subtle' },
    ],
  },
  {
    name: 'Border',
    tokens: [
      { variable: '--border', label: 'Border' },
      { variable: '--border-hover', label: 'Divider' },
    ],
  },
];

// ── Utility Functions ──────────────────────────────────────────────────

function loadGoogleFont(fontName: string) {
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function hexToOklab(hex: string): { L: number; C: number; H: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const R = toLinear(r), G = toLinear(g), B = toLinear(b);
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
  const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bv = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const C = Math.sqrt(a * a + bv * bv);
  let H = Math.atan2(bv, a) * 180 / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

function getContrastColor(hex: string, brandHex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  if (luminance > 0.4) {
    const { H } = hexToOklab(brandHex);
    return `oklch(0.20 0.08 ${Math.round(H)})`;
  }
  return '#FFFFFF';
}

function applyPaletteToDOM(palette: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    map[shade.key] = shade.hex;
  }
  root.style.setProperty('--primary-50', map['50']);
  root.style.setProperty('--primary-100', map['100']);
  root.style.setProperty('--primary-200', map['200']);
  root.style.setProperty('--primary-300', map['300']);
  root.style.setProperty('--primary-400', map['400']);
  root.style.setProperty('--primary-500', map['500']);
  root.style.setProperty('--primary-600', map['600']);
  root.style.setProperty('--primary-700', map['700']);
  root.style.setProperty('--primary-800', map['800']);
  root.style.setProperty('--primary-900', map['900']);
  root.style.setProperty('--primary-950', map['950']);
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btnBgShade = dark ? map['400'] : map['600'];
  root.style.setProperty('--fg-inverse', getContrastColor(btnBgShade, map['600']));
}

function hexToHslHue(hex: string): number {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return Math.round(h * 360);
}

function hslHueToHex(h: number): string {
  const s = 0.75;
  const l = 0.45;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getSecondaryColor(primaryHex: string, offsetDegrees: number): string {
  const primaryHue = hexToHslHue(primaryHex);
  const secondaryHue = (primaryHue + offsetDegrees) % 360;
  return hslHueToHex(secondaryHue);
}

function isDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyRadius(scale: RadiusScale, target: HTMLElement | null) {
  if (!target) return;
  if (scale === 'Medium') {
    target.removeAttribute('data-radius');
  } else {
    target.setAttribute('data-radius', scale.toLowerCase());
  }
}

/**
 * Apply the Default preset theme to the DOM.
 * Call this on app initialization so components are styled before AppDesigner opens.
 */
export function applyDefaultTheme() {
  const dark = isDarkMode();
  const palette = generatePalette(DEFAULT_COLOR, dark);
  applyPaletteToDOM(palette);
  applyNeutralToDOM(generateNeutralPalette(DEFAULT_COLOR, DEFAULT_TINT, dark));
  loadGoogleFont(DEFAULT_FONT);
  document.documentElement.style.setProperty('--font-family', `'${DEFAULT_FONT}', -apple-system, BlinkMacSystemFont, sans-serif`);
  document.documentElement.style.setProperty('--font-family-heading', `'${DEFAULT_FONT}', -apple-system, BlinkMacSystemFont, sans-serif`);
}

const _tokenCanvas = document.createElement('canvas');
_tokenCanvas.width = 1;
_tokenCanvas.height = 1;
const _tokenCtx = _tokenCanvas.getContext('2d', { willReadFrequently: true })!;

function resolveTokenColor(variable: string): string {
  const temp = document.createElement('div');
  temp.style.color = `var(${variable})`;
  document.documentElement.appendChild(temp);
  const resolved = getComputedStyle(temp).color;
  document.documentElement.removeChild(temp);
  _tokenCtx.clearRect(0, 0, 1, 1);
  _tokenCtx.fillStyle = '#000000';
  _tokenCtx.fillStyle = resolved;
  _tokenCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = _tokenCtx.getImageData(0, 0, 1, 1).data;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

// ── Sub-components ─────────────────────────────────────────────────────

function TokenSwatch({ variable, label, color, gradient, isEditing, onEdit }: {
  variable: string;
  label: string;
  color: string;
  gradient?: string;
  isEditing: boolean;
  onEdit: (variable: string, rect: DOMRect) => void;
}) {
  return (
    <button
      className={`edit-theme-panel__row${isEditing ? ' edit-theme-panel__row--editing' : ''}`}
      onClick={(e) => onEdit(variable, e.currentTarget.getBoundingClientRect())}
      title={`${label} (${variable})`}
    >
      <span
        className="edit-theme-panel__row-color"
        style={{ background: gradient || color }}
      />
      <span className="edit-theme-panel__row-label">{label}</span>
      <span className="edit-theme-panel__row-hex">{gradient ? 'Gradient' : color}</span>
    </button>
  );
}

function FontDropdown({ fonts, active, onChange }: { fonts: string[]; active: string; onChange: (f: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fonts.forEach(loadGoogleFont);
  }, [fonts]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="preset-dropdown" ref={ref}>
      <button className="preset-dropdown__trigger" onClick={() => setOpen(!open)}>
        <span className="preset-dropdown__label font-preview" style={{ fontFamily: `'${active}', sans-serif` }}>{active}</span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu">
          {fonts.map((f) => (
            <button
              key={f}
              className={`preset-dropdown__item font-preview${f === active ? ' active' : ''}`}
              style={{ fontFamily: `'${f}', sans-serif` }}
              onClick={() => { onChange(f); setOpen(false); }}
            >
              <span className="preset-dropdown__item-label font-preview">{f}</span>
              {f === active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="preset-dropdown__check"><path d="M20 6 9 17l-5-5"/></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────

interface AppDesignerProps {
  onClose?: () => void;
  targetSelector?: string;
}

export function AppDesigner({ onClose, targetSelector = '.app-scope' }: AppDesignerProps) {
  const { library: activeIconLibrary, iconStyle: activeIconStyle, setLibrary: setIconLibrary, setIconStyle } = useIconLibrary();

  // Theme state
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [font, setFont] = useState(DEFAULT_FONT);
  const [headingFont, setHeadingFont] = useState(DEFAULT_HEADING_FONT);
  const [radius, setRadius] = useState<RadiusScale>(DEFAULT_RADIUS as RadiusScale);
  const [, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR, isDarkMode()));
  const [harmonyOffset, setHarmonyOffset] = useState(DEFAULT_HARMONY);
  const [secondaryEnabled] = useState(false);
  const [activePreset, setActivePreset] = useState('Default');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });
  const [designerTab, setDesignerTab] = useState<'general' | 'layout'>('general');

  // Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const customBtnRef = useRef<HTMLButtonElement>(null);

  // Token editor state
  const [tokenEditorOpen, setTokenEditorOpen] = useState(false);
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, string>>({});
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [resolvedTokenColors, setResolvedTokenColors] = useState<Record<string, string>>({});
  const [tokenPickerPos, setTokenPickerPos] = useState({ top: 0, left: 0 });
  const [tokenOpacity, setTokenOpacity] = useState(100);
  const [colorPickerMode, setColorPickerMode] = useState<'solid' | 'gradient'>('solid');
  const [gradientStart, setGradientStart] = useState(color);
  const [gradientEnd, setGradientEnd] = useState('#FFFFFF');
  const tokenPickerRef = useRef<HTMLDivElement>(null);

  // ── Target element for radius ──

  const getTarget = useCallback(() => {
    return document.querySelector<HTMLElement>(targetSelector);
  }, [targetSelector]);

  // ── Callbacks ──

  const applySecondary = useCallback((primaryColor: string, offset: number, dark: boolean) => {
    const secondaryColor = getSecondaryColor(primaryColor, offset);
    const secondaryPalette = generatePalette(secondaryColor, dark);
    applySecondaryPaletteToDOM(secondaryPalette);
  }, []);

  const applyHeadingFontToDOM = useCallback((hFont: string, bodyFont: string) => {
    if (hFont) {
      loadGoogleFont(hFont);
      document.documentElement.style.setProperty('--font-family-heading', `'${hFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    } else {
      document.documentElement.style.setProperty('--font-family-heading', `'${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
  }, []);

  const applyPreset = useCallback((preset: ThemePreset) => {
    setActivePreset(preset.name);
    for (const cat of TOKEN_CATEGORIES) {
      for (const tok of cat.tokens) {
        document.documentElement.style.removeProperty(tok.variable);
      }
    }
    document.documentElement.style.removeProperty('--fg-disabled');
    document.documentElement.style.removeProperty('--bg-page-gradient');
    setColorPickerMode('solid');
    setTokenOverrides({});
    setEditingToken(null);
    setTokenEditorOpen(false);
    setColor(preset.color);
    const newPalette = generatePalette(preset.color, preset.mode === 'dark');
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    setHarmonyOffset(preset.harmonyOffset);
    if (secondaryEnabled) {
      applySecondary(preset.color, preset.harmonyOffset, preset.mode === 'dark');
    }
    setTint(preset.tint);
    applyNeutralToDOM(generateNeutralPalette(preset.color, preset.tint, preset.mode === 'dark'));
    setFont(preset.font);
    loadGoogleFont(preset.font);
    document.documentElement.style.setProperty('--font-family', `'${preset.font}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont(preset.headingFont);
    applyHeadingFontToDOM(preset.headingFont, preset.font);
    setRadius(preset.radius);
    applyRadius(preset.radius, getTarget());
    loadLibrary(preset.iconLibrary, 'outline').then(() => {
      setIconLibrary(preset.iconLibrary);
      setIconStyle('outline');
    });
    setColorMode(preset.mode);
    if (preset.mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', preset.mode);
  }, [secondaryEnabled, applySecondary, applyHeadingFontToDOM, setIconLibrary, setIconStyle, getTarget]);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    if (secondaryEnabled) {
      applySecondary(newColor, harmonyOffset, isDarkMode());
    }
    applyNeutralToDOM(generateNeutralPalette(newColor, tint, isDarkMode()));
  }, [tint, harmonyOffset, secondaryEnabled, applySecondary]);

  const handleGradientChange = useCallback((start: string, end: string) => {
    setGradientStart(start);
    setGradientEnd(end);
    document.documentElement.style.setProperty('--bg-page-gradient', `linear-gradient(to bottom, ${start}, ${end})`);
  }, []);

  const handleTintChange = useCallback((newTint: number) => {
    setTint(newTint);
    const neutralPalette = generateNeutralPalette(color, newTint, isDarkMode());
    applyNeutralToDOM(neutralPalette);
  }, [color]);

  const handleFontChange = useCallback((newFont: string) => {
    setFont(newFont);
    loadGoogleFont(newFont);
    document.documentElement.style.setProperty('--font-family', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont((prev) => {
      if (!prev) {
        document.documentElement.style.setProperty('--font-family-heading', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
      }
      return prev;
    });
  }, []);

  const handleHeadingFontChange = useCallback((newFont: string) => {
    setHeadingFont(newFont);
    setFont((currentBody) => {
      applyHeadingFontToDOM(newFont, currentBody);
      return currentBody;
    });
  }, [applyHeadingFontToDOM]);

  const handleIconLibraryChange = useCallback(async (lib: IconLibrary) => {
    await loadLibrary(lib, 'outline');
    setIconLibrary(lib);
    setIconStyle('outline');
  }, [setIconLibrary, setIconStyle]);

  const handleIconStyleChange = useCallback(async (style: IconStyle) => {
    await loadLibrary(activeIconLibrary, style);
    setIconStyle(style);
  }, [activeIconLibrary, setIconStyle]);

  const handleRadiusChange = useCallback((scale: RadiusScale) => {
    setRadius(scale);
    applyRadius(scale, getTarget());
  }, [getTarget]);

  const handleColorModeChange = useCallback((mode: 'light' | 'dark') => {
    setColorMode(mode);
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', mode);
  }, []);

  // ── Token editor callbacks ──

  const resolveAllTokens = useCallback(() => {
    const colors: Record<string, string> = {};
    for (const category of TOKEN_CATEGORIES) {
      for (const token of category.tokens) {
        colors[token.variable] = resolveTokenColor(token.variable);
      }
    }
    setResolvedTokenColors(colors);
  }, []);

  const handleTokenColorChange = useCallback((variable: string, newColor: string) => {
    document.documentElement.style.setProperty(variable, newColor);
    setTokenOverrides((prev) => ({ ...prev, [variable]: newColor }));
    setResolvedTokenColors((prev) => ({ ...prev, [variable]: newColor }));
    if (variable === '--bg-page') {
      document.documentElement.style.removeProperty('--bg-page-gradient');
    }
    if (variable === '--fg-tertiary') {
      document.documentElement.style.setProperty('--fg-disabled', newColor);
    }
    if (variable === '--bg-fill-brand') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newPalette = generatePalette(newColor, isDark);
      applyPaletteToDOM(newPalette);
      document.documentElement.style.setProperty('--fg-inverse', getContrastColor(newColor, newColor));
      setTokenOverrides((prev) => {
        for (const [v, c] of Object.entries(prev)) {
          if (v !== variable) {
            document.documentElement.style.setProperty(v, c);
          }
        }
        return prev;
      });
    }
  }, []);

  const handleResetTokenOverrides = useCallback(() => {
    for (const variable of Object.keys(tokenOverrides)) {
      document.documentElement.style.removeProperty(variable);
    }
    document.documentElement.style.removeProperty('--fg-disabled');
    setTokenOverrides({});
    setEditingToken(null);
    setTimeout(() => resolveAllTokens(), 50);
  }, [tokenOverrides, resolveAllTokens]);

  // ── Effects ──

  // Apply palette + neutrals + secondary on changes and theme toggle
  useEffect(() => {
    const palette = generatePalette(color, isDarkMode());
    applyPaletteToDOM(palette);
    if (secondaryEnabled) {
      applySecondary(color, harmonyOffset, isDarkMode());
    } else {
      resetSecondaryPalette();
    }
    applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));

    const observer = new MutationObserver(() => {
      applyPaletteToDOM(generatePalette(color, isDarkMode()));
      if (secondaryEnabled) {
        applySecondary(color, harmonyOffset, isDarkMode());
      }
      applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [color, tint, harmonyOffset, secondaryEnabled, applySecondary]);

  // No cleanup on unmount — theme changes persist after closing the panel

  // Resolve tokens when editor opens or theme changes
  useEffect(() => {
    if (tokenEditorOpen) {
      resolveAllTokens();
    }
  }, [tokenEditorOpen, colorMode, color, tint, resolveAllTokens]);

  // Re-resolve on data-theme attribute change
  useEffect(() => {
    if (!tokenEditorOpen) return;
    const observer = new MutationObserver(() => resolveAllTokens());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [tokenEditorOpen, resolveAllTokens]);

  // Reposition token picker if it overflows viewport
  useEffect(() => {
    if (editingToken && tokenPickerRef.current) {
      requestAnimationFrame(() => {
        const el = tokenPickerRef.current;
        if (!el) return;
        const pickerRect = el.getBoundingClientRect();
        if (pickerRect.bottom > window.innerHeight) {
          const swatchTop = tokenPickerPos.top - 8;
          const newTop = swatchTop - pickerRect.height - 8;
          el.style.top = `${Math.max(8, newTop)}px`;
        }
      });
    }
  }, [editingToken, tokenPickerPos]);

  // Close token picker on outside click
  useEffect(() => {
    if (!editingToken) return;
    const handleClick = (e: MouseEvent) => {
      if (tokenPickerRef.current && !tokenPickerRef.current.contains(e.target as Node)) {
        setEditingToken(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [editingToken]);

  // Close color picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  // ── Render ──

  if (tokenEditorOpen) {
    return (
      <div className="edit-theme-panel">
        <div className="edit-theme-panel__header">
          <button
            className="edit-theme-panel__back"
            onClick={() => {
              setTokenEditorOpen(false);
              setEditingToken(null);
            }}
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
          <span className="edit-theme-panel__title">Edit Theme</span>
        </div>
        <div className="edit-theme-panel__body">
          {TOKEN_CATEGORIES.map((category) => (
            <div key={category.name} className="edit-theme-panel__category">
              <h4 className="edit-theme-panel__category-title">{category.name}</h4>
              <div className="edit-theme-panel__tokens">
                {category.tokens.map((token) => {
                  const currentColor = tokenOverrides[token.variable] || resolvedTokenColors[token.variable] || '#000000';
                  return (
                    <TokenSwatch
                      key={token.variable}
                      variable={token.variable}
                      label={token.label}
                      color={currentColor}
                      gradient={token.variable === '--bg-page' && colorPickerMode === 'gradient' ? `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})` : undefined}
                      isEditing={editingToken === token.variable}
                      onEdit={(v, rect) => {
                        const opening = editingToken !== v;
                        setEditingToken(opening ? v : null);
                        if (opening) {
                          setPickerOpen(false);
                          setTokenPickerPos({ top: rect.bottom + 8, left: rect.left });
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(tokenOverrides).length > 0 && (
            <div className="edit-theme-panel__reset-wrapper">
              <button className="edit-theme-panel__reset-btn" onClick={handleResetTokenOverrides}>
                <Icon name="RotateCcw" size={14} />
                <span>Reset All Overrides</span>
              </button>
            </div>
          )}
        </div>
        {editingToken && (
          <div className="color-theme-grid__picker-popup" ref={tokenPickerRef} style={{ top: tokenPickerPos.top, left: tokenPickerPos.left }}>
            {editingToken === '--bg-page' ? (
              <ColorPicker
                color={tokenOverrides[editingToken] || resolvedTokenColors[editingToken] || '#000000'}
                onChange={(newColor) => handleTokenColorChange(editingToken, newColor)}
                tint={tint}
                onTintChange={handleTintChange}
                hideTint
                opacity={tokenOpacity}
                onOpacityChange={setTokenOpacity}
                showTabs
                mode={colorPickerMode}
                onModeChange={setColorPickerMode}
                gradientStart={gradientStart}
                gradientEnd={gradientEnd}
                onGradientChange={handleGradientChange}
              />
            ) : (
              <TokenColorPicker
                color={tokenOverrides[editingToken] || resolvedTokenColors[editingToken] || '#000000'}
                onChange={(newColor) => handleTokenColorChange(editingToken, newColor)}
                tint={tint}
                onTintChange={handleTintChange}
                mode="Opacity"
                opacity={tokenOpacity}
                onOpacityChange={setTokenOpacity}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="sidebar-panel__header">
        <span className="sidebar-panel__title">App Designer</span>
        {onClose && (
          <button className="sidebar-panel__close" onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      {/* Tab Bar */}
      <div className="sidebar-panel__tabs">
        <button
          className={`sidebar-panel__tab${designerTab === 'general' ? ' sidebar-panel__tab--active' : ''}`}
          onClick={() => setDesignerTab('general')}
        >
          General
        </button>
        <button
          className={`sidebar-panel__tab${designerTab === 'layout' ? ' sidebar-panel__tab--active' : ''}`}
          onClick={() => setDesignerTab('layout')}
        >
          Layout
        </button>
      </div>
      {/* Color Themes */}
      <div className="v2-section v2-section--color-themes">
        <h3 className="v2-section__title">Themes</h3>
        <div className="v2-preset-grid">
          {THEME_PRESETS.map((preset) => {
            const isActive = activePreset === preset.name;
            loadGoogleFont(preset.headingFont || preset.font);
            return (
              <div key={preset.name} className="v2-preset-grid__item">
                <button
                  className={`color-theme-grid__item${isActive ? ' active' : ''}`}
                  onClick={() => { applyPreset(preset); setPickerOpen(false); }}
                  title={preset.name}
                >
                  <div className="color-theme-grid__outer" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${preset.color}, #fff 20%) 0%, ${preset.color} 50%, color-mix(in srgb, ${preset.color}, #000 25%) 100%)` }} />
                </button>
                <span className={`v2-preset-grid__label${isActive ? ' v2-preset-grid__label--active' : ''}`}>{PRESET_SHORT_NAMES[preset.name] || preset.name}</span>
              </div>
            );
          })}
          {/* Custom color button */}
          <div className="v2-preset-grid__item">
            <div className="color-theme-grid__custom-wrapper" ref={pickerRef}>
              <button
                ref={customBtnRef}
                className={`color-theme-grid__custom${activePreset === '' ? ' active customized' : ''}`}
                style={activePreset === '' ? { background: color } : undefined}
                onClick={() => {
                  if (activePreset !== '') setActivePreset('');
                  if (!pickerOpen && customBtnRef.current) {
                    const rect = customBtnRef.current.getBoundingClientRect();
                    setPickerPos({ top: rect.bottom + 8, left: rect.right - 268 });
                  }
                  setPickerOpen(!pickerOpen);
                }}
                title="Custom color"
              >
                <div className="color-theme-grid__custom-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>
              {pickerOpen && (
                <div className="color-theme-grid__picker-popup" style={{ top: pickerPos.top, left: pickerPos.left }}>
                  <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
                </div>
              )}
            </div>
            <span className={`v2-preset-grid__label${activePreset === '' ? ' v2-preset-grid__label--active' : ''}`}>Custom</span>
          </div>
        </div>
        <button className="v2-edit-theme-btn" onClick={() => {
          if (activePreset !== '') setActivePreset('');
          setTokenEditorOpen(true);
          setPickerOpen(false);
          resolveAllTokens();
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M3.333 4.167c0-.46.373-.834.834-.834H10c.46 0 .833-.373.833-.833S10.46 1.667 10 1.667H4.167A2.5 2.5 0 001.667 4.167v11.666a2.5 2.5 0 002.5 2.5h11.666a2.5 2.5 0 002.5-2.5V10c0-.46-.373-.833-.833-.833s-.833.373-.833.833v5.833c0 .461-.373.834-.834.834H4.167a.833.833 0 01-.834-.834V4.167zM9.033 7.642a1.667 1.667 0 01.507-1.17l4.536-4.536a2.083 2.083 0 012.926 0l.724.725a2.083 2.083 0 010 2.926l-4.536 4.536c-.232.232-.517.406-.83.506l-1.927.62a1.667 1.667 0 01-2.02-2.02l.62-1.928zm1.685.35a.833.833 0 00-.098.16l-.584 1.815 1.815-.584a.833.833 0 00.161-.098l2.76-2.76-1.294-1.294-2.76 2.76zm5.83-3.243l-.598.597-1.293-1.293.597-.598a.417.417 0 01.57 0l.724.725a.417.417 0 010 .569z"/></svg>
          <span>Edit Theme</span>
        </button>
      </div>

      {/* Color Mode */}
      <div className="v2-section">
        <h3 className="v2-section__title">Color Mode</h3>
        <div className="v2-segmented">
          <button
            className={`v2-segmented__btn${colorMode === 'light' ? ' v2-segmented__btn--active' : ''}`}
            onClick={() => handleColorModeChange('light')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <span>Light</span>
          </button>
          <button
            className={`v2-segmented__btn${colorMode === 'dark' ? ' v2-segmented__btn--active' : ''}`}
            onClick={() => handleColorModeChange('dark')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Corners */}
      <div className="v2-section">
        <h3 className="v2-section__title">Corner Style</h3>
        <div className="v2-segmented">
          {([
            { scale: 'Small' as RadiusScale, r: 6 },
            { scale: 'Medium' as RadiusScale, r: 12 },
            { scale: 'Large' as RadiusScale, r: 16 },
            { scale: 'XLarge' as RadiusScale, r: 24 },
          ]).map(({ scale, r }) => (
            <button
              key={scale}
              className={`v2-segmented__btn${radius === scale ? ' v2-segmented__btn--active' : ''}`}
              onClick={() => handleRadiusChange(scale)}
              title={scale}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Heading Font */}
      <div className="v2-section">
        <h3 className="v2-section__title">Heading Font</h3>
        <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
      </div>

      {/* Body Font */}
      <div className="v2-section">
        <h3 className="v2-section__title">Body Font</h3>
        <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
      </div>

      {/* Icon Style */}
      <div className="v2-section">
        <h3 className="v2-section__title">Icon Style</h3>
        <div className="themes-view__icon-library-options themes-view__icon-library-options--4col">
          {([
            { lib: 'lucide' as const, style: 'outline' as const, svg: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            )},
            { lib: 'phosphor' as const, style: 'outline' as const, svg: (
              <svg width="24" height="24" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <rect x="32" y="48" width="192" height="160" rx="8"/><circle cx="96" cy="112" r="20"/><path d="M224,168l-44.69-44.69a8,8,0,0,0-11.31,0L100.69,190.6,83.31,173.31a8,8,0,0,0-11.31,0L32,213.09"/>
              </svg>
            )},
            { lib: 'tabler' as const, style: 'outline' as const, svg: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 8h.01"/><rect width="16" height="16" x="4" y="4" rx="3"/><path d="m4 15 4-4a3 5 0 0 1 3 0l5 5"/><path d="m14 14 1-1a3 5 0 0 1 3 0l2 2"/>
              </svg>
            )},
            { lib: 'phosphor' as const, style: 'fill' as const, svg: (
              <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-60,64a12,12,0,1,1,12,12A12,12,0,0,1,156,104ZM40,200V172l52-52,80,80Zm176,0H194.63l-56-56,20-20L216,181.38Z"/>
              </svg>
            )},
          ]).map(({ lib, style, svg }) => {
            const isActive = activeIconLibrary === lib && activeIconStyle === style;
            return (
              <button
                key={`${lib}-${style}`}
                className={`themes-view__icon-library-btn${isActive ? ' active' : ''}`}
                onClick={() => { handleIconLibraryChange(lib); handleIconStyleChange(style); }}
              >
                {svg}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
