import { DropdownLanguage } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 18, width: 300 } as const;

const langOptions = [
  { value: 'en', label: 'English (US)', countryCode: 'us' },
  { value: 'tr', label: 'Türkçe', countryCode: 'tr' },
  { value: 'fr', label: 'Français', countryCode: 'fr' },
  { value: 'es', label: 'Español', countryCode: 'es' },
  { value: 'de', label: 'Deutsch', countryCode: 'de' },
];

export function Default() {
  return (
    <div style={col}>
      <DropdownLanguage title="Language" showTitle options={langOptions} value="en" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <DropdownLanguage size="sm" options={langOptions} value="fr" />
      <DropdownLanguage size="md" options={langOptions} value="fr" />
      <DropdownLanguage size="lg" options={langOptions} value="fr" />
    </div>
  );
}

export function Languages() {
  return (
    <div style={col}>
      <DropdownLanguage options={langOptions} value="tr" />
      <DropdownLanguage options={langOptions} value="es" />
      <DropdownLanguage options={langOptions} value="de" />
    </div>
  );
}

export function Placeholder() {
  return (
    <div style={col}>
      <DropdownLanguage title="Language" showTitle options={langOptions} placeholder="Select a language" />
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
      <DropdownLanguage title="Language" showTitle options={langOptions} value="en" />
      <DropdownLanguage options={langOptions} value="tr" />
      <DropdownLanguage options={langOptions} value="de" />
    </div>
  );
}
