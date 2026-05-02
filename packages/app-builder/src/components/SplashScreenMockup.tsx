import { LucideIcon } from './IconPicker'

export type SplashStyle = 'flat' | 'linear' | 'inverse' | 'mesh'

interface SplashScreenMockupProps {
  bgColor: string
  bgStyle?: SplashStyle
  fontColor: string
  iconName: string
  iconColor: string
  iconBg: string
  appName: string
}

export function SplashScreenMockup({
  bgColor,
  bgStyle = 'flat',
  fontColor,
  iconName,
  iconColor,
  iconBg,
  appName,
}: SplashScreenMockupProps) {
  return (
    <div
      className={`splash-mockup splash-mockup--${bgStyle}`}
      style={bgStyle === 'flat' ? { background: bgColor, color: fontColor } : { color: fontColor }}
    >
      <div className="splash-mockup__app">
        <div className="splash-mockup__icon" style={{ background: iconBg, color: iconColor }}>
          <LucideIcon name={iconName} size={56} />
        </div>
        <span className="splash-mockup__label">{appName || 'My App'}</span>
      </div>
    </div>
  )
}
