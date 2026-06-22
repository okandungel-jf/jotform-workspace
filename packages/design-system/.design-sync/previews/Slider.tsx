import { Slider } from '@jf/design-system';

const noop = () => {};
const wrap = { display: 'grid', gap: 18, width: 280 } as const;

export function Default() {
  return (
    <div style={wrap}>
      <Slider value={60} onChange={noop} showValue />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={wrap}>
      <Slider size="sm" value={30} onChange={noop} />
      <Slider size="md" value={55} onChange={noop} />
      <Slider size="lg" value={80} onChange={noop} />
    </div>
  );
}

export function WithValue() {
  return (
    <div style={wrap}>
      <Slider
        value={72}
        min={0}
        max={100}
        onChange={noop}
        showValue
        formatValue={(v) => `${v}%`}
      />
    </div>
  );
}

export function States() {
  return (
    <div style={wrap}>
      <Slider value={45} onChange={noop} showValue />
      <Slider value={65} onChange={noop} error showValue />
      <Slider value={50} onChange={noop} disabled showValue />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 18, width: 280 }}>
      <Slider value={60} onChange={noop} showValue />
      <Slider value={72} min={0} max={100} onChange={noop} showValue formatValue={(v) => `${v}%`} />
      <Slider value={65} onChange={noop} error showValue />
      <Slider value={50} onChange={noop} disabled showValue />
    </div>
  );
}
