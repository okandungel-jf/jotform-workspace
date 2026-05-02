import { LucideIcon } from './IconPicker'

interface SplashScreenMockupProps {
  bgColor: string
  fontColor: string
  iconName: string
  iconColor: string
  iconBg: string
  appName: string
}

export function SplashScreenMockup({
  bgColor,
  fontColor,
  iconName,
  iconColor,
  iconBg,
  appName,
}: SplashScreenMockupProps) {
  return (
    <div className="splash-mockup" style={{ background: bgColor, color: fontColor }}>
      <div className="splash-mockup__app">
        <div className="splash-mockup__icon" style={{ background: iconBg, color: iconColor }}>
          <LucideIcon name={iconName} size={56} />
        </div>
        <span className="splash-mockup__label">{appName || 'My App'}</span>
      </div>
    </div>
  )
}
