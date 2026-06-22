import { UrlInput } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: 380 } as const;
const one = { width: 380 } as const;

export function Default() {
  return (
    <div style={one}>
      <UrlInput defaultValue="acme.com/pricing" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <UrlInput size="sm" defaultValue="acme.com" />
      <UrlInput size="md" defaultValue="acme.com" />
      <UrlInput size="lg" defaultValue="acme.com" />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <UrlInput status="error" defaultValue="not a valid url" />
      <UrlInput status="success" defaultValue="acme.com/welcome" />
      <UrlInput status="readonly" defaultValue="acme.com/shared/report" readOnly />
    </div>
  );
}

export function Variations() {
  return (
    <div style={col}>
      <UrlInput urlPrefix="jotform.com/" defaultValue="contact-form" />
      <UrlInput urlPrefix="http://" defaultValue="legacy.acme.com" showCopyButton={false} />
    </div>
  );
}
