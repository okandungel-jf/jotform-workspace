import { Header } from '@jf/design-system';

const noop = () => {};

export function Build() {
  return <Header appName="Customer Feedback" lastEdited="Last edited at 12:21 pm." activeTab="build" onTabChange={noop} />;
}

export function Settings() {
  return <Header appName="Customer Feedback" lastEdited="Last edited at 12:21 pm." activeTab="settings" onTabChange={noop} />;
}

export function Publish() {
  return <Header appName="Event Registration" lastEdited="Last edited just now." activeTab="publish" onTabChange={noop} />;
}
