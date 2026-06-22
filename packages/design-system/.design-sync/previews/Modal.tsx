import { Modal } from '@jf/design-system';

const noop = () => {};

export function Default() {
  return (
    <Modal
      open
      onClose={noop}
      title="Publish changes?"
      description="Your edits will go live immediately and be visible to everyone with access to this workspace."
      confirmLabel="Publish"
      cancelLabel="Cancel"
    />
  );
}

export function Destructive() {
  return (
    <Modal
      open
      onClose={noop}
      intent="destructive"
      title="Delete project"
      description="This permanently removes the project and all of its data. This action cannot be undone."
      confirmLabel="Delete project"
      cancelLabel="Keep it"
    />
  );
}

export function WithContent() {
  return (
    <Modal
      open
      onClose={noop}
      title="Invite teammates"
      description="Add people to collaborate on this workspace."
      confirmLabel="Send invites"
      cancelLabel="Cancel"
      footerDescription="Invitations expire after 7 days."
    >
      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6, color: 'var(--fg-secondary)' }}>
        <li>ava@acme.com — Editor</li>
        <li>liam@acme.com — Viewer</li>
        <li>noah@acme.com — Admin</li>
      </ul>
    </Modal>
  );
}
