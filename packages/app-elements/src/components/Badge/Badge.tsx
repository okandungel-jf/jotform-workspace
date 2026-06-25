import type { FC } from 'react';
import './Badge.scss';

export type BadgeTone = 'brand' | 'neutral' | 'danger';

export interface BadgeProps {
  /** Numeric count (e.g. unread). Capped by `max`. Ignored when `dot` is set. */
  count?: number;
  /** Text label. Takes precedence over `count`. */
  label?: string;
  /** Cap for the count, e.g. 99 → "99+". */
  max?: number;
  /** Render a bare dot with no number. */
  dot?: boolean;
  tone?: BadgeTone;
  className?: string;
}

export const Badge: FC<BadgeProps> = ({ count, label, max = 99, dot = false, tone = 'brand', className }) => {
  const classes = [
    'jf-badge',
    `jf-badge--${tone}`,
    dot && 'jf-badge--dot',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (dot) return <span className={classes} aria-hidden="true" />;

  // Hide a zero count entirely — nothing to surface.
  if (label == null && (count == null || count <= 0)) return null;

  const content = label ?? (count! > max ? `${max}+` : String(count));
  return <span className={classes}>{content}</span>;
};

export default Badge;
