import type React from 'react';
import { Icon } from '../Icon/Icon';
import './AppHeader.scss';

export type AppHeaderLayout = 'Left' | 'Center' | 'Right';

export type AppHeaderImageStyle = 'Image' | 'Icon' | 'None';

export interface AppHeaderProps {
  layout?: AppHeaderLayout;
  icon?: string;
  imageStyle?: AppHeaderImageStyle;
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  textColor?: string;
  backgroundImageUrl?: string | null;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
  actions?: React.ReactNode;
  actionsSlotRef?: React.RefObject<HTMLDivElement | null>;
  onIconClick?: (e: React.MouseEvent) => void;
  iconSelected?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  layout = 'Center',
  icon = 'Leaf',
  imageStyle = 'Icon',
  imageUrl,
  title = 'Urban Jungle',
  subtitle = "Istanbul's Rare Plant Haven",
  textColor,
  backgroundImageUrl,
  skeleton = false,
  skeletonAnimation = 'pulse',
  actions,
  actionsSlotRef,
  onIconClick,
  iconSelected,
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={`jf-app-header jf-app-header--${layout.toLowerCase()} jf-app-header--skeleton`}>
        <div className="jf-app-header__inner">
          <div className={`jf-app-header__icon-skeleton ${animClass}`} />
          <div className="jf-app-header__text">
            <div className={`jf-app-header__title-skeleton ${animClass}`} style={{ width: 160 }} />
            <div className={`jf-app-header__subtitle-skeleton ${animClass}`} style={{ width: 200 }} />
          </div>
        </div>
      </div>
    );
  }

  const iconClass = [
    'jf-app-header__icon',
    imageStyle === 'Image' && imageUrl && 'jf-app-header__icon--image',
    onIconClick && 'jf-app-header__icon--interactive',
    iconSelected && 'jf-app-header__icon--selected',
  ].filter(Boolean).join(' ');

  const rootStyle: React.CSSProperties | undefined = backgroundImageUrl
    ? { background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImageUrl}) center/cover no-repeat` }
    : undefined;

  return (
    <div className={`jf-app-header jf-app-header--${layout.toLowerCase()}`} style={rootStyle}>
      <div className="jf-app-header__inner">
        {imageStyle !== 'None' && (
          <div
            className={iconClass}
            onClick={onIconClick}
            role={onIconClick ? 'button' : undefined}
            tabIndex={onIconClick ? 0 : undefined}
            onKeyDown={onIconClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onIconClick(e as unknown as React.MouseEvent); } } : undefined}
          >
            {imageStyle === 'Image' && imageUrl ? (
              <img src={imageUrl} alt="" className="jf-app-header__image" />
            ) : (
              <Icon name={icon} size={48} />
            )}
          </div>
        )}
        {(title || subtitle) && (
          <div className="jf-app-header__text" style={textColor ? { color: textColor } : undefined}>
            {title && <h1 className="jf-app-header__title">{title}</h1>}
            {subtitle && <p className="jf-app-header__subtitle">{subtitle}</p>}
          </div>
        )}
      </div>
      <div ref={actionsSlotRef} className="jf-app-header__actions">
        {actions}
      </div>
    </div>
  );
};

export default AppHeader;
