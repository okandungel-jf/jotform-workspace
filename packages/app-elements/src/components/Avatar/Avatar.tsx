import type { FC } from 'react';
import { Icon } from '../Icon/Icon';
import './Avatar.scss';

export type AvatarPresence = 'online' | 'offline' | 'away' | 'none';

export interface AvatarProps {
  /** Name used for initials fallback + alt text. */
  name?: string;
  /** Image URL. When absent, falls back to initials, then a User icon. */
  image?: string;
  /** Diameter in px. */
  size?: number;
  /** Presence dot in the lower-right corner. */
  presence?: AvatarPresence;
  className?: string;
}

/** First letters of the first two words, uppercased — "Ada Lovelace" → "AL". */
function initials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

export const Avatar: FC<AvatarProps> = ({ name, image, size = 40, presence = 'none', className }) => {
  const initial = initials(name);
  const classes = ['jf-avatar', className].filter(Boolean).join(' ');
  // Icon scales with the avatar so it reads at any size.
  const iconSize = Math.round(size * 0.5);

  return (
    <span className={classes} style={{ width: size, height: size }}>
      {image ? (
        <img src={image} alt={name ?? ''} className="jf-avatar__img" />
      ) : initial ? (
        <span className="jf-avatar__initials" style={{ fontSize: Math.round(size * 0.4) }}>{initial}</span>
      ) : (
        <Icon name="User" size={iconSize} />
      )}
      {presence !== 'none' && (
        <span className={`jf-avatar__presence jf-avatar__presence--${presence}`} />
      )}
    </span>
  );
};

export default Avatar;
