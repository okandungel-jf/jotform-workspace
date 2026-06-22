import { Table, Badge } from '@jf/design-system';

type Person = { id: number; name: string; email: string; role: string; status: 'active' | 'invited' | 'inactive' };

const data: Person[] = [
  { id: 1, name: 'Ava Thompson', email: 'ava@acme.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Liam Carter', email: 'liam@acme.com', role: 'Editor', status: 'invited' },
  { id: 3, name: 'Noah Bennett', email: 'noah@acme.com', role: 'Viewer', status: 'active' },
  { id: 4, name: 'Mia Foster', email: 'mia@acme.com', role: 'Editor', status: 'inactive' },
];

const statusBadge = (s: Person['status']) =>
  s === 'active' ? <Badge status="success" emphasis="subtle">Active</Badge>
  : s === 'invited' ? <Badge status="information" emphasis="subtle">Invited</Badge>
  : <Badge status="neutral" emphasis="subtle">Inactive</Badge>;

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status', align: 'right' as const, render: (r: Person) => statusBadge(r.status) },
];

const rowKey = (r: Person) => r.id;

export function Basic() {
  return <Table columns={columns} data={data} rowKey={rowKey} sort={{ key: 'name', direction: 'asc' }} />;
}

export function Selectable() {
  return <Table columns={columns} data={data} rowKey={rowKey} selectable selectedRowKeys={[1, 3]} />;
}

export function Loading() {
  return <Table columns={columns} data={[]} loading loadingVariant="skeleton" skeletonRows={4} />;
}
