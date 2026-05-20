import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import './TableTitle.scss';

export type TableTitleSize = 'sm' | 'md';

export interface TableTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  size?: TableTitleSize;
  icon?: string;
  iconCategory?: string;
  leading?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function TableTitle({
  title,
  subtitle,
  size = 'sm',
  icon,
  iconCategory = 'general',
  leading,
  badge,
  className,
}: TableTitleProps) {
  const rootClass = ['jf-table-title', `jf-table-title--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      {leading ? (
        <div className="jf-table-title__leading">{leading}</div>
      ) : icon ? (
        <div className="jf-table-title__icon-block">
          <Icon name={icon} category={iconCategory} size={size === 'md' ? 24 : 20} />
        </div>
      ) : null}
      <div className="jf-table-title__stack">
        <div className="jf-table-title__row">
          <span className="jf-table-title__title">{title}</span>
          {badge && <span className="jf-table-title__badge">{badge}</span>}
        </div>
        {subtitle && <p className="jf-table-title__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
