import { useState } from 'react'
import { PanelHeader } from '../components/PanelHeader'
import { QuickSharePanel } from '../components/QuickSharePanel'
import { SideNav, type SideNavItem } from '../components/SideNav'

const NAV_ITEMS: SideNavItem[] = [
  {
    id: 'quick-share',
    icon: 'link-diagonal',
    iconCategory: 'general',
    title: 'QUICK SHARE',
    description: 'Direct app link',
    headerTitle: 'PUBLISH',
    headerDescription: 'Share all of your forms in one place.',
    iconBg: 'var(--accent-default)',
  },
  {
    id: 'embed',
    icon: 'angles-selector-slash-horizontal',
    iconCategory: 'arrows',
    title: 'EMBED',
    description: 'Get embed code',
    headerDescription: 'Embed your app easily with one click.',
    iconBg: 'var(--product-reports-default)',
  },
  {
    id: 'app-users',
    icon: 'users-more-filled',
    iconCategory: 'users',
    title: 'APP USERS',
    description: 'Manage app users',
    headerDescription: 'Manage users who have access to your app.',
    iconBg: 'var(--red-300)',
  },
]

export function PublishPage() {
  const [activeId, setActiveId] = useState('quick-share')
  const active = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]

  return (
    <div className="publish-page">
      <SideNav items={NAV_ITEMS} activeId={activeId} onChange={setActiveId} />
      <main className="publish-page__content">
        <div className="publish-page__main">
          <PanelHeader
            icon={active.icon}
            iconCategory={active.iconCategory}
            title={active.headerTitle ?? active.title}
            description={active.headerDescription ?? active.description}
            iconBg={active.iconBg}
          />
          {activeId === 'quick-share' && <QuickSharePanel />}
        </div>
      </main>
    </div>
  )
}
