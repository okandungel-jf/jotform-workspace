import { PagePropertiesPanel } from '@jf/design-system';

const noop = () => {};

export function Default() {
  return (
    <PagePropertiesPanel
      page={{ id: 'home', name: 'Home', icon: 'house-filled', showIcon: true, landing: true }}
      isFirstPage
      onRename={noop}
      onChangeIcon={noop}
      onToggleHidden={noop}
      onToggleRequireLogin={noop}
      onToggleShowIcon={noop}
      onToggleLanding={noop}
      onClose={noop}
    />
  );
}
