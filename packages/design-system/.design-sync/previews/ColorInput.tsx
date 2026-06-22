import { ColorInput } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: 220 } as const;
const one = { width: 220 } as const;

export function Default() {
  return (
    <div style={one}>
      <ColorInput color="#FF6100" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <ColorInput size="sm" color="#0A1551" />
      <ColorInput size="md" color="#0A1551" />
      <ColorInput size="lg" color="#0A1551" />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <ColorInput status="error" color="#E11D48" />
      <ColorInput status="success" color="#22C55E" />
      <ColorInput status="warning" color="#F59E0B" />
    </div>
  );
}

export function Swatches() {
  return (
    <div style={col}>
      <ColorInput color="#FF6100" />
      <ColorInput color="#0075E3" />
      <ColorInput color="#9333EA" />
      <ColorInput color="#10B981" />
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
      <ColorInput color="#FF6100" />
      <ColorInput color="#0075E3" />
      <ColorInput status="success" color="#22C55E" />
      <ColorInput status="error" color="#E11D48" />
    </div>
  );
}
