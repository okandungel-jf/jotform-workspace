import { LucideIcon } from './IconPicker'

export type IconStyle = 'flat' | 'linear' | 'inverse' | 'mesh'
export type AppIconVariant = 'Icon' | 'Image'

interface HomeScreenMockupProps {
  variant?: AppIconVariant
  imageUrl?: string | null
  iconName: string
  iconColor: string
  iconBg: string
  iconStyle?: IconStyle
  appName: string
}

export function HomeScreenMockup({
  variant = 'Icon',
  imageUrl,
  iconName,
  iconColor,
  iconBg,
  iconStyle = 'flat',
  appName,
}: HomeScreenMockupProps) {
  const showImage = variant === 'Image' && !!imageUrl
  return (
    <div className="home-mockup">
      <div className="home-mockup__status-bar">
        <span className="home-mockup__time">9:41</span>
        <div className="home-mockup__status-indicators">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" aria-hidden>
            <rect x="0" y="7" width="2" height="3" rx="0.5" />
            <rect x="3" y="5" width="2" height="5" rx="0.5" />
            <rect x="6" y="3" width="2" height="7" rx="0.5" />
            <rect x="9" y="0" width="2" height="10" rx="0.5" />
          </svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" aria-hidden>
            <path d="M7 1.5C5 1.5 3.2 2.2 1.7 3.4l1.1 1.4C3.9 4 5.4 3.5 7 3.5s3.1.5 4.2 1.3l1.1-1.4C10.8 2.2 9 1.5 7 1.5zm0 3c-1.3 0-2.4.4-3.3 1.1l1.1 1.4C5.4 6.5 6.2 6.2 7 6.2s1.6.3 2.2.8l1.1-1.4C9.4 4.9 8.3 4.5 7 4.5zm0 3c-.6 0-1.1.2-1.5.5L7 9.7l1.5-1.7c-.4-.3-.9-.5-1.5-.5z" />
          </svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="currentColor" aria-hidden>
            <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor" strokeOpacity="0.5" fill="none" />
            <rect x="2" y="2" width="15" height="6" rx="1" />
            <rect x="19.5" y="3.5" width="2" height="3" rx="0.5" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="home-mockup__grid home-mockup__grid--top">
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
        <div className="home-mockup__app">
          {showImage ? (
            <div
              className="home-mockup__app-icon home-mockup__app-icon--image"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div
              className={`home-mockup__app-icon home-mockup__app-icon--${iconStyle}`}
              style={iconStyle === 'flat' ? { background: iconBg, color: iconColor } : { color: iconColor }}
            >
              <LucideIcon name={iconName} size={40} />
            </div>
          )}
          <span className="home-mockup__app-label">{appName || 'My App'}</span>
        </div>
        <div className="home-mockup__slot" />
      </div>

      <div className="home-mockup__spacer" />

      <div className="home-mockup__grid home-mockup__grid--dock">
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
        <div className="home-mockup__slot" />
      </div>

    </div>
  )
}
