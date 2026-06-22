import { Link, Icon } from '@jf/design-system';

const row = { display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' } as const;

export function ColorSchemes() {
  return (
    <div style={row}>
      <Link href="#" colorScheme="primary">View documentation</Link>
      <Link href="#" colorScheme="constructive">Approve request</Link>
      <Link href="#" colorScheme="destructive">Delete account</Link>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={row}>
      <Link href="#" size="sm">Small link</Link>
      <Link href="#" size="lg">Large link</Link>
    </div>
  );
}

export function WithIcons() {
  return (
    <div style={row}>
      <Link href="#" leftIcon={<Icon name="link-diagonal" size={16} />}>Copy link</Link>
      <Link href="#" rightIcon={<Icon name="magnifying-glass" size={16} />}>Search results</Link>
      <Link href="#" colorScheme="constructive" leftIcon={<Icon name="check" size={16} />}>Mark complete</Link>
    </div>
  );
}

export function States() {
  return (
    <div style={row}>
      <Link href="#" colorScheme="primary">Settings</Link>
      <Link href="#" colorScheme="primary" disabled>Unavailable</Link>
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <Link href="#" colorScheme="primary">View documentation</Link>
      <Link href="#" colorScheme="constructive">Approve request</Link>
      <Link href="#" colorScheme="destructive">Delete account</Link>
      <Link href="#" leftIcon={<Icon name="link-diagonal" size={16} />}>Copy link</Link>
      <Link href="#" colorScheme="primary" disabled>Unavailable</Link>
    </div>
  );
}
