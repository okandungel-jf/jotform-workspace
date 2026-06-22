import { Toggle } from '@jf/design-system';

const group = { display: 'grid', gap: 14 } as const;

export function Default() {
  return (
    <div style={group}>
      <Toggle
        label="Push notifications"
        description="Receive alerts on this device."
        defaultChecked
      />
      <Toggle
        label="Auto-sync"
        description="Keep your data up to date across devices."
      />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <Toggle size="sm" defaultChecked />
      <Toggle size="md" defaultChecked />
      <Toggle size="lg" defaultChecked />
    </div>
  );
}

export function States() {
  return (
    <div style={group}>
      <Toggle label="Enabled" defaultChecked />
      <Toggle label="Off" />
      <Toggle label="Disabled" disabled defaultChecked />
      <Toggle label="Saving changes…" loading defaultChecked />
    </div>
  );
}

export function ErrorState() {
  return (
    <div style={group}>
      <Toggle
        label="Two-factor authentication"
        description="This setting is required by your organization."
        error
      />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle
        label="Push notifications"
        description="Receive alerts on this device."
        defaultChecked
      />
      <Toggle label="Auto-sync" description="Keep your data up to date across devices." />
      <Toggle label="Disabled" disabled defaultChecked />
    </div>
  );
}
