import { useState, useRef, useEffect, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { Icon as DSIcon } from '@jf/design-system';
import './Testimonial.scss';

export type TestimonialLayout = 'Carousel' | 'Slider' | 'Grid' | 'Spotlight';
export type TestimonialAlignment = 'Left' | 'Center';
export type TestimonialCardStyle = 'Border' | 'None';

export interface TestimonialItem {
  /** Optional — lazily assigned when the item is edited (backward compat). */
  id?: string;
  name: string;
  text: string;
  avatar?: string;
  /** Original filename of an uploaded avatar (shown in the builder's image field). */
  avatarName?: string;
  /** Role / company line under the name (e.g. "Founder, Acme"). */
  role?: string;
  /** Star rating 0–5 (supports halves). */
  rating?: number;
  /** Whether the item appears in the element. Defaults to visible. */
  visible?: boolean;
}

export interface TestimonialProps {
  items?: TestimonialItem[];
  layout?: TestimonialLayout;
  alignment?: TestimonialAlignment;
  cardStyle?: TestimonialCardStyle;
  showAvatars?: boolean;
  showRating?: boolean;
  showRole?: boolean;
  showQuoteIcon?: boolean;
  showArrows?: boolean;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

let testimonialIdCounter = 0;

/** Unique, one-time testimonial id — stable once assigned. */
export function makeTestimonialId(): string {
  return `t_${Date.now().toString(36)}_${(testimonialIdCounter++).toString(36)}`;
}

/**
 * Lazily assigns ids to items that lack one. Returns a new array only when
 * something changed, so callers can skip redundant writes.
 */
export function ensureTestimonialIds(items: TestimonialItem[]): TestimonialItem[] {
  let changed = false;
  const next = items.map((item) => {
    if (item.id) return item;
    changed = true;
    return { ...item, id: makeTestimonialId() };
  });
  return changed ? next : items;
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  { name: 'Sarah Johnson', role: 'Marketing Director', rating: 5, text: '“This platform transformed how we collect donations. The interface is intuitive and our donors love it.”', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
  { name: 'Michael Chen', role: 'Founder, Lumen', rating: 5, text: '“Setup was incredibly easy. We were up and running in minutes, not days.”', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
  { name: 'Emily Davis', role: 'Product Lead', rating: 4, text: '“The best investment we made for our nonprofit. Highly recommended!”', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
  { name: 'David Park', role: 'Operations Manager', rating: 5, text: '“Support has been outstanding and the product keeps getting better. We could not be happier with the results.”', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
];

// ============================================
// Star rating
// ============================================
const Stars: FC<{ rating: number }> = ({ rating }) => {
  const r = Math.max(0, Math.min(5, rating));
  return (
    <div className="jf-testimonial__stars" role="img" aria-label={`${r} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = r >= i + 0.5;
        return (
          <DSIcon
            key={i}
            name={filled ? 'star-filled' : 'star'}
            category="general"
            size={16}
            className={`jf-testimonial__star${filled ? ' jf-testimonial__star--on' : ''}`}
          />
        );
      })}
    </div>
  );
};

// ============================================
// Single testimonial card
// ============================================
interface CardFlags {
  showAvatars: boolean;
  showRating: boolean;
  showRole: boolean;
  showQuoteIcon: boolean;
}

const TestimonialCard: FC<{ item: TestimonialItem } & CardFlags> = ({ item, showAvatars, showRating, showRole, showQuoteIcon }) => (
  <div className="jf-testimonial__card">
    {showQuoteIcon && <Icon name="Quote" size={28} forceStyle="fill" className="jf-testimonial__quote-icon" />}
    {showRating && typeof item.rating === 'number' && item.rating > 0 && <Stars rating={item.rating} />}
    <p className="jf-testimonial__quote">{item.text}</p>
    <div className="jf-testimonial__author">
      {showAvatars && (
        <div className="jf-testimonial__avatar">
          {item.avatar ? <img src={item.avatar} alt={item.name} className="jf-testimonial__avatar-img" /> : <Icon name="User" size={24} />}
        </div>
      )}
      <div className="jf-testimonial__author-meta">
        <span className="jf-testimonial__name">{item.name}</span>
        {showRole && item.role && <span className="jf-testimonial__role">{item.role}</span>}
      </div>
    </div>
  </div>
);

// ============================================
// Testimonial Component
// ============================================
export const Testimonial: FC<TestimonialProps> = ({
  items = DEFAULT_ITEMS,
  layout = 'Carousel',
  alignment = 'Left',
  cardStyle = 'Border',
  showAvatars = true,
  showRating = true,
  showRole = true,
  showQuoteIcon = false,
  showArrows = true,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const [active, setActive] = useState(0);
  const [sliderActive, setSliderActive] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.filter((it) => it.visible !== false);
  const count = visibleItems.length;
  // Clamp — items can be added, removed, or hidden from the builder.
  const idx = count > 0 ? Math.min(active, count - 1) : 0;

  // Slider edge fade — only fade the side that actually has clipped overflow
  // (no left fade at the start, no right fade at the end).
  useEffect(() => {
    if (layout !== 'Slider') return;
    const el = sliderRef.current;
    if (!el) return;
    const update = () => {
      el.dataset.fadeStart = String(el.scrollLeft > 4);
      el.dataset.fadeEnd = String(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout, count]);

  const flags: CardFlags = { showAvatars, showRating, showRole, showQuoteIcon };

  const rootClasses = [
    'jf-testimonial',
    `jf-testimonial--${layout.toLowerCase()}`,
    `jf-testimonial--align-${alignment.toLowerCase()}`,
    `jf-testimonial--card-${cardStyle.toLowerCase()}`,
    selected && 'jf-testimonial--selected',
    shrinked && 'jf-testimonial--shrinked',
  ].filter(Boolean).join(' ');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    const bones = layout === 'Grid' || layout === 'Slider' ? [0, 1, 2] : [0];
    return (
      <div className={rootClasses}>
        <div className={layout === 'Grid' ? 'jf-testimonial__grid' : 'jf-testimonial__stage'}>
          {bones.map((i) => (
            <div key={i} className={`jf-testimonial__card ${animClass}`}>
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--md" />
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--md" />
              <div className="jf-testimonial__author">
                <div className="jf-testimonial__avatar jf-skeleton__bone" />
                <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- Grid: every item, responsive columns ----
  if (layout === 'Grid') {
    return (
      <div className={rootClasses}>
        <div className="jf-testimonial__grid">
          {visibleItems.map((it, i) => <TestimonialCard key={i} item={it} {...flags} />)}
        </div>
      </div>
    );
  }

  // ---- Slider: horizontal scroll-snap row navigated by dots ----
  if (layout === 'Slider') {
    const slideEls = (): HTMLElement[] =>
      Array.from(sliderRef.current?.querySelectorAll('.jf-testimonial__slide') ?? []) as HTMLElement[];
    // Centre the target slide; the first/last clamp to the scroll bounds so they
    // sit flush at the start/end (matching their scroll-snap-align overrides).
    const scrollToSlide = (i: number) => {
      const el = sliderRef.current;
      const slide = slideEls()[i];
      if (!el || !slide) return;
      const target = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: 'smooth' });
    };
    const handleScroll = () => {
      const el = sliderRef.current;
      if (!el) return;
      // Active dot = the slide whose centre is nearest the viewport centre.
      const viewportCenter = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      slideEls().forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - viewportCenter);
        if (d < best) { best = d; nearest = i; }
      });
      setSliderActive(nearest);
      el.dataset.fadeStart = String(el.scrollLeft > 4);
      el.dataset.fadeEnd = String(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    return (
      <div className={rootClasses}>
        <div className="jf-testimonial__slider" ref={sliderRef} onScroll={handleScroll}>
          {visibleItems.map((it, i) => (
            <div className="jf-testimonial__slide" key={i}><TestimonialCard item={it} {...flags} /></div>
          ))}
        </div>
        {count > 1 && (
          <div className="jf-testimonial__dots">
            {visibleItems.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`jf-testimonial__dot${i === Math.min(sliderActive, count - 1) ? ' jf-testimonial__dot--active' : ''}`}
                onClick={() => scrollToSlide(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- Carousel & Spotlight: one item at a time, navigated by arrows ----
  const current = visibleItems[idx] ?? { name: '', text: '' };
  const handlePrev = () => setActive(idx === 0 ? count - 1 : idx - 1);
  const handleNext = () => setActive(idx === count - 1 ? 0 : idx + 1);
  return (
    <div className={rootClasses}>
      <div className="jf-testimonial__stage">
        {showArrows && count > 1 && (
          <button className="jf-testimonial__arrow jf-testimonial__arrow--prev" onClick={handlePrev} aria-label="Previous"><Icon name="ChevronLeft" size={18} /></button>
        )}
        <TestimonialCard item={current} {...flags} />
        {showArrows && count > 1 && (
          <button className="jf-testimonial__arrow jf-testimonial__arrow--next" onClick={handleNext} aria-label="Next"><Icon name="ChevronRight" size={18} /></button>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
