import { SearchInput } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 12, width: 320 } as const;

export function Default() {
  return (
    <div style={{ width: 320 }}>
      <SearchInput placeholder="Search submissions…" readOnly />
    </div>
  );
}

export function WithValue() {
  return (
    <div style={{ width: 320 }}>
      <SearchInput value="Quarterly report" placeholder="Search…" readOnly />
    </div>
  );
}

export function WithFilter() {
  return (
    <div style={{ width: 360 }}>
      <SearchInput placeholder="Search forms" showFilter readOnly />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <SearchInput size="sm" placeholder="Small" readOnly />
      <SearchInput size="md" placeholder="Medium" readOnly />
      <SearchInput size="lg" placeholder="Large" readOnly />
    </div>
  );
}
