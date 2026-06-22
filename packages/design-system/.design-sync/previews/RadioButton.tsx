import { RadioButton } from '@jf/design-system';

const group = { display: 'grid', gap: 10 } as const;

export function Group() {
  return (
    <div style={group}>
      <RadioButton name="plan" label="Free" />
      <RadioButton name="plan" label="Pro — $12 / month" defaultChecked />
      <RadioButton name="plan" label="Enterprise" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={group}>
      <RadioButton name="size-sm" size="sm" label="Small" defaultChecked />
      <RadioButton name="size-md" size="md" label="Medium" defaultChecked />
      <RadioButton name="size-lg" size="lg" label="Large" defaultChecked />
    </div>
  );
}

export function WithDescriptions() {
  return (
    <div style={group}>
      <RadioButton
        name="ship"
        label="Standard shipping"
        description="Arrives in 5–7 business days. Free."
        showDescription
        defaultChecked
      />
      <RadioButton
        name="ship"
        label="Express shipping"
        description="Arrives in 1–2 business days. $9.99."
        showDescription
      />
    </div>
  );
}

export function States() {
  return (
    <div style={group}>
      <RadioButton name="a" label="Selected" defaultChecked />
      <RadioButton name="b" label="Unselected" />
      <RadioButton name="c" label="Disabled option" disabled />
      <RadioButton name="d" label="Invalid choice" error />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg-fill)', padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <RadioButton name="dark-plan" label="Pro — $12 / month" defaultChecked />
      <RadioButton name="dark-plan" label="Free" />
      <RadioButton name="dark-plan2" label="Disabled option" disabled />
      <RadioButton name="dark-plan3" label="Invalid choice" error />
    </div>
  );
}
