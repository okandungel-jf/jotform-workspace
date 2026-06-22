import { Indicator } from '@jf/design-system';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

export function Colors() {
  return (
    <div style={row}>
      <Indicator style="color" status="information">8</Indicator>
      <Indicator style="color" status="success">3</Indicator>
      <Indicator style="color" status="error">12</Indicator>
      <Indicator style="color" status="neutral">99+</Indicator>
    </div>
  );
}

export function Dots() {
  return (
    <div style={row}>
      <Indicator style="dot" status="information" />
      <Indicator style="dot" status="success" />
      <Indicator style="dot" status="error" />
      <Indicator style="dot" status="neutral" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={row}>
      <Indicator style="color" status="error" size="sm">5</Indicator>
      <Indicator style="color" status="error" size="md">5</Indicator>
      <Indicator style="color" status="error" size="lg">5</Indicator>
    </div>
  );
}

export function Light() {
  return (
    <div style={{ ...row, background: '#2b2f38', padding: 12, borderRadius: 8 }}>
      <Indicator style="light" status="information">7</Indicator>
      <Indicator style="light" status="success">2</Indicator>
      <Indicator style="light" status="error">9</Indicator>
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <Indicator style="color" status="information">8</Indicator>
      <Indicator style="color" status="success">3</Indicator>
      <Indicator style="color" status="error">12</Indicator>
      <Indicator style="dot" status="error" />
      <Indicator style="light" status="information">7</Indicator>
      <Indicator style="light" status="success">2</Indicator>
    </div>
  );
}
