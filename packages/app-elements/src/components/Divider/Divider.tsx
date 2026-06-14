import { type FC } from 'react';
import './Divider.scss';

export type DividerSpacing = 'Small' | 'Medium' | 'Large';
export type DividerLineStyle = 'Solid' | 'Dashed';

export interface DividerProps {
  /** Vertical padding above/below the rule. */
  spacing?: DividerSpacing;
  lineStyle?: DividerLineStyle;
  selected?: boolean;
  shrinked?: boolean;
}

/** A thin themeable horizontal rule. Pairs with Heading to compose clean
 *  sectioned "list" views (e.g. on dynamic detail pages) without nesting a List. */
export const Divider: FC<DividerProps> = ({
  spacing = 'Medium',
  lineStyle = 'Solid',
  selected = false,
  shrinked = false,
}) => {
  const cls = [
    'jf-divider',
    `jf-divider--${spacing.toLowerCase()}`,
    lineStyle === 'Dashed' && 'jf-divider--dashed',
    selected && 'jf-divider--selected',
    shrinked && 'jf-divider--shrinked',
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} role="separator" aria-orientation="horizontal">
      <span className="jf-divider__line" />
    </div>
  );
};

export default Divider;
