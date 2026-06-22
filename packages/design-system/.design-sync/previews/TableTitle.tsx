import { TableTitle, Badge, Icon } from '@jf/design-system';

// Canonical small header: icon block + title + subtitle.
export function Default() {
  return (
    <TableTitle
      icon="table"
      title="Customer Orders"
      subtitle="1,248 records · synced 2 min ago"
    />
  );
}

// Large size with a status Badge alongside the title.
export function WithBadge() {
  return (
    <TableTitle
      size="md"
      icon="user-filled"
      iconCategory="users"
      title="Team Members"
      subtitle="Active workspace seats"
      badge={<Badge status="success" emphasis="subtle">Live</Badge>}
    />
  );
}

// Custom leading node instead of the default icon block.
export function CustomLeading() {
  return (
    <TableTitle
      size="md"
      title="Revenue Report"
      subtitle="Q2 2026 · all regions"
      leading={
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6C63FF, #00A4FF)',
            color: '#fff',
          }}
        >
          <Icon name="dollar-sign" category="finance" size={22} />
        </div>
      }
      badge={<Badge status="information" emphasis="subtle">Updated</Badge>}
    />
  );
}

// Title only, no leading or subtitle.
export function TitleOnly() {
  return <TableTitle title="Submissions" badge={<Badge status="neutral" emphasis="subtle">42</Badge>} />;
}
