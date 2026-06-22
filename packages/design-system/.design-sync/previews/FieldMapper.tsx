import { FieldMapper } from '@jf/design-system';

const frame = { width: 380 } as const;
const stack = { display: 'flex', flexDirection: 'column', gap: 12, width: 380 } as const;

// A field is bound and shown as a chip, with a trailing "+" to add another.
export function Default() {
  return (
    <div style={frame}>
      <FieldMapper
        field={{ label: 'Email Address', icon: 'envelope-closed-filled', iconCategory: 'communication' }}
        onAdd={() => {}}
      />
    </div>
  );
}

// Nothing mapped yet — empty slot with only the add affordance.
export function Unmapped() {
  return (
    <div style={frame}>
      <FieldMapper field={null} onAdd={() => {}} />
    </div>
  );
}

// Chip acts as a dropdown trigger; the selected option label is shown.
export function WithOptions() {
  const options = [
    { value: 'full_name', label: 'Full Name', icon: 'user-filled', iconCategory: 'users' },
    { value: 'email', label: 'Email Address', icon: 'envelope-closed-filled', iconCategory: 'communication' },
    { value: 'created', label: 'Created Date', icon: 'calendar-filled', iconCategory: 'time-date' },
  ];
  return (
    <div style={frame}>
      <FieldMapper
        field={{ label: 'Full Name', icon: 'user-filled', iconCategory: 'users' }}
        options={options}
        value="full_name"
        onChange={() => {}}
        onCreate={() => {}}
      />
    </div>
  );
}

// A realistic mapping panel: form fields bound to data columns.
export function MappingPanel() {
  return (
    <div style={stack}>
      <FieldMapper field={{ label: 'Customer Name', icon: 'user-filled', iconCategory: 'users' }} onAdd={() => {}} />
      <FieldMapper field={{ label: 'Order Total', icon: 'dollar-sign', iconCategory: 'finance' }} onAdd={() => {}} />
      <FieldMapper field={null} onAdd={() => {}} />
    </div>
  );
}

// Dark page background: the realistic mapping panel reused on a dark panel.
export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, width: 420 }}>
      <div style={stack}>
        <FieldMapper field={{ label: 'Customer Name', icon: 'user-filled', iconCategory: 'users' }} onAdd={() => {}} />
        <FieldMapper field={{ label: 'Order Total', icon: 'dollar-sign', iconCategory: 'finance' }} onAdd={() => {}} />
        <FieldMapper field={null} onAdd={() => {}} />
      </div>
    </div>
  );
}
