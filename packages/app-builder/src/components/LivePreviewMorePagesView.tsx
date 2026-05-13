import { AppIcon } from '@jf/app-elements'
import { getPageIconName } from './PageNavigationBar'

interface MorePage {
  id: string
  name: string
  icon?: string
}

interface LivePreviewMorePagesViewProps {
  pages: MorePage[]
  activePageId: string
  onPageSelect: (pageId: string) => void
}

export function LivePreviewMorePagesView({
  pages,
  activePageId,
  onPageSelect,
}: LivePreviewMorePagesViewProps) {
  return (
    <div className="live-preview__more-pages">
      <ul className="live-preview__more-pages-list" role="list">
        {pages.map((page, index) => {
          const isActive = page.id === activePageId
          const iconName = getPageIconName(page, index)
          return (
            <li key={page.id}>
              <button
                type="button"
                className={`live-preview__more-pages-item${isActive ? ' live-preview__more-pages-item--active' : ''}`}
                onClick={() => onPageSelect(page.id)}
              >
                <AppIcon name={iconName} size={20} forceStyle={isActive ? 'fill' : undefined} />
                <span className="live-preview__more-pages-label">{page.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
