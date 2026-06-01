import { useState } from 'react'
import {
  Icon,
  Input as DSInput,
  Toggle as DSToggle,
  FormField as DSFormField,
  Tabs as DSTabs,
} from '@jf/design-system'
import { IconPropertyField } from './IconPropertyField'
import { DEFAULT_PAGE_ICON } from './PageNavigationBar'

export interface PagePropertiesPage {
  id: string
  name: string
  icon?: string
  hidden?: boolean
  requireLogin?: boolean
  showIcon?: boolean
}

interface PagePropertiesPanelProps {
  page: PagePropertiesPage
  onRename: (name: string) => void
  onChangeIcon: (icon: string) => void
  onToggleHidden: (hidden: boolean) => void
  onToggleRequireLogin: (require: boolean) => void
  onToggleShowIcon: (show: boolean) => void
  onClose: () => void
}

export function PagePropertiesPanel({
  page,
  onRename,
  onChangeIcon,
  onToggleHidden,
  onToggleRequireLogin,
  onToggleShowIcon,
  onClose,
}: PagePropertiesPanelProps) {
  const [tab, setTab] = useState('general')
  const showIcon = page.showIcon !== false

  return (
    <div className="build-page__properties" data-theme="dark">
      <div className="property-panel__header">
        <span className="property-panel__title">Page Properties</span>
        <div className="property-panel__header-actions">
          <button className="property-panel__close" onClick={onClose} aria-label="Close">
            <Icon name="xmark" size={20} />
          </button>
        </div>
      </div>

      <div className="property-panel__tabs">
        <DSTabs
          accent="apps"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'general', label: 'General' },
            { value: 'condition', label: 'Condition' },
          ]}
        />
      </div>

      {tab === 'general' && (
        <div className="property-panel__body">
          <div className="property-panel__field">
            <DSFormField title="Page Name" size="md" showDescription={false} showHelpText={false}>
              <DSInput
                value={page.name}
                placeholder="Page name"
                onChange={(e) => onRename(e.target.value)}
              />
            </DSFormField>
          </div>

          <div className="property-panel__field property-panel__field--inline">
            <DSFormField
              title="Require Login"
              description="Users need to log in to access this page."
              size="md"
              showDescription
              showHelpText={false}
            >
              <DSToggle
                size="md"
                checked={Boolean(page.requireLogin)}
                onChange={(e) => onToggleRequireLogin(e.target.checked)}
              />
            </DSFormField>
          </div>

          <div className="property-panel__field property-panel__field--inline">
            <DSFormField
              title="Show Page on Navigation"
              description="Set visibility of the page in the navigation."
              size="md"
              showDescription
              showHelpText={false}
            >
              <DSToggle
                size="md"
                checked={!page.hidden}
                onChange={(e) => onToggleHidden(!e.target.checked)}
              />
            </DSFormField>
          </div>

          <div className="property-panel__field">
            <div className="property-panel__field--inline">
              <DSFormField title="Show Icon" size="md" showDescription={false} showHelpText={false}>
                <DSToggle
                  size="md"
                  checked={showIcon}
                  onChange={(e) => onToggleShowIcon(e.target.checked)}
                />
              </DSFormField>
            </div>
            {showIcon && (
              <IconPropertyField
                value={page.icon || DEFAULT_PAGE_ICON}
                onChange={onChangeIcon}
              />
            )}
          </div>
        </div>
      )}

      {tab === 'condition' && (
        <div className="property-panel__body">
          <div className="page-properties__condition-empty">
            <Icon name="conditional-branch-filled" category="general" size={32} />
            <p className="page-properties__condition-title">No conditions yet</p>
            <p className="page-properties__condition-text">
              Conditional visibility rules for this page will appear here.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
