import { DateInput } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: 220 } as const;
const one = { width: 220 } as const;

export function Default() {
  return (
    <div style={one}>
      <DateInput />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <DateInput size="sm" />
      <DateInput size="md" />
      <DateInput size="lg" />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <DateInput status="error" />
      <DateInput status="success" />
      <DateInput status="warning" />
    </div>
  );
}

export function States() {
  return (
    <div style={col}>
      <DateInput readOnly />
      <DateInput disabled />
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
        gap: 14,
        width: 320,
      }}
    >
      <DateInput />
      <DateInput status="success" />
      <DateInput status="error" />
      <DateInput readOnly />
    </div>
  );
}
