import { AppIcon, Button as AppButton } from '@jf/app-elements'
import { getPageIconName } from './PageNavigationBar'

interface MorePage {
  id: string
  name: string
  icon?: string
}

interface LivePreviewMorePagesViewProps {
  pages: MorePage[]
  onPageSelect: (pageId: string) => void
  isLoggedIn?: boolean
  onLoginClick?: () => void
  onSignUpClick?: () => void
}

export function LivePreviewMorePagesView({
  pages,
  onPageSelect,
  isLoggedIn = false,
  onLoginClick,
  onSignUpClick,
}: LivePreviewMorePagesViewProps) {
  return (
    <div className="live-preview__more-pages">
      <ul className="live-preview__more-pages-list" role="list">
        {pages.map((page, index) => {
          const iconName = getPageIconName(page, index)
          return (
            <li key={page.id}>
              <button
                type="button"
                className="live-preview__more-pages-item"
                onClick={() => onPageSelect(page.id)}
              >
                <AppIcon name={iconName} size={20} />
                <span className="live-preview__more-pages-label">{page.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {!isLoggedIn && (onLoginClick || onSignUpClick) && (
        <div className="live-preview__more-pages-auth">
          {onLoginClick && (
            <AppButton
              variant="Outlined"
              size="Default"
              leftIcon="none"
              rightIcon="none"
              label="Login"
              fullWidth
              onClick={onLoginClick}
            />
          )}
          {onSignUpClick && (
            <AppButton
              variant="Default"
              size="Default"
              leftIcon="none"
              rightIcon="none"
              label="Sign up"
              fullWidth
              onClick={onSignUpClick}
            />
          )}
        </div>
      )}
    </div>
  )
}
