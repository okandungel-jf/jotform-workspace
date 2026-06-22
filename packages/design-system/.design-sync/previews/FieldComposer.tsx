import { FieldComposer } from '@jf/design-system';

// Field options that populate the "+" insert menu. Inline chip icons only render
// for the two embedded keys (editor/type-square-filled, forms-files/paperclip-diagonal).
const options = [
  { value: 'first_name', label: 'First Name', icon: 'type-square-filled', iconCategory: 'editor' },
  { value: 'order_id', label: 'Order ID', icon: 'type-square-filled', iconCategory: 'editor' },
  { value: 'invoice', label: 'Invoice PDF', icon: 'paperclip-diagonal', iconCategory: 'forms-files' },
  { value: 'ship_date', label: 'Ship Date', icon: 'type-square-filled', iconCategory: 'editor' },
];

const frame = { width: 480 } as const;

export function Default() {
  const value = [
    { type: 'text', value: 'Hi ' },
    { type: 'field', value: 'first_name', label: 'First Name', icon: 'type-square-filled', iconCategory: 'editor' },
    { type: 'text', value: ', your order ' },
    { type: 'field', value: 'order_id', label: 'Order ID', icon: 'type-square-filled', iconCategory: 'editor' },
    { type: 'text', value: ' has shipped.' },
  ];
  return (
    <div style={frame}>
      <FieldComposer value={value} options={options} onCreate={() => {}} createLabel="Create field" />
    </div>
  );
}

export function Empty() {
  return (
    <div style={frame}>
      <FieldComposer value={[]} options={options} placeholder="Type a message or insert a field…" onCreate={() => {}} />
    </div>
  );
}

export function FieldHeavy() {
  const value = [
    { type: 'field', value: 'first_name', label: 'First Name', icon: 'type-square-filled', iconCategory: 'editor' },
    { type: 'text', value: '_' },
    { type: 'field', value: 'order_id', label: 'Order ID', icon: 'type-square-filled', iconCategory: 'editor' },
    { type: 'text', value: ' — ' },
    { type: 'field', value: 'invoice', label: 'Invoice PDF', icon: 'paperclip-diagonal', iconCategory: 'forms-files' },
  ];
  return (
    <div style={frame}>
      <FieldComposer value={value} options={options} onCreate={() => {}} />
    </div>
  );
}

// Dark page background: the composer reusing the Default template, on a dark panel.
export function Dark() {
  const value = [
    { type: 'text', value: 'Hi ' },
    { type: 'field', value: 'first_name', label: 'First Name', icon: 'type-square-filled', iconCategory: 'editor' },
    { type: 'text', value: ', your order ' },
    { type: 'field', value: 'order_id', label: 'Order ID', icon: 'type-square-filled', iconCategory: 'editor' },
    { type: 'text', value: ' has shipped.' },
  ];
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, width: 520 }}>
      <div style={frame}>
        <FieldComposer value={value} options={options} onCreate={() => {}} createLabel="Create field" />
      </div>
    </div>
  );
}
