import type { CSSProperties, FC } from 'react';
import { Button } from '../Button';
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

const DEFAULT_PLATFORMS: SocialPlatform[] = [
  { icon: 'Youtube', label: 'YouTube' },
  { icon: 'Twitter', label: 'X' },
  { icon: 'Linkedin', label: 'LinkedIn' },
  { icon: 'Facebook', label: 'Facebook' },
  { icon: 'Instagram', label: 'Instagram' },
];

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

  return (
    <div className={rootClasses} style={wrapperStyle}>
      {platforms.map((platform, i) => (
        <Button
          key={i}
          iconOnly
          iconOnlyIcon={platform.icon}
          iconOnlyFilled={filled}
          variant={variant === 'Secondary' ? 'Secondary' : 'Default'}
          corner="Rounded"
        />
      ))}
    </div>
  );
};

export default SocialFollow;
