import { Input, Icon } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 14, width: 320 } as const;
const one = { width: 320 } as const;

export function Default() {
  return (
    <div style={one}>
      <Input
        type="email"
        defaultValue="jordan@company.com"
        leftContent={<Icon name="envelope-closed-filled" category="communication" size={18} />}
      />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <Input size="sm" defaultValue="Acme Inc." placeholder="Company name" />
      <Input size="md" defaultValue="Acme Inc." placeholder="Company name" />
      <Input size="lg" defaultValue="Acme Inc." placeholder="Company name" />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <Input
        status="error"
        defaultValue="jordan@compny"
        rightContent={<Icon name="exclamation-circle-filled" size={18} />}
      />
      <Input
        status="success"
        defaultValue="jordan@company.com"
        rightContent={<Icon name="check-circle-filled" size={18} />}
      />
      <Input status="warning" defaultValue="jordan@company" />
    </div>
  );
}

export function WithContent() {
  return (
    <div style={col}>
      <Input placeholder="Search projects" leftContent={<Icon name="magnifying-glass" size={18} />} />
      <Input
        type="password"
        defaultValue="hunter2pass"
        leftContent={<Icon name="lock-filled" category="security" size={18} />}
        rightContent={<Icon name="eye-filled" size={18} />}
      />
    </div>
  );
}

export function States() {
  return (
    <div style={col}>
      <Input defaultValue="jordan@company.com" readOnly />
      <Input defaultValue="Locked field" disabled />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ ...col, background: 'var(--bg-fill)', padding: 20, borderRadius: 12 }}>
      <Input defaultValue="jordan@company.com" leftContent={<Icon name="envelope-closed-filled" category="communication" size={18} />} />
      <Input status="error" defaultValue="jordan@compny" rightContent={<Icon name="exclamation-circle-filled" size={18} />} />
      <Input placeholder="Search projects" leftContent={<Icon name="magnifying-glass" size={18} />} />
      <Input defaultValue="Locked field" disabled />
    </div>
  );
}
