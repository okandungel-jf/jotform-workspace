import { FieldChip } from '@jf/design-system';

const row = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
  maxWidth: 360,
} as const;

export function Default() {
  return <FieldChip icon="user-filled" iconCategory="users" label="Full Name" />;
}

export function FieldTypes() {
  return (
    <div style={row}>
      <FieldChip icon="user-filled" iconCategory="users" label="Full Name" />
      <FieldChip icon="envelope-closed-filled" iconCategory="communication" label="Email" />
      <FieldChip icon="calendar" iconCategory="time-date" label="Order Date" />
      <FieldChip icon="dollar-sign" iconCategory="finance" label="Total Amount" />
      <FieldChip icon="hashtag" iconCategory="general" label="Quantity" />
    </div>
  );
}

export function Clickable() {
  return (
    <div style={row}>
      <FieldChip icon="tag" iconCategory="finance" label="Category" onClick={() => {}} />
      <FieldChip
        icon="location-pin-filled"
        iconCategory="general"
        label="Shipping Address"
        onClick={() => {}}
      />
    </div>
  );
}

export function NoIcon() {
  return (
    <div style={row}>
      <FieldChip label="First Name" />
      <FieldChip label="Last Name" />
      <FieldChip label="Submission ID" />
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
      <div style={row}>
        <FieldChip icon="user-filled" iconCategory="users" label="Full Name" />
        <FieldChip icon="envelope-closed-filled" iconCategory="communication" label="Email" />
        <FieldChip icon="calendar" iconCategory="time-date" label="Order Date" />
      </div>
      <div style={row}>
        <FieldChip icon="tag" iconCategory="finance" label="Category" onClick={() => {}} />
        <FieldChip label="Submission ID" />
      </div>
    </div>
  );
}
