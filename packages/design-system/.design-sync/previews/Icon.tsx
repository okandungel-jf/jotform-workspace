import { Icon } from '@jf/design-system';

const grid = { display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', color: 'var(--fg-primary)' } as const;

export function Common() {
  const names = ['star-filled', 'heart', 'check', 'magnifying-glass', 'gear-filled', 'trash-filled', 'plus', 'at', 'anchor', 'ban'];
  return <div style={grid}>{names.map((n) => <Icon key={n} name={n} size={28} />)}</div>;
}

export function Sizes() {
  return (
    <div style={{ ...grid, alignItems: 'flex-end' }}>
      {[16, 24, 32, 48].map((s) => <Icon key={s} name="heart" size={s} />)}
    </div>
  );
}

export function Categories() {
  const items: Array<[string, string]> = [
    ['general', 'star-filled'],
    ['arrows', 'angle-right'],
    ['users', 'face-smile'],
    ['finance', 'briefcase-filled'],
    ['time-date', 'alarm-clock-filled'],
    ['media', 'bolt-filled'],
    ['brands', 'apple-filled'],
  ];
  return <div style={grid}>{items.map(([c, n]) => <Icon key={c + n} name={n} category={c} size={28} />)}</div>;
}

export function Colored() {
  const colors = ['var(--fg-brand)', 'var(--fg-success)', 'var(--fg-error)', 'var(--fg-secondary)'];
  return (
    <div style={grid}>
      {colors.map((col, i) => (
        <span key={i} style={{ color: col, display: 'inline-flex' }}><Icon name="star-filled" size={32} /></span>
      ))}
    </div>
  );
}
