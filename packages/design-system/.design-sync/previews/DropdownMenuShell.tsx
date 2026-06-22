import { DropdownMenuShell, Icon } from '@jf/design-system';

// DropdownMenuShell is the low-level overlay primitive used by DropdownSingle/Multi.
// It is normally position:absolute and only mounts while a dropdown is open, so for a
// static preview we neutralise its positioning and host the same item markup its real
// consumers render (jf-dropdown__item / __item-leading / __item-label / __divider).
const noop = () => {};
const previewCss = `.jf-dropdown__menu.dsp-static{position:static;max-height:none;}`;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 260 }}>
      <style>{previewCss}</style>
      {children}
    </div>
  );
}

function Item({
  label,
  icon,
  category = 'general',
  selected,
  active,
}: {
  label: string;
  icon?: string;
  category?: string;
  selected?: boolean;
  active?: boolean;
}) {
  const cls = [
    'jf-dropdown__item',
    selected && 'jf-dropdown__item--selected',
    active && 'jf-dropdown__item--active',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} role="option" aria-selected={!!selected}>
      {icon && (
        <span className="jf-dropdown__item-leading">
          <Icon name={icon} category={category} size={20} />
        </span>
      )}
      <span className="jf-dropdown__item-label">{label}</span>
      {selected && (
        <span className="jf-dropdown__item-trailing">
          <Icon name="check" category="general" size={18} />
        </span>
      )}
    </div>
  );
}

// Canonical single-select menu: one selected (check), one hover-active.
export function Default() {
  return (
    <Frame>
      <DropdownMenuShell placement="bottom" isSheet={false} className="dsp-static" menuRef={noop} onClose={noop} onKeyDown={noop}>
        <Item label="Most recent" selected />
        <Item label="Oldest first" active />
        <Item label="Name (A–Z)" />
        <Item label="Name (Z–A)" />
      </DropdownMenuShell>
    </Frame>
  );
}

// Actions menu with leading icons.
export function WithIcons() {
  return (
    <Frame>
      <DropdownMenuShell placement="bottom" isSheet={false} className="dsp-static" menuRef={noop} onClose={noop} onKeyDown={noop}>
        <Item label="Edit" icon="pencil-to-square" active />
        <Item label="Duplicate" icon="copy" />
        <Item label="Share" icon="share-nodes-filled" />
        <Item label="Delete" icon="trash-filled" />
      </DropdownMenuShell>
    </Frame>
  );
}

// Grouped options separated by the real divider element.
export function Grouped() {
  return (
    <Frame>
      <DropdownMenuShell placement="bottom" isSheet={false} className="dsp-static" menuRef={noop} onClose={noop} onKeyDown={noop}>
        <Item label="Open" icon="eye-filled" />
        <Item label="Bookmark" icon="bookmark-filled" selected />
        <div className="jf-dropdown__divider" role="separator" />
        <Item label="Archive" icon="copy-line" />
        <Item label="Delete" icon="trash-filled" />
      </DropdownMenuShell>
    </Frame>
  );
}
