import { Tabs } from '@jf/design-system';

const noop = () => {};

export function Default() {
  return (
    <Tabs
      value="activity"
      onChange={noop}
      items={[
        { value: 'overview', label: 'Overview' },
        { value: 'activity', label: 'Activity' },
        { value: 'members', label: 'Members' },
        { value: 'settings', label: 'Settings' },
      ]}
    />
  );
}

export function WithIcons() {
  return (
    <Tabs
      value="reports"
      onChange={noop}
      items={[
        { value: 'home', label: 'Home', icon: 'house-filled' },
        { value: 'reports', label: 'Reports', icon: 'chart-line' },
        { value: 'config', label: 'Settings', icon: 'gear-filled' },
      ]}
    />
  );
}

export function Small() {
  return (
    <Tabs
      size="sm"
      value="all"
      onChange={noop}
      items={[
        { value: 'all', label: 'All' },
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
        { value: 'archived', label: 'Archived', disabled: true },
      ]}
    />
  );
}

export function AppsAccent() {
  return (
    <Tabs
      accent="apps"
      value="design"
      onChange={noop}
      items={[
        { value: 'build', label: 'Build' },
        { value: 'design', label: 'Design' },
        { value: 'publish', label: 'Publish' },
      ]}
    />
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <Tabs
        value="activity"
        onChange={noop}
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' },
          { value: 'members', label: 'Members' },
          { value: 'settings', label: 'Settings' },
        ]}
      />
    </div>
  );
}
