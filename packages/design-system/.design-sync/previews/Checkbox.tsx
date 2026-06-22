import { Checkbox } from '@jf/design-system';

const group = { display: 'grid', gap: 10 } as const;

export function Group() {
  return (
    <div style={group}>
      <Checkbox label="Email me about product updates" defaultChecked />
      <Checkbox label="Send a weekly activity summary" defaultChecked />
      <Checkbox label="Notify me about new comments" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={group}>
      <Checkbox size="sm" label="Small checkbox" defaultChecked />
      <Checkbox size="md" label="Medium checkbox" defaultChecked />
      <Checkbox size="lg" label="Large checkbox" defaultChecked />
    </div>
  );
}

export function WithDescriptions() {
  return (
    <div style={group}>
      <Checkbox
        label="Marketing emails"
        description="News, product tips, and special offers."
        showDescription
        defaultChecked
      />
      <Checkbox
        label="Reminders"
        description="Get nudged about unfinished forms."
        showDescription
      />
    </div>
  );
}

export function States() {
  return (
    <div style={group}>
      <Checkbox label="Selected" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled option" disabled />
      <Checkbox label="Required field is invalid" error defaultChecked />
    </div>
  );
}
