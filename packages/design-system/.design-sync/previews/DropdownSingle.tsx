import { DropdownSingle } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 18, width: 300 } as const;

const dot = (color: string) => (
  <span
    style={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: color,
      display: 'inline-block',
    }}
  />
);

const statusOptions = [
  { value: 'active', label: 'Active', leading: dot('#2bb673') },
  { value: 'draft', label: 'Draft', leading: dot('#f5a623') },
  { value: 'archived', label: 'Archived', leading: dot('#9aa4b2') },
];

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
];

const planOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
];

const memberOptions = [
  { value: 'ava', label: 'Ava Thompson' },
  { value: 'liam', label: 'Liam Carter' },
  { value: 'noah', label: 'Noah Bennett' },
];

export function Default() {
  return (
    <div style={col}>
      <DropdownSingle title="Status" showTitle options={statusOptions} value="active" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <DropdownSingle size="sm" options={sortOptions} value="newest" showLeadingIcon={false} />
      <DropdownSingle size="md" options={sortOptions} value="newest" showLeadingIcon={false} />
      <DropdownSingle size="lg" options={sortOptions} value="newest" showLeadingIcon={false} />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <DropdownSingle
        title="Subscription plan"
        showTitle
        options={planOptions}
        value="gold"
        showLeadingIcon={false}
      />
      <DropdownSingle
        title="Subscription plan"
        showTitle
        status="error"
        showHelpText
        helperText="Please select a plan to continue."
        options={planOptions}
        placeholder="Choose a plan"
        showLeadingIcon={false}
      />
      <DropdownSingle
        title="Subscription plan"
        showTitle
        status="readonly"
        options={planOptions}
        value="silver"
        showLeadingIcon={false}
      />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={col}>
      <DropdownSingle
        title="Assignee"
        showTitle
        disabled
        options={memberOptions}
        value="ava"
        showLeadingIcon={false}
      />
    </div>
  );
}

export function Dark() {
  return (
    <div
      data-theme="dark"
      style={{
        background: 'var(--bg-fill)',
        padding: 20,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 340,
      }}
    >
      <DropdownSingle title="Status" showTitle options={statusOptions} value="active" />
      <DropdownSingle
        title="Subscription plan"
        showTitle
        options={planOptions}
        value="gold"
        showLeadingIcon={false}
      />
      <DropdownSingle title="Assignee" showTitle options={memberOptions} value="ava" showLeadingIcon={false} />
    </div>
  );
}
