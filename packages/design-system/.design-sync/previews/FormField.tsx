import { FormField, Input, DropdownSingle } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 22, width: 360 } as const;

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

export function Default() {
  return (
    <div style={{ width: 360 }}>
      <FormField
        title="Email address"
        description="We'll send your receipt and account updates here."
        helpText="Use your work email if you have one."
        required
      >
        <Input placeholder="name@company.com" defaultValue="ava@acme.com" />
      </FormField>
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <FormField title="Full name" status="success" helpText="Looks good." showDescription={false}>
        <Input status="success" defaultValue="Ava Thompson" />
      </FormField>
      <FormField
        title="Password"
        status="error"
        helpText="Must be at least 8 characters."
        showDescription={false}
      >
        <Input status="error" type="password" defaultValue="123" />
      </FormField>
      <FormField
        title="Phone number"
        status="warning"
        helpText="Double-check the country code."
        showDescription={false}
      >
        <Input status="warning" defaultValue="+1 555 0100" />
      </FormField>
    </div>
  );
}

export function WithSelect() {
  return (
    <div style={{ width: 360 }}>
      <FormField
        title="Account role"
        description="Controls what this member can see and edit."
        helpText="You can change this later in settings."
      >
        <DropdownSingle options={roleOptions} value="admin" showLeadingIcon={false} />
      </FormField>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ width: 360 }}>
      <FormField
        title="Workspace URL"
        description="Your unique workspace address."
        helpText="Contact support to change this."
        disabled
      >
        <Input disabled defaultValue="acme.jotform.com" />
      </FormField>
    </div>
  );
}

export function Dark() {
  return (
    <div
      data-theme="dark"
      style={{
        background: 'var(--bg-fill)',
        padding: 20,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 340,
      }}
    >
      <FormField
        title="Email address"
        description="We'll send your receipt and account updates here."
        helpText="Use your work email if you have one."
        required
      >
        <Input placeholder="name@company.com" defaultValue="ava@acme.com" />
      </FormField>
      <FormField
        title="Account role"
        description="Controls what this member can see and edit."
        helpText="You can change this later in settings."
      >
        <DropdownSingle options={roleOptions} value="admin" showLeadingIcon={false} />
      </FormField>
    </div>
  );
}
