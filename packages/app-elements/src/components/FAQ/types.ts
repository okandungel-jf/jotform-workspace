// ============================================
// JotForm Apps - FAQ Component Types
// ============================================

/** Container treatment for the accordion list. */
export type FaqStyle = 'Divider' | 'Card';

/** Toggle indicator shown next to each question. */
export type FaqIcon = 'Chevron' | 'Plus/Minus';

/** Which side the toggle indicator sits on. */
export type FaqIconPosition = 'Left' | 'Right';

export interface FaqItem {
  /** Optional — lazily assigned when the item is edited (backward compat). */
  id?: string;
  question: string;
  answer: string;
  /** Whether the item appears in the list. Defaults to visible. */
  visible?: boolean;
}

let faqIdCounter = 0;

/** Unique, one-time FAQ id — stable once assigned. */
export function makeFaqId(): string {
  return `f_${Date.now().toString(36)}_${(faqIdCounter++).toString(36)}`;
}

/**
 * Lazily assigns ids to items that lack one. Returns a new array only when
 * something changed, so callers can skip redundant writes.
 */
export function ensureFaqIds(items: FaqItem[]): FaqItem[] {
  let changed = false;
  const next = items.map((item) => {
    if (item.id) return item;
    changed = true;
    return { ...item, id: makeFaqId() };
  });
  return changed ? next : items;
}
