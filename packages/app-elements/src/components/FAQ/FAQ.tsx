import { useState, useEffect, useId, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { type FaqItem, type FaqStyle, type FaqIcon, type FaqIconPosition } from './types';
import './FAQ.scss';

export type { FaqItem, FaqStyle, FaqIcon, FaqIconPosition } from './types';

export interface FaqProps {
  style?: FaqStyle;
  icon?: FaqIcon;
  iconPosition?: FaqIconPosition;
  items?: FaqItem[];
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
  /** When provided, the element is in builder (editable) mode. */
  onItemsChange?: (items: FaqItem[]) => void;
}

const DEFAULT_QUESTION = 'Your question goes here?';
const ANSWER_PLACEHOLDER = 'Add an answer.';

// ============================================
// Inline edit helpers (question text, builder only)
// ============================================
function handleEditFocus(e: React.FocusEvent<HTMLElement>, defaultValue: string) {
  if (e.currentTarget.textContent === defaultValue) {
    e.currentTarget.textContent = '';
    e.currentTarget.dataset.placeholder = defaultValue;
    e.currentTarget.classList.add('jf-faq__placeholder');
  }
}

function handleEditInput(e: React.FormEvent<HTMLElement>) {
  if (e.currentTarget.textContent) {
    e.currentTarget.classList.remove('jf-faq__placeholder');
  } else {
    e.currentTarget.classList.add('jf-faq__placeholder');
  }
}

function handleEditBlur(e: React.FocusEvent<HTMLElement>, defaultValue: string, onUpdate: (val: string) => void) {
  const text = e.currentTarget.textContent || '';
  e.currentTarget.classList.remove('jf-faq__placeholder');
  delete e.currentTarget.dataset.placeholder;
  if (text) {
    onUpdate(text);
  } else {
    e.currentTarget.textContent = defaultValue;
    onUpdate(defaultValue);
  }
}

// ============================================
// Default items
// ============================================
const DEFAULT_ITEMS: FaqItem[] = [
  { question: 'What is included in my plan?', answer: 'Every plan includes the core features you need to get started. Higher tiers unlock advanced options, more usage, and priority support.' },
  { question: 'Can I change my plan later?', answer: 'Yes — you can upgrade or downgrade at any time. Changes take effect immediately and your billing is prorated.' },
  { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee. If you are not satisfied, reach out to our support team for a full refund.' },
];

// ============================================
// Toggle indicator
// ============================================
const ToggleIcon: FC<{ icon: FaqIcon; open: boolean }> = ({ icon, open }) => {
  if (icon === 'Plus/Minus') {
    return <Icon name={open ? 'Minus' : 'Plus'} size={20} className="jf-faq__icon-glyph" forceStyle="outline" />;
  }
  return <Icon name="ChevronDown" size={20} className="jf-faq__icon-glyph" forceStyle="outline" />;
};

// ============================================
// FAQ Component
// ============================================
export const FAQ: FC<FaqProps> = ({
  style = 'Divider',
  icon = 'Chevron',
  iconPosition = 'Right',
  items = DEFAULT_ITEMS,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
  onItemsChange,
}) => {
  // Single-open accordion — first visible item open by default.
  const [openIndex, setOpenIndex] = useState(() => items.findIndex((it) => it.visible !== false));
  const editable = Boolean(onItemsChange);
  const baseId = useId();

  // Keep the open index valid as items are added, removed, or hidden from the
  // builder. Respect an intentional "all collapsed" (-1); otherwise fall back
  // to the first visible item whenever the current target is gone or hidden.
  useEffect(() => {
    setOpenIndex((prev) => {
      if (prev === -1) return -1;
      if (prev < items.length && items[prev]?.visible !== false) return prev;
      return items.findIndex((it) => it.visible !== false);
    });
  }, [items]);

  const rootClasses = [
    'jf-faq',
    `jf-faq--${style === 'Card' ? 'card' : 'divider'}`,
    `jf-faq--icon-${iconPosition === 'Left' ? 'left' : 'right'}`,
    icon === 'Plus/Minus' && 'jf-faq--pm',
    selected && 'jf-faq--selected',
    shrinked && 'jf-faq--shrinked',
  ].filter(Boolean).join(' ');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={rootClasses}>
        <div className="jf-faq__list">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`jf-faq__item ${animClass}`}>
              <div className="jf-faq__header">
                <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
                <span className="jf-faq__icon"><ToggleIcon icon={icon} open={false} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleToggle = (i: number) => setOpenIndex((prev) => (prev === i ? -1 : i));

  const updateItem = (i: number, updates: Partial<FaqItem>) => {
    onItemsChange?.(items.map((it, idx) => (idx === i ? { ...it, ...updates } : it)));
  };

  const handleAddItem = () => {
    onItemsChange?.([...items, { question: DEFAULT_QUESTION, answer: '' }]);
    setOpenIndex(items.length);
  };

  return (
    <div className={rootClasses}>
      {/* Accordion list */}
      <div className="jf-faq__list">
        {items.map((item, i) => {
          if (item.visible === false) return null;
          const open = openIndex === i;
          return (
            <div key={i} className={`jf-faq__item ${open ? 'jf-faq__item--open' : ''}`}>
              <div
                className="jf-faq__header"
                id={`${baseId}-h-${i}`}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-controls={`${baseId}-${i}`}
                onClick={() => handleToggle(i)}
                onKeyDown={(e) => {
                  // Don't hijack typing inside the inline-editable question.
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(i);
                  }
                }}
              >
                <span className="jf-faq__icon"><ToggleIcon icon={icon} open={open} /></span>
                {editable ? (
                  <div
                    className="jf-faq__question"
                    contentEditable
                    suppressContentEditableWarning
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => handleEditFocus(e, DEFAULT_QUESTION)}
                    onInput={handleEditInput}
                    onBlur={(e) => handleEditBlur(e, DEFAULT_QUESTION, (val) => updateItem(i, { question: val }))}
                  >
                    {item.question}
                  </div>
                ) : (
                  <div className="jf-faq__question">{item.question}</div>
                )}
              </div>
              <div className="jf-faq__answer-wrap" id={`${baseId}-${i}`} role="region" aria-labelledby={`${baseId}-h-${i}`}>
                <div className="jf-faq__answer">
                  {editable ? (
                    <p
                      className="jf-faq__answer-text"
                      contentEditable
                      suppressContentEditableWarning
                      data-placeholder={ANSWER_PLACEHOLDER}
                      onBlur={(e) => updateItem(i, { answer: e.currentTarget.textContent || '' })}
                    >
                      {item.answer}
                    </p>
                  ) : (
                    <p className="jf-faq__answer-text">{item.answer}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {editable && (
          <button type="button" className="jf-faq__add" onClick={handleAddItem}>
            <Icon name="Plus" size={18} forceStyle="outline" />
            <span>Add Question</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FAQ;
