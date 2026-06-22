import { TopBar } from '@jf/design-system';

const noop = () => {};
const presets = [
  { id: 'feedback', name: 'Customer Feedback' },
  { id: 'event', name: 'Event Registration' },
  { id: 'intake', name: 'Patient Intake' },
];

export function Default() {
  return (
    <TopBar
      activePage="build"
      onPageChange={noop}
      appName="Customer Feedback"
      previewMode={false}
      onPreviewToggle={noop}
      presets={presets}
      activePresetId="feedback"
      onPresetChange={noop}
    />
  );
}

export function Publish() {
  return (
    <TopBar
      activePage="publish"
      onPageChange={noop}
      appName="Event Registration"
      previewMode={false}
      onPreviewToggle={noop}
      presets={presets}
      activePresetId="event"
      onPresetChange={noop}
    />
  );
}
