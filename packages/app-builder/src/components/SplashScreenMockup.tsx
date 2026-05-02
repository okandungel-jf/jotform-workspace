import { LucideIcon } from './IconPicker'

export type SplashStyle = 'flat' | 'linear' | 'inverse' | 'mesh'
export type SplashAnimation = 'none' | 'fade' | 'scale' | 'slide'

interface SplashScreenMockupProps {
  bgColor: string
  bgStyle?: SplashStyle
  fontColor: string
  iconName: string
  iconColor: string
  iconBg: string
  appName: string
  animation?: SplashAnimation
}

export function SplashScreenMockup({
  bgColor,
  bgStyle = 'flat',
  fontColor,
  iconName,
  iconColor,
  iconBg,
  appName,
  animation = 'none',
}: SplashScreenMockupProps) {
  return (
    <div
      className={`splash-mockup splash-mockup--${bgStyle}`}
      style={bgStyle === 'flat' ? { background: bgColor, color: fontColor } : { color: fontColor }}
    >
      <div
        // Key on the animation makes the demo loop restart when the option changes,
        // so the user immediately sees the new animation play.
        key={animation}
        className={`splash-mockup__app splash-mockup__app--anim-${animation}`}
      >
        <div className="splash-mockup__icon" style={{ background: iconBg, color: iconColor }}>
          <LucideIcon name={iconName} size={56} />
        </div>
        <span className="splash-mockup__label">{appName || 'My App'}</span>
      </div>
    </div>
  )
}
