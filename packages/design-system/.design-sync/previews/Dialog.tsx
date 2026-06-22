import { Dialog, Button } from '@jf/design-system';

const noop = () => {};

export function Informative() {
  return (
    <Dialog
      open
      onClose={noop}
      style="informative"
      title="Changes saved"
      description="Your changes have been saved and are now live for everyone with access."
      actions={
        <>
          <Button variant="ghost" colorScheme="secondary">Close</Button>
          <Button colorScheme="primary">View app</Button>
        </>
      }
    />
  );
}

export function Destructive() {
  return (
    <Dialog
      open
      onClose={noop}
      style="destructive"
      title="Delete this form?"
      description="This permanently deletes the form and all 1,240 responses. This action cannot be undone."
      actions={
        <>
          <Button variant="ghost" colorScheme="secondary">Cancel</Button>
          <Button colorScheme="destructive">Delete form</Button>
        </>
      }
      footerLink={{ label: 'Learn about deletion', href: '#' }}
    />
  );
}

export function Warning() {
  return (
    <Dialog
      open
      onClose={noop}
      style="warning"
      title="You have unsaved changes"
      description="Your changes will be lost if you leave this page without saving."
      actions={
        <>
          <Button variant="ghost" colorScheme="secondary">Keep editing</Button>
          <Button colorScheme="primary">Leave anyway</Button>
        </>
      }
    />
  );
}
