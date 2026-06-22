// Grouping wrapper: re-exports the real app-builder PagePropertiesPanel so the
// .design-sync/builder-chrome/<Name>/<Name>.tsx path puts it in the "builder-chrome"
// group. Bundled component comes from lib-entry's direct export; props pinned via
// cfg.dtsPropsFor.PagePropertiesPanel.
export { PagePropertiesPanel } from '../../../../app-builder/src/components/PagePropertiesPanel';
