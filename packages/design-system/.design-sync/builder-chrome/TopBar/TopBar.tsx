// Grouping wrapper: re-exports the real app-builder TopBar so design-sync derives
// a generic group from the <Name>/<Name>.tsx path, letting the docsMap category
// ("Builder Chrome") apply. The actual bundled component comes from lib-entry's
// direct export; this file only steers discovery/grouping. Props are pinned via
// cfg.dtsPropsFor.TopBar.
export { TopBar } from '../../../../app-builder/src/shell/TopBar';
