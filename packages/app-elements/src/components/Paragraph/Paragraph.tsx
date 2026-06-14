import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold, Italic, Underline, Baseline,
  Link2, AlignLeft, AlignCenter, AlignRight,
  Check, ChevronDown, ChevronRight, Sparkles, ALargeSmall, Plus, Type,
} from 'lucide-react';
import type { FieldToken } from '@jf/design-system';
import './Paragraph.scss';

export type ParagraphSize = 'Large' | 'Medium' | 'Small';
export type ParagraphAlignment = 'Left' | 'Center' | 'Right';
export type ParagraphToolbar = 'Inline' | 'Tooltip';

/** A selectable data-table text column offered by the "Add Field" menu on a
 *  dynamic detail page. `value` resolves against the previewed item; `tag` is the
 *  inline token text rendered as {tag} (e.g. "4_description"). */
export interface ParagraphFieldOption {
  value: string;
  label: string;
  tag: string;
}

// Field-token contentEditable plumbing — ported from the design-system
// FieldComposer, but tokens render as a highlighted {tag} text span (not a chip).
// Zero-width spaces around each token let the caret land on either side of a
// contenteditable="false" span even when no real text neighbours it.
const ZWSP = '\u200B';

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function fieldTokenText(t: Extract<FieldToken, { type: 'field' }>): string {
  return `{${t.tag || t.value}}`;
}

function fieldTokenHtml(t: Extract<FieldToken, { type: 'field' }>): string {
  return (
    `<span class="jf-paragraph__field-token" contenteditable="false"` +
    ` data-token-type="field"` +
    ` data-token-value="${escapeHtml(t.value)}"` +
    ` data-token-label="${escapeHtml(t.label)}"` +
    ` data-token-tag="${escapeHtml(t.tag ?? '')}"` +
    ` data-token-icon="${escapeHtml(t.icon ?? '')}"` +
    ` data-token-icon-category="${escapeHtml(t.iconCategory ?? '')}"` +
    `>${escapeHtml(fieldTokenText(t))}</span>`
  );
}

function tokensToHtml(tokens: FieldToken[]): string {
  if (tokens.length === 0) return '';
  const parts: string[] = [];
  // Lead with a ZWSP if the first token is a field so the caret can land before it.
  if (tokens[0].type === 'field') parts.push(ZWSP);
  for (const t of tokens) {
    if (t.type === 'text') parts.push(escapeHtml(t.value));
    else { parts.push(fieldTokenHtml(t)); parts.push(ZWSP); }
  }
  return parts.join('');
}

function parseTokens(root: HTMLElement): FieldToken[] {
  const out: FieldToken[] = [];
  const pushText = (raw: string) => {
    const value = raw.replace(/\u200B/g, '');
    if (!value) return;
    const last = out[out.length - 1];
    if (last && last.type === 'text') last.value += value;
    else out.push({ type: 'text', value });
  };
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) { pushText(node.textContent ?? ''); return; }
    if (node instanceof HTMLElement) {
      if (node.dataset.tokenType === 'field') {
        out.push({
          type: 'field',
          value: node.dataset.tokenValue || '',
          label: node.dataset.tokenLabel || '',
          tag: node.dataset.tokenTag || undefined,
          icon: node.dataset.tokenIcon || undefined,
          iconCategory: node.dataset.tokenIconCategory || undefined,
        });
        return;
      }
      if (node.tagName === 'BR') { pushText('\n'); return; }
      node.childNodes.forEach(walk);
    }
  };
  root.childNodes.forEach(walk);
  return out;
}

function buildTokenElement(option: ParagraphFieldOption): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'jf-paragraph__field-token';
  span.setAttribute('contenteditable', 'false');
  span.dataset.tokenType = 'field';
  span.dataset.tokenValue = option.value;
  span.dataset.tokenLabel = option.label;
  span.dataset.tokenTag = option.tag;
  span.textContent = `{${option.tag || option.value}}`;
  return span;
}

function isEditorEmpty(editor: HTMLElement): boolean {
  if (editor.querySelector('[data-token-type="field"]')) return false;
  return !(editor.textContent ?? '').replace(/\u200B/g, '').trim();
}

export interface ParagraphProps {
  size?: ParagraphSize;
  alignment?: ParagraphAlignment;
  toolbar?: ParagraphToolbar;
  placeholder?: string;
  defaultValue?: string;
  selected?: boolean;
  /** Stored field/text composition (dynamic detail page). While focused these
   *  surface as inline highlighted {tag} tokens mixed with free text; unfocused
   *  the editor shows `defaultValue` (the resolved value of the previewed row). */
  fieldTokens?: FieldToken[];
  /** Data-table text columns offered by the "Add Field" toolbar menu. Its
   *  presence puts the paragraph in field-composition mode (dynamic page). */
  fieldOptions?: ParagraphFieldOption[];
  /** Fired (in field mode) whenever the composed tokens change, so the builder can
   *  persist them back to the element's "Text Tokens" property. */
  onFieldTokensChange?: (tokens: FieldToken[]) => void;
  /** Fired when the toolbar changes alignment/size, so the builder can persist them
   *  (the alignment/size live only in the canvas toolbar now, not the side panel —
   *  without this the live preview would keep the stale default). */
  onAlignmentChange?: (alignment: ParagraphAlignment) => void;
  onSizeChange?: (size: ParagraphSize) => void;
  onClickOutside?: () => void;
}

const ALIGN_ICON: Record<ParagraphAlignment, FC<{ size?: number; strokeWidth?: number }>> = {
  Left: AlignLeft,
  Center: AlignCenter,
  Right: AlignRight,
};

export const Paragraph: FC<ParagraphProps> = ({
  size = 'Medium',
  alignment = 'Left',
  toolbar = 'Inline',
  placeholder = 'Enter your text',
  defaultValue = '',
  selected: controlledSelected,
  fieldTokens,
  fieldOptions,
  onFieldTokensChange,
  onAlignmentChange,
  onSizeChange,
  onClickOutside,
}) => {
  const [internalSelected, setInternalSelected] = useState(false);
  const selected = controlledSelected ?? internalSelected;
  // On a dynamic detail page the paragraph composes its text from inline {tag}
  // field tokens. `fieldMode` is driven by the bound text columns being present.
  const fieldMode = !!fieldOptions && fieldOptions.length > 0;
  const fieldTokensKey = JSON.stringify(fieldTokens ?? []);
  // Last token JSON we emitted, so the seeding effect can skip re-writing the
  // editor (which would lose the caret) when our own edit round-trips back in.
  const lastEmittedRef = useRef<string>('');
  const [align, setAlign] = useState<ParagraphAlignment>(alignment);
  const [currentSize, setCurrentSize] = useState<ParagraphSize>(size);
  // Keep the local alignment/size in sync with the persisted props. The toolbar
  // mutates these locally for snappy feedback, but a separate instance (e.g. the
  // live preview) only ever receives them as props — without this sync it would
  // render the stale default after a toolbar change.
  useEffect(() => { setAlign(alignment); }, [alignment]);
  useEffect(() => { setCurrentSize(size); }, [size]);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [aiPickerOpen, setAiPickerOpen] = useState(false);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const subMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>('--neutral-900');
  const savedSelection = useRef<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorBtnRef = useRef<HTMLButtonElement>(null);
  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const [tooltipX, setTooltipX] = useState<number | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mobileSheetType, setMobileSheetType] = useState<'size' | 'ai' | 'ai-tone' | 'color' | 'field' | null>(null);
  const deviceContainerRef = useRef<HTMLElement | null>(null);
  const isTooltip = toolbar === 'Tooltip';
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateFormatStates = useCallback(() => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
  }, []);

  useEffect(() => {
    if (rootRef.current) {
      const device = rootRef.current.closest('.themes-view__device--mobile') as HTMLElement | null;
      const isMobile = !!device || window.matchMedia('(max-width: 480px)').matches;
      setIsMobileDevice(isMobile);
      deviceContainerRef.current = device || rootRef.current.closest('.themes-view') as HTMLElement || document.body;
    }
  }, [selected]);

  // Seed the editor content.
  //  • field mode + focused → write the {tag} token HTML (once; skip when the
  //    current tokens are the ones we just emitted, so the caret survives edits).
  //  • otherwise → show the resolved/plain text (the previewed row's value).
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (fieldMode && selected) {
      if (lastEmittedRef.current !== fieldTokensKey) {
        const seedTokens: FieldToken[] = fieldTokens && fieldTokens.length
          ? fieldTokens
          : (defaultValue ? [{ type: 'text', value: defaultValue }] : []);
        editor.innerHTML = tokensToHtml(seedTokens);
        lastEmittedRef.current = fieldTokensKey;
      }
      setIsEmpty(isEditorEmpty(editor));
    } else {
      const text = defaultValue ?? '';
      if (editor.textContent !== text) editor.textContent = text;
      setIsEmpty(!text.trim());
      // Reset so re-entering edit mode always re-seeds the token HTML.
      lastEmittedRef.current = '';
    }
  }, [fieldMode, selected, fieldTokensKey, defaultValue, fieldTokens]);

  const handleInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (fieldMode && selected) {
      setIsEmpty(isEditorEmpty(editor));
      const tokens = parseTokens(editor);
      lastEmittedRef.current = JSON.stringify(tokens);
      onFieldTokensChange?.(tokens);
    } else {
      setIsEmpty(!(editor.textContent || '').trim());
    }
    updateFormatStates();
  }, [fieldMode, selected, onFieldTokensChange, updateFormatStates]);

  const handleSelect = useCallback((e: React.MouseEvent) => {
    if (controlledSelected === undefined) {
      if (!internalSelected && toolbar === 'Tooltip' && rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect();
        setTooltipX(e.clientX - rect.left);
      }
      setInternalSelected(true);
    }
  }, [controlledSelected, internalSelected, toolbar]);

  useEffect(() => {
    if (!selected) {
      setColorPickerOpen(false);
      setSizePickerOpen(false);
      setAiPickerOpen(false);
      setAddFieldOpen(false);
      setSubMenuOpen(false);
      setMobileSheetType(null);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (controlledSelected === undefined) setInternalSelected(false);
        setColorPickerOpen(false);
        setTooltipX(null);
        onClickOutside?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selected, controlledSelected, onClickOutside]);

  useEffect(() => {
    if (selected && editorRef.current) {
      editorRef.current.focus();
    }
  }, [selected]);

  // Clamp tooltip within paragraph bounds
  useEffect(() => {
    if (!selected || !isTooltip || !toolbarRef.current || !rootRef.current || tooltipX === null) return;
    const tb = toolbarRef.current;
    const root = rootRef.current;
    const tbW = tb.offsetWidth;
    const rootW = root.offsetWidth;
    const halfTb = tbW / 2;
    const clamped = Math.max(halfTb, Math.min(tooltipX, rootW - halfTb));
    if (clamped !== tooltipX) setTooltipX(clamped);
  }, [selected, isTooltip, tooltipX]);

  useEffect(() => {
    if (!selected) return;
    const onSelChange = () => updateFormatStates();
    document.addEventListener('selectionchange', onSelChange);
    return () => document.removeEventListener('selectionchange', onSelChange);
  }, [selected, updateFormatStates]);

  const execCommand = useCallback((command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    updateFormatStates();
  }, [updateFormatStates]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  }, []);

  const applyColor = useCallback((color: string) => {
    restoreSelection();
    document.execCommand('foreColor', false, color);
    setActiveColor(color);
    setColorPickerOpen(false);
    editorRef.current?.focus();
  }, [restoreSelection]);

  // ---- Field tokens (dynamic detail page) ----------------------------------
  const clearTokenSelection = useCallback(() => {
    editorRef.current?.querySelectorAll('.jf-paragraph__field-token--selected')
      .forEach((el) => el.classList.remove('jf-paragraph__field-token--selected'));
  }, []);

  // Insert a {tag} token at the saved caret position, wrapped in zero-width
  // spaces so the caret can sit on either side.
  const insertToken = useCallback((option: ParagraphFieldOption) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    restoreSelection();
    const sel = window.getSelection();
    const span = buildTokenElement(option);
    let range: Range;
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
      range.deleteContents();
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    range.insertNode(span);
    const before = document.createTextNode(ZWSP);
    const after = document.createTextNode(ZWSP);
    span.before(before);
    span.after(after);
    range.setStartAfter(after);
    range.setEndAfter(after);
    sel?.removeAllRanges();
    sel?.addRange(range);
    handleInput();
  }, [restoreSelection, handleInput]);

  // Locate a field token immediately before a collapsed caret (skipping ZWSPs).
  const findTokenBeforeCaret = useCallback((): HTMLElement | null => {
    const editor = editorRef.current;
    if (!editor) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return null;
    const range = sel.getRangeAt(0);
    if (!editor.contains(range.startContainer)) return null;
    let node: Node | null = range.startContainer;
    let offset = range.startOffset;
    if (node.nodeType === Node.TEXT_NODE) {
      const before = (node.textContent ?? '').slice(0, offset).replace(/\u200B/g, '');
      if (before.length > 0) return null;
    } else {
      const children = node.childNodes;
      if (offset === 0) node = node.parentNode;
      else {
        node = children[offset - 1];
        offset = node?.nodeType === Node.TEXT_NODE ? (node.textContent?.length ?? 0) : 1;
      }
    }
    while (node && node !== editor) {
      const prev = node.previousSibling;
      if (!prev) { node = node.parentNode; continue; }
      if (prev.nodeType === Node.TEXT_NODE) {
        const cleaned = (prev.textContent ?? '').replace(/\u200B/g, '');
        if (cleaned.length > 0) return null;
        node = prev;
        continue;
      }
      if (prev instanceof HTMLElement && prev.dataset.tokenType === 'field') return prev;
      return null;
    }
    return null;
  }, []);

  // Backspace: first press selects the token before the caret, second deletes it
  // (along with its caret-helper ZWSPs).
  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Backspace') {
      if (e.key.length === 1 || e.key === 'Delete' || e.key === 'Enter' || e.key === ' ') clearTokenSelection();
      return;
    }
    const editor = editorRef.current;
    if (!editor) return;
    const sel = window.getSelection();
    if (!sel) return;
    const alreadySelected = editor.querySelector<HTMLElement>('.jf-paragraph__field-token--selected');
    if (alreadySelected) {
      e.preventDefault();
      const before = alreadySelected.previousSibling;
      const after = alreadySelected.nextSibling;
      const range = document.createRange();
      const placeAt = before instanceof Text ? before : after instanceof Text ? after : null;
      alreadySelected.remove();
      if (before instanceof Text && /^\u200B*$/.test(before.textContent ?? '')) before.remove();
      if (after instanceof Text && /^\u200B*$/.test(after.textContent ?? '')) after.remove();
      if (placeAt && placeAt.parentNode) {
        range.setStart(placeAt, placeAt.textContent?.length ?? 0);
        range.collapse(true);
      } else {
        range.selectNodeContents(editor);
        range.collapse(false);
      }
      sel.removeAllRanges();
      sel.addRange(range);
      handleInput();
      return;
    }
    const tokenBefore = findTokenBeforeCaret();
    if (tokenBefore) {
      e.preventDefault();
      tokenBefore.classList.add('jf-paragraph__field-token--selected');
    }
  }, [clearTokenSelection, findTokenBeforeCaret, handleInput]);

  const cssColorToHex = useCallback((cssColor: string) => {
    const cvs = document.createElement('canvas');
    cvs.width = cvs.height = 1;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, []);

  const NEUTRAL_VARS = ['--neutral-900', '--neutral-600', '--neutral-400', '--neutral-200', '--neutral-100', '--neutral-0'];

  const FIXED_COLORS = [
    '#0099FF',
    '#FCB900',
    '#DC2626',
    '#64B200',
    '#892DCA',
  ];

  const openSubMenu = useCallback(() => {
    if (subMenuTimer.current) clearTimeout(subMenuTimer.current);
    setSubMenuOpen(true);
  }, []);

  const closeSubMenu = useCallback((delay = 300) => {
    if (subMenuTimer.current) clearTimeout(subMenuTimer.current);
    subMenuTimer.current = setTimeout(() => setSubMenuOpen(false), delay);
  }, []);

  const cycleAlign = useCallback(() => {
    const order: ParagraphAlignment[] = ['Left', 'Center', 'Right'];
    const next = order[(order.indexOf(align) + 1) % order.length];
    setAlign(next);
    if (editorRef.current) editorRef.current.style.textAlign = next.toLowerCase();
    onAlignmentChange?.(next);
  }, [align, onAlignmentChange]);

  const classes = [
    'jf-paragraph',
    `jf-paragraph--${currentSize.toLowerCase()}`,
    selected && !isTooltip && 'jf-paragraph--selected',
    isTooltip && 'jf-paragraph--tooltip-mode',
  ].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={classes} onClick={handleSelect}>
      <div
        ref={editorRef}
        className={`jf-paragraph__editor${isEmpty ? ' jf-paragraph__editor--empty' : ''}`}
        contentEditable={selected}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={fieldMode && selected ? handleEditorKeyDown : undefined}
        onMouseDown={fieldMode && selected ? clearTokenSelection : undefined}
        data-placeholder={placeholder}
        style={{ textAlign: align.toLowerCase() as 'left' | 'center' | 'right' }}
      />
      {selected && (
        <div
          ref={toolbarRef}
          className={`jf-paragraph__toolbar${isTooltip ? ' jf-paragraph__toolbar--tooltip' : ''}`}
          style={isTooltip && tooltipX !== null ? { left: tooltipX, transform: 'translateX(-50%)' } : undefined}
        >
          <div className="jf-paragraph__size-wrap">
            <button
              className={`jf-paragraph__tool jf-paragraph__tool--size${sizePickerOpen ? ' jf-paragraph__tool--active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault(); saveSelection();
                if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'size' ? null : 'size'); }
                else { setSizePickerOpen(!sizePickerOpen); }
              }}
            >
              <ALargeSmall size={18} strokeWidth={2.5} className="jf-paragraph__mobile-only" />
              <span className="jf-paragraph__desktop-only">{currentSize}</span>
              <ChevronDown size={14} strokeWidth={2.5} className="jf-paragraph__chevron" />
            </button>
            {sizePickerOpen && !isMobileDevice && (
              <div className="jf-paragraph__size-picker">
                {(['Large', 'Medium', 'Small'] as ParagraphSize[]).map((s) => (
                  <button
                    key={s}
                    className={`jf-paragraph__size-option${currentSize === s ? ' jf-paragraph__size-option--active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setCurrentSize(s); onSizeChange?.(s); setSizePickerOpen(false); editorRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="jf-paragraph__divider" />
          <button className={`jf-paragraph__tool${isBold ? ' jf-paragraph__tool--active' : ''}`} onClick={() => execCommand('bold')} title="Bold">
            <Bold size={18} strokeWidth={2.5} />
          </button>
          <button className={`jf-paragraph__tool${isItalic ? ' jf-paragraph__tool--active' : ''}`} onClick={() => execCommand('italic')} title="Italic">
            <Italic size={18} strokeWidth={2.5} />
          </button>
          <button className={`jf-paragraph__tool${isUnderline ? ' jf-paragraph__tool--active' : ''}`} onClick={() => execCommand('underline')} title="Underline">
            <Underline size={18} strokeWidth={2.5} />
          </button>
          <span className="jf-paragraph__divider" />
          <div className="jf-paragraph__color-wrap">
            <button
              ref={colorBtnRef}
              className={`jf-paragraph__tool${colorPickerOpen ? ' jf-paragraph__tool--active' : ''}`}
              title="Text color"
              onMouseDown={(e) => {
                e.preventDefault(); saveSelection();
                if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'color' ? null : 'color'); }
                else { setColorPickerOpen(!colorPickerOpen); }
              }}
            >
              <Baseline size={18} strokeWidth={2.5} />
            </button>
            {colorPickerOpen && !isMobileDevice && (
              <div className="jf-paragraph__color-picker">
                <div className="jf-paragraph__color-row">
                  {NEUTRAL_VARS.map((v) => (
                    <button
                      key={v}
                      className={`jf-paragraph__color-swatch${activeColor === v ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: `var(${v})` }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => { applyColor(cssColorToHex(getComputedStyle(e.currentTarget).backgroundColor)); setActiveColor(v); }}
                      title={v}
                    >
                      {activeColor === v && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                  {FIXED_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`jf-paragraph__color-swatch${activeColor === c ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: c }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyColor(c)}
                    >
                      {activeColor === c && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="jf-paragraph__tool" onClick={() => {
            const url = prompt('Enter URL');
            if (url) document.execCommand('createLink', false, url);
            editorRef.current?.focus();
          }} title="Link">
            <Link2 size={18} strokeWidth={2.5} />
          </button>
          <button className="jf-paragraph__tool" onClick={cycleAlign} title="Alignment">
            {(() => { const AlignIcon = ALIGN_ICON[align]; return <AlignIcon size={18} strokeWidth={2.5} />; })()}
          </button>
          <span className="jf-paragraph__divider" />
          <div className="jf-paragraph__ai-wrap">
            <button
              className={`jf-paragraph__tool jf-paragraph__tool--size${aiPickerOpen ? ' jf-paragraph__tool--active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault(); saveSelection();
                if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'ai' ? null : 'ai'); }
                else { setAiPickerOpen(!aiPickerOpen); }
              }}
            >
              <Sparkles size={16} strokeWidth={2.5} />
              <span className="jf-paragraph__desktop-only">AI Edit</span>
              <ChevronDown size={14} strokeWidth={2.5} className="jf-paragraph__chevron" />
            </button>
            {aiPickerOpen && !isMobileDevice && (
              <div className="jf-paragraph__ai-menu">
                <button
                  className="jf-paragraph__ai-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setAiPickerOpen(false); editorRef.current?.focus(); }}
                >
                  Improve
                </button>
                <div
                  className="jf-paragraph__ai-submenu-wrap"
                  onMouseEnter={openSubMenu}
                  onMouseLeave={() => closeSubMenu()}
                >
                  <button className={`jf-paragraph__ai-option jf-paragraph__ai-option--has-sub${subMenuOpen ? ' jf-paragraph__ai-option--hover' : ''}`}>
                    <span>Change tone</span>
                    <ChevronRight size={16} strokeWidth={2.5} className="jf-paragraph__chevron" />
                  </button>
                  {subMenuOpen && (
                    <div
                      className="jf-paragraph__ai-submenu"
                      onMouseEnter={openSubMenu}
                      onMouseLeave={() => closeSubMenu(150)}
                    >
                      {['Neutral', 'Friendly', 'Professional', 'Casual'].map((tone) => (
                        <button
                          key={tone}
                          className="jf-paragraph__ai-option"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setAiPickerOpen(false); setSubMenuOpen(false); editorRef.current?.focus(); }}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="jf-paragraph__ai-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setAiPickerOpen(false); editorRef.current?.focus(); }}
                >
                  Simplify
                </button>
                <button
                  className="jf-paragraph__ai-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setAiPickerOpen(false); editorRef.current?.focus(); }}
                >
                  Expand
                </button>
              </div>
            )}
          </div>
          {fieldMode && (
            <>
              <span className="jf-paragraph__divider" />
              <div className="jf-paragraph__addfield-wrap">
                <button
                  className={`jf-paragraph__tool jf-paragraph__tool--size jf-paragraph__addfield-trigger${addFieldOpen ? ' jf-paragraph__tool--active' : ''}`}
                  title="Add Field"
                  onMouseDown={(e) => {
                    e.preventDefault(); saveSelection();
                    if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'field' ? null : 'field'); }
                    else { setAddFieldOpen(!addFieldOpen); }
                  }}
                >
                  <span className="jf-paragraph__addfield-plus"><Plus size={13} strokeWidth={3.5} /></span>
                  <span className="jf-paragraph__desktop-only">Add Field</span>
                </button>
                {addFieldOpen && !isMobileDevice && (
                  <div className="jf-paragraph__addfield-menu">
                    {fieldOptions!.map((opt) => (
                      <button
                        key={opt.value}
                        className="jf-paragraph__addfield-option"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { insertToken(opt); setAddFieldOpen(false); }}
                      >
                        <Type size={18} strokeWidth={2.5} className="jf-paragraph__addfield-icon" />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Mobile Bottom Sheet — portal into device container */}
      {isMobileDevice && mobileSheetType && deviceContainerRef.current && createPortal(
        <div className="jf-paragraph__sheet-overlay" onClick={() => setMobileSheetType(null)}>
          <div className="jf-paragraph__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="jf-paragraph__sheet-handle" />

            {mobileSheetType === 'size' && (
              <>
                <div className="jf-paragraph__sheet-title">Text Size</div>
                <div className="jf-paragraph__sheet-options">
                  {(['Large', 'Medium', 'Small'] as ParagraphSize[]).map((s) => (
                    <button
                      key={s}
                      className={`jf-paragraph__sheet-option${currentSize === s ? ' jf-paragraph__sheet-option--active' : ''}`}
                      onClick={() => { setCurrentSize(s); onSizeChange?.(s); setMobileSheetType(null); editorRef.current?.focus(); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheetType === 'color' && (
              <>
                <div className="jf-paragraph__sheet-title">Text Color</div>
                <div className="jf-paragraph__sheet-colors">
                  {NEUTRAL_VARS.map((v) => (
                    <button
                      key={v}
                      className={`jf-paragraph__color-swatch${activeColor === v ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: `var(${v})` }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => { applyColor(cssColorToHex(getComputedStyle(e.currentTarget).backgroundColor)); setActiveColor(v); setMobileSheetType(null); }}
                    >
                      {activeColor === v && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                  {FIXED_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`jf-paragraph__color-swatch${activeColor === c ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: c }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { applyColor(c); setMobileSheetType(null); }}
                    >
                      {activeColor === c && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheetType === 'ai' && (
              <>
                <div className="jf-paragraph__sheet-title">AI Edit</div>
                <div className="jf-paragraph__sheet-options">
                  <button className="jf-paragraph__sheet-option" onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}>
                    Improve
                  </button>
                  <button className="jf-paragraph__sheet-option" onClick={() => setMobileSheetType('ai-tone')}>
                    Change tone
                    <ChevronRight size={16} strokeWidth={2.5} className="jf-paragraph__chevron" />
                  </button>
                  <button className="jf-paragraph__sheet-option" onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}>
                    Simplify
                  </button>
                  <button className="jf-paragraph__sheet-option" onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}>
                    Expand
                  </button>
                </div>
              </>
            )}

            {mobileSheetType === 'ai-tone' && (
              <>
                <div className="jf-paragraph__sheet-title">Change Tone</div>
                <div className="jf-paragraph__sheet-options">
                  {['Neutral', 'Friendly', 'Professional', 'Casual'].map((tone) => (
                    <button
                      key={tone}
                      className="jf-paragraph__sheet-option"
                      onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheetType === 'field' && (
              <>
                <div className="jf-paragraph__sheet-title">Add Field</div>
                <div className="jf-paragraph__sheet-options">
                  {fieldOptions?.map((opt) => (
                    <button
                      key={opt.value}
                      className="jf-paragraph__sheet-option"
                      onClick={() => { insertToken(opt); setMobileSheetType(null); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>,
        deviceContainerRef.current,
      )}
    </div>
  );
};
