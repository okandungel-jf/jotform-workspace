import { NumberInput } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: 220 } as const;
const one = { width: 240 } as const;

export function Default() {
  return (
    <div style={one}>
      <NumberInput value={24} unit="kg" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <NumberInput size="sm" value={8} unit="pcs" />
      <NumberInput size="md" value={16} unit="pcs" />
      <NumberInput size="lg" value={32} unit="pcs" />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <NumberInput status="error" value={999} unit="kg" />
      <NumberInput status="success" value={42} unit="kg" />
      <NumberInput status="warning" value={5} unit="kg" />
    </div>
  );
}

export function Units() {
  return (
    <div style={col}>
      <NumberInput value={1280} unit="px" />
      <NumberInput value={75} unit="%" />
      <NumberInput value={250} showUnit={false} />
    </div>
  );
}

export function WithDescription() {
  return (
    <div style={{ width: 260 }}>
      <NumberInput value={12} unit="kg" description="Maximum package weight per box" />
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
      <NumberInput value={24} unit="kg" />
      <NumberInput status="error" value={999} unit="kg" />
      <NumberInput status="success" value={42} unit="kg" />
      <NumberInput value={12} unit="kg" description="Maximum package weight per box" />
    </div>
  );
}
