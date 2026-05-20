import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import './EmptyContent.scss';

export type EmptyContentState =
  | 'empty'
  | 'no-results'
  | 'no-filter-results'
  | 'error'
  | 'columns-hidden'
  | 'loading';

export interface EmptyContentProps {
  state?: EmptyContentState;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

interface EmptyContentPreset {
  icon: string;
  title: string;
  description: string;
}

const PRESETS: Record<Exclude<EmptyContentState, 'loading'>, EmptyContentPreset> = {
  empty: {
    icon: 'copy-line-dotted',
    title: 'Nothing here yet',
    description: 'Data will appear here when available',
  },
  'no-results': {
    icon: 'magnifying-glass',
    title: 'No results found',
    description: 'Try changing your search for different results',
  },
  'no-filter-results': {
    icon: 'bars-filter',
    title: 'No results match selected filter(s)',
    description: 'Try selecting other filters for different results',
  },
  error: {
    icon: 'exclamation-triangle-filled',
    title: 'An error occurred',
    description: 'Please try again in a minute',
  },
  'columns-hidden': {
    icon: 'eye-slash-filled',
    title: 'All columns hidden',
    description: 'Try changing column preferences to see content',
  },
};

export function EmptyContent({
  state = 'empty',
  title,
  description,
  action,
  className,
}: EmptyContentProps) {
  if (state === 'loading') {
    return (
      <div
        className={['jf-empty-content', 'jf-empty-content--loading', className]
          .filter(Boolean)
          .join(' ')}
        role="status"
        aria-label="Loading"
      >
        <span className="jf-empty-content__spinner" />
      </div>
    );
  }

  const preset = PRESETS[state];

  return (
    <div className={['jf-empty-content', className].filter(Boolean).join(' ')}>
      <div className="jf-empty-content__illustration">
        <span className="jf-empty-content__pill" aria-hidden="true" />
        <Icon category="general" name={preset.icon} size={96} className="jf-empty-content__icon" />
      </div>
      <div className="jf-empty-content__body">
        <div className="jf-empty-content__text">
          <p className="jf-empty-content__title">{title ?? preset.title}</p>
          <p className="jf-empty-content__description">{description ?? preset.description}</p>
        </div>
        {action && <div className="jf-empty-content__action">{action}</div>}
      </div>
    </div>
  );
}
