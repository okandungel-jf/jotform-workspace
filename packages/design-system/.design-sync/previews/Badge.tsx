import { Badge, Icon } from '@jf/design-system';

const row = { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } as const;

export function Statuses() {
  return (
    <div style={row}>
      <Badge status="success">Active</Badge>
      <Badge status="error">Failed</Badge>
      <Badge status="warning">Pending</Badge>
      <Badge status="information">In review</Badge>
      <Badge status="neutral">Draft</Badge>
    </div>
  );
}

export function Emphasis() {
  return (
    <div style={row}>
      <Badge status="success" emphasis="subtle">Subtle</Badge>
      <Badge status="success" emphasis="bold">Bold</Badge>
      <Badge status="success" emphasis="outlined">Outlined</Badge>
      <Badge status="information" emphasis="bold">Published</Badge>
      <Badge status="error" emphasis="outlined">Overdue</Badge>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={row}>
      <Badge status="information" size="sm">Small</Badge>
      <Badge status="information" size="md">Medium</Badge>
      <Badge status="information" size="lg">Large</Badge>
    </div>
  );
}

export function Shapes() {
  return (
    <div style={row}>
      <Badge status="warning" shape="rounded">Rounded</Badge>
      <Badge status="warning" shape="rectangle">Rectangle</Badge>
      <Badge status="neutral" shape="rectangle" emphasis="outlined">v2.4.0</Badge>
    </div>
  );
}

export function WithIcons() {
  return (
    <div style={row}>
      <Badge status="success" icon={<Icon name="check-sm" size={12} />}>Verified</Badge>
      <Badge status="information" emphasis="bold" icon={<Icon name="star-filled" size={12} />}>Featured</Badge>
      <Badge status="error" emphasis="outlined" icon={<Icon name="xmark-sm" size={12} />}>Rejected</Badge>
    </div>
  );
}
