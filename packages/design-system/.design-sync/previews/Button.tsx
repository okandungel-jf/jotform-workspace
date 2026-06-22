import { Button, Icon } from '@jf/design-system';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

export function Colors() {
  return (
    <div style={row}>
      <Button variant="filled" colorScheme="primary">Primary</Button>
      <Button variant="filled" colorScheme="secondary">Secondary</Button>
      <Button variant="filled" colorScheme="constructive">Save changes</Button>
      <Button variant="filled" colorScheme="destructive">Delete</Button>
    </div>
  );
}

export function Variants() {
  return (
    <div style={row}>
      <Button variant="filled" colorScheme="primary">Filled</Button>
      <Button variant="ghost" colorScheme="primary">Ghost</Button>
      <Button variant="transparent" colorScheme="primary">Transparent</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={row}>
      <Button size="sm" colorScheme="primary">Small</Button>
      <Button size="md" colorScheme="primary">Medium</Button>
      <Button size="lg" colorScheme="primary">Large</Button>
    </div>
  );
}

export function WithIcons() {
  return (
    <div style={row}>
      <Button colorScheme="primary" leftIcon={<Icon name="plus" size={16} />}>New item</Button>
      <Button variant="ghost" colorScheme="primary" rightIcon={<Icon name="magnifying-glass" size={16} />}>Search</Button>
      <Button colorScheme="primary" iconOnly leftIcon={<Icon name="check" size={18} />} aria-label="Confirm" />
    </div>
  );
}

export function States() {
  return (
    <div style={row}>
      <Button colorScheme="primary" loading loadingText="Saving…">Save</Button>
      <Button colorScheme="primary" disabled>Disabled</Button>
      <Button variant="ghost" colorScheme="destructive" leftIcon={<Icon name="trash-filled" size={16} />}>Remove</Button>
    </div>
  );
}
