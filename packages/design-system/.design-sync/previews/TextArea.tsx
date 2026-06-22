import { TextArea } from '@jf/design-system';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: 380 } as const;
const one = { width: 380 } as const;

export function Default() {
  return (
    <div style={one}>
      <TextArea
        size="lg"
        defaultValue="Thanks for the quick turnaround on the latest mockups — the team is thrilled with the new dashboard layout."
        maxLength={300}
      />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={col}>
      <TextArea size="md" defaultValue="Add a short note for your teammates." maxLength={150} />
      <TextArea
        size="lg"
        defaultValue="Add a detailed description, including any acceptance criteria for this task."
        maxLength={300}
      />
    </div>
  );
}

export function Statuses() {
  return (
    <div style={col}>
      <TextArea
        status="error"
        defaultValue="Please keep your feedback under the character limit."
        maxLength={300}
      />
      <TextArea
        status="readonly"
        defaultValue="This response was submitted on May 3 and can no longer be edited."
        readOnly
        maxLength={300}
      />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={one}>
      <TextArea disabled defaultValue="Comments are closed for this ticket." maxLength={300} />
    </div>
  );
}
