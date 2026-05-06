import type { CSSProperties, FC } from 'react';
import { Icon as DSIcon } from '@jf/design-system';
import './SocialFollow.scss';

export type SocialLayout = 'Horizontal' | 'Wrap';
export type SocialVariant = 'Primary' | 'Secondary';

export interface SocialPlatform {
  icon: string;
  label: string;
}

export interface SocialFollowProps {
  layout?: SocialLayout;
  variant?: SocialVariant;
  filled?: boolean;
  platforms?: SocialPlatform[];
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
  iconColor?: string;
}

export interface SocialPlatformConfig extends SocialPlatform {
  /** Property key used to look up the user-entered handle/url. */
  key: string;
  /** When true, the button always renders (used for the default 4). */
  alwaysShow?: boolean;
}

export const ALL_SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  { key: 'Facebook', icon: 'facebook-filled', label: 'Facebook', alwaysShow: true },
  { key: 'Youtube', icon: 'youtube-filled', label: 'YouTube', alwaysShow: true },
  { key: 'Instagram', icon: 'instagram', label: 'Instagram', alwaysShow: true },
  { key: 'TikTok', icon: 'tiktok', label: 'TikTok', alwaysShow: true },
  { key: 'X (Twitter)', icon: 'twitter', label: 'X', alwaysShow: true },
  { key: 'LinkedIn', icon: 'linkedin-filled', label: 'LinkedIn' },
  { key: 'Pinterest', icon: 'pinterest-circle-filled', label: 'Pinterest' },
  { key: 'Tumblr', icon: 'tumblr-circle-filled', label: 'Tumblr' },
  { key: 'Vimeo', icon: 'vimeo-circle-filled', label: 'Vimeo' },
  { key: 'Flickr', icon: 'flickr-circle-filled', label: 'Flickr' },
];

const DEFAULT_PLATFORMS: SocialPlatform[] = ALL_SOCIAL_PLATFORMS
  .filter((p) => p.alwaysShow)
  .map(({ icon, label }) => ({ icon, label }));

export const SocialFollow: FC<SocialFollowProps> = ({
  layout = 'Horizontal',
  variant = 'Primary',
  filled = true,
  platforms = DEFAULT_PLATFORMS,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
  iconColor,
}) => {
  const rootClasses = [
    'jf-social',
    layout === 'Wrap' ? 'jf-social--wrap' : 'jf-social--horizontal',
    selected && 'jf-social--selected',
    shrinked && 'jf-social--shrinked',
  ].filter(Boolean).join(' ');

  const wrapperStyle: CSSProperties | undefined = (() => {
    if (variant === 'Secondary' && !filled) {
      return {
        '--fg-brand': 'var(--fg-primary)',
        '--fg-brand-hover': 'var(--fg-primary)',
      } as CSSProperties;
    }
    if (variant === 'Secondary') return undefined;
    if (!iconColor) return undefined;
    if (!filled) {
      return {
        '--fg-brand': iconColor,
        '--fg-brand-hover': iconColor,
      } as CSSProperties;
    }
    return {
      '--bg-fill-brand': iconColor,
      '--bg-fill-brand-hover': iconColor,
      '--bg-fill-brand-disabled': iconColor,
    } as CSSProperties;
  })();

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={rootClasses} style={wrapperStyle}>
        {platforms.map((_, i) => (
          <div
            key={i}
            className={`jf-skeleton__bone ${animClass}`}
            style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
          />
        ))}
      </div>
    );
  }

  const btnClasses = [
    'jf-btn-icon',
    filled ? 'jf-btn-icon--filled' : 'jf-btn-icon--ghost',
    filled && (variant === 'Secondary' ? 'jf-btn-icon--secondary' : 'jf-btn-icon--default'),
    'jf-btn-icon--rounded',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses} style={wrapperStyle}>
      {platforms.map((platform, i) => (
        <button key={i} className={btnClasses} type="button" aria-label={platform.label}>
          <DSIcon name={platform.icon} category="brands" size={24} className="jf-btn-icon__icon" />
        </button>
      ))}
    </div>
  );
};

export default SocialFollow;
