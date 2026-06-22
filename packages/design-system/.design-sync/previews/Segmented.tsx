import { Segmented } from '@jf/design-system';

const noop = () => {};
const wrap = { display: 'grid', gap: 14, width: 320 } as const;

export function Default() {
  return (
    <div style={wrap}>
      <Segmented
        value="weekly"
        onChange={noop}
        items={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]}
      />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={wrap}>
      <Segmented
        size="sm"
        value="all"
        onChange={noop}
        items={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
      <Segmented
        size="md"
        value="active"
        onChange={noop}
        items={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
    </div>
  );
}

export function IconText() {
  return (
    <div style={wrap}>
      <Segmented
        variant="iconText"
        value="grid"
        onChange={noop}
        items={[
          { value: 'grid', label: 'Grid', icon: 'grid-dots' },
          { value: 'table', label: 'Table', icon: 'table' },
        ]}
      />
    </div>
  );
}

export function IconOnly() {
  return (
    <div style={{ width: 160 }}>
      <Segmented
        variant="icon"
        value="grid"
        onChange={noop}
        items={[
          { value: 'grid', icon: 'grid-dots', ariaLabel: 'Grid view' },
          { value: 'table', icon: 'table', ariaLabel: 'Table view' },
          { value: 'text', icon: 'text', ariaLabel: 'Text view' },
        ]}
      />
    </div>
  );
}

export function Accent() {
  return (
    <div style={wrap}>
      <Segmented
        accent="default"
        value="overview"
        onChange={noop}
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'details', label: 'Details' },
        ]}
      />
      <Segmented
        accent="apps"
        value="details"
        onChange={noop}
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'details', label: 'Details' },
        ]}
      />
    </div>
  );
}
