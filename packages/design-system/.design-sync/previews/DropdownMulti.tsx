import { DropdownMulti } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 18, width: 320 } as const;

const tagOptions = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
];

const channelOptions = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
];

export function Default() {
  return (
    <div style={col}>
      <DropdownMulti
        title="Categories"
        showTitle
        options={tagOptions}
        value={['design', 'engineering', 'marketing']}
      />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <DropdownMulti size="sm" options={channelOptions} value={['email', 'sms']} />
      <DropdownMulti size="md" options={channelOptions} value={['email', 'sms']} />
      <DropdownMulti size="lg" options={channelOptions} value={['email', 'sms']} />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <DropdownMulti
        title="Notification channels"
        showTitle
        status="error"
        showHelpText
        helperText="Choose at least one channel."
        options={channelOptions}
        value={[]}
        placeholder="Select channels"
      />
      <DropdownMulti
        title="Notification channels"
        showTitle
        status="readonly"
        options={channelOptions}
        value={['email', 'push']}
      />
    </div>
  );
}

export function Empty() {
  return (
    <div style={col}>
      <DropdownMulti
        title="Categories"
        showTitle
        options={tagOptions}
        value={[]}
        placeholder="Select categories"
      />
    </div>
  );
}
