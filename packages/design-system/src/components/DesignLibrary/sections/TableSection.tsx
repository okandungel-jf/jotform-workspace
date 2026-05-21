import { Table, TableTitle } from '../../Table';
import { SearchInput } from '../../SearchInput';
import { Button } from '../../Button/Button';
import type { ReactNode } from 'react';
import type {
  TableColumn,
  TableHeaderStyle,
  TablePagination,
  TableSize,
  TableSort,
} from '../../Table';

interface DemoRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  amount: number;
}

const DEMO_ROWS: DemoRow[] = [
  { id: 1, name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'Admin', status: 'Active', amount: 1999 },
  { id: 2, name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'Editor', status: 'Active', amount: 39 },
  { id: 3, name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', role: 'Viewer', status: 'Invited', amount: 299 },
  { id: 4, name: 'William Kim', email: 'will.kim@email.com', role: 'Editor', status: 'Active', amount: 99 },
  { id: 5, name: 'Sofia Davis', email: 'sofia.davis@email.com', role: 'Admin', status: 'Suspended', amount: 1499 },
  { id: 6, name: 'Liam Johnson', email: 'liam.johnson@email.com', role: 'Viewer', status: 'Active', amount: 49 },
  { id: 7, name: 'Emma Wilson', email: 'emma.wilson@email.com', role: 'Editor', status: 'Invited', amount: 749 },
  { id: 8, name: 'Noah Brown', email: 'noah.brown@email.com', role: 'Viewer', status: 'Active', amount: 199 },
];

const PAGE_SIZE_OPTIONS = [5, 10, 25];

const currency = (value: number) => `$${value.toLocaleString('en-US')}`;

function buildColumns(sortable: boolean): TableColumn<DemoRow>[] {
  return [
    { key: 'name', header: 'Name', sortable },
    { key: 'email', header: 'Email', sortable },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'amount', header: 'Amount', align: 'right', sortable, render: (row) => currency(row.amount) },
  ];
}

function sortRows(rows: DemoRow[], sort: TableSort | null): DemoRow[] {
  if (!sort) return rows;
  const key = sort.key as keyof DemoRow;
  const sorted = [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'number' && typeof bv === 'number') return av - bv;
    return String(av).localeCompare(String(bv));
  });
  return sort.direction === 'asc' ? sorted : sorted.reverse();
}

type TableLoadingOption = 'off' | 'skeleton' | 'scrim' | 'spinner';
type TableFooterOption = 'off' | 'simple' | 'advanced';
type TableToolbarOption = 'off' | 'title' | 'search' | 'title-search';
type TableToolbarSize = 'default' | 'small';

export interface TablePanelState {
  size: TableSize;
  headerStyle: TableHeaderStyle;
  bordered: boolean;
  sortable: boolean;
  loading: TableLoadingOption;
  footer: TableFooterOption;
  toolbar: TableToolbarOption;
  toolbarSize: TableToolbarSize;
  toolbarActions: boolean;
  toolbarInCard: boolean;
  selectable: boolean;
  selectedKeys: Array<string | number>;
  resizable: boolean;
  page: number;
  pageSize: number;
  sort: TableSort | null;
}

export const defaultTableState: TablePanelState = {
  size: 'md',
  headerStyle: 'white',
  bordered: true,
  sortable: true,
  loading: 'off',
  footer: 'simple',
  toolbar: 'title-search',
  toolbarSize: 'default',
  toolbarActions: true,
  toolbarInCard: true,
  selectable: true,
  selectedKeys: [],
  resizable: true,
  page: 1,
  pageSize: 5,
  sort: null,
};

const STORY_ROWS = DEMO_ROWS.slice(0, 4);
const STORY_COLUMNS = buildColumns(false);

export function TableSection({
  state,
  onChange,
}: {
  state: TablePanelState;
  onChange: (state: TablePanelState) => void;
}) {
  const columns = buildColumns(state.sortable);
  const sorted = sortRows(DEMO_ROWS, state.sortable ? state.sort : null);
  const loadingVariant = state.loading === 'off' ? undefined : state.loading;
  const hasTitle = state.toolbar === 'title' || state.toolbar === 'title-search';
  const hasSearch = state.toolbar === 'search' || state.toolbar === 'title-search';
  const tbSize = hasTitle && state.toolbarSize === 'small' ? 'sm' : 'md';
  const selectedCount = state.selectable ? state.selectedKeys.length : 0;

  const actionsEl = state.toolbarActions ? (
    <div className="jf-table__toolbar-actions">
      <Button variant="ghost" size={tbSize}>
        Export
      </Button>
      <Button variant="filled" size={tbSize}>
        Add member
      </Button>
    </div>
  ) : null;
  const titleEl = (
    <TableTitle
      size={tbSize}
      title="Team members"
      subtitle="8 people in this workspace"
      icon="arrows-switch-horizontal"
      iconCategory="arrows"
    />
  );
  const searchEl = (
    <div className="jf-table__toolbar-search">
      <SearchInput size={tbSize} showFilter placeholder="Search members" />
    </div>
  );

  let toolbarNode: ReactNode;
  if (selectedCount > 0) {
    toolbarNode = (
      <div className="jf-table__toolbar-row">
        <Button variant="ghost" size="md">
          {selectedCount} selected
        </Button>
        <div className="jf-table__toolbar-actions">
          <Button
            variant="ghost"
            colorScheme="secondary"
            size="md"
            onClick={() => onChange({ ...state, selectedKeys: [] })}
          >
            Clear
          </Button>
          <Button variant="filled" colorScheme="destructive" size="md">
            Delete
          </Button>
        </div>
      </div>
    );
  } else if (state.toolbar === 'off') {
    toolbarNode = undefined;
  } else if (hasTitle && hasSearch) {
    toolbarNode = (
      <>
        <div className="jf-table__toolbar-row">{titleEl}</div>
        <div className="jf-table__toolbar-row">
          {searchEl}
          {actionsEl}
        </div>
      </>
    );
  } else {
    toolbarNode = (
      <div className="jf-table__toolbar-row">
        {hasTitle ? titleEl : searchEl}
        {actionsEl}
      </div>
    );
  }

  let displayRows = sorted;
  let pagination: TablePagination | undefined;
  let totalItems: number | undefined;

  if (state.footer !== 'off') {
    const pageSize = state.pageSize;
    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const page = Math.min(Math.max(state.page, 1), pageCount);
    displayRows = sorted.slice((page - 1) * pageSize, page * pageSize);
    totalItems = sorted.length;
    pagination = {
      page,
      pageCount,
      onPageChange: (next) => onChange({ ...state, page: next }),
      pageSize,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPageSizeChange: (size) => onChange({ ...state, pageSize: size, page: 1 }),
    };
  }

  return (
    <div>
      <h1 className="dl-section__title">Table</h1>
      <p className="dl-section__description">
        Config-driven data table. Columns define header, alignment and sorting; rows are plain
        data objects. Supports sm/md/lg sizes, white or grey header, optional outer border,
        sortable columns, row selection, three loading modes (skeleton, scrim, spinner),
        built-in empty / error states and an optional footer with pagination and result counts.
      </p>

      <div className="dl-playground__preview dl-playground__preview--flush">
        <div style={{ width: '100%' }}>
          <Table
            columns={columns}
            data={displayRows}
            size={state.size}
            bordered={state.bordered}
            headerStyle={state.headerStyle}
            loading={state.loading !== 'off'}
            loadingVariant={loadingVariant}
            sort={state.sort}
            onSortChange={(sort) => onChange({ ...state, sort })}
            selectable={state.selectable}
            selectedRowKeys={state.selectedKeys}
            onSelectionChange={(keys) => onChange({ ...state, selectedKeys: keys })}
            resizable={state.resizable}
            pagination={pagination}
            totalItems={totalItems}
            footerType={state.footer === 'advanced' ? 'advanced' : 'simple'}
            toolbar={toolbarNode}
            toolbarInCard={state.toolbarInCard}
            rowKey={(row) => row.id}
          />
        </div>
      </div>

      <div className="dl-stories">
        <p className="dl-stories__heading">Stories</p>
        <div className="dl-stories__list">
          <div>
            <h3 className="dl-stories__item-title">Small (sm)</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table columns={STORY_COLUMNS} data={STORY_ROWS} size="sm" rowKey={(row) => row.id} />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Large (lg)</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table columns={STORY_COLUMNS} data={STORY_ROWS} size="lg" rowKey={(row) => row.id} />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Grey header</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                headerStyle="grey"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Without border</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                bordered={false}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Row selection</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                selectable
                selectedRowKeys={[2, 4]}
                onSelectionChange={() => {}}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Footer — pagination &amp; results</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                pagination={{ page: 1, pageCount: 4, onPageChange: () => {} }}
                totalItems={18}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Footer — advanced</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                footerType="advanced"
                pagination={{
                  page: 1,
                  pageCount: 4,
                  onPageChange: () => {},
                  pageSize: 25,
                  pageSizeOptions: [10, 25, 50],
                  onPageSizeChange: () => {},
                }}
                totalItems={94}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Toolbar — title</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                toolbar={
                  <TableTitle
                    title="Team members"
                    subtitle="8 people in this workspace"
                    icon="arrows-switch-horizontal"
                    iconCategory="arrows"
                  />
                }
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Toolbar — search</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                toolbar={<SearchInput showFilter placeholder="Search members" />}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Toolbar — title &amp; actions</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                toolbar={
                  <div className="jf-table__toolbar-row">
                    <TableTitle
                      size="md"
                      title="Team members"
                      subtitle="8 people"
                      icon="arrows-switch-horizontal"
                      iconCategory="arrows"
                    />
                    <div className="jf-table__toolbar-actions">
                      <Button variant="ghost">Export</Button>
                      <Button variant="filled">Add member</Button>
                    </div>
                  </div>
                }
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Data table — composed</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                toolbar={
                  <>
                    <div className="jf-table__toolbar-row">
                      <TableTitle
                        size="md"
                        title="Team members"
                        subtitle="8 people"
                        icon="arrows-switch-horizontal"
                        iconCategory="arrows"
                      />
                    </div>
                    <div className="jf-table__toolbar-row">
                      <div className="jf-table__toolbar-search">
                        <SearchInput showFilter placeholder="Search members" />
                      </div>
                      <div className="jf-table__toolbar-actions">
                        <Button variant="ghost">Export</Button>
                        <Button variant="filled">Add member</Button>
                      </div>
                    </div>
                  </>
                }
                pagination={{ page: 1, pageCount: 3, onPageChange: () => {} }}
                totalItems={18}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Loading — skeleton</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={[]}
                loading
                loadingVariant="skeleton"
                skeletonRows={4}
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Loading — scrim</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={STORY_ROWS}
                loading
                loadingVariant="scrim"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Loading — spinner</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={[]}
                loading
                loadingVariant="spinner"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Empty</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table columns={STORY_COLUMNS} data={[]} rowKey={(row) => row.id} />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Empty — no search results</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={[]}
                emptyState="no-results"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Empty — no filter results</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={[]}
                emptyState="no-filter-results"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Empty — error</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={[]}
                emptyState="error"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
          <div>
            <h3 className="dl-stories__item-title">Empty — all columns hidden</h3>
            <div className="dl-stories__item-preview dl-stories__item-preview--flush">
              <Table
                columns={STORY_COLUMNS}
                data={[]}
                emptyState="columns-hidden"
                rowKey={(row) => row.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TablePanel({
  state,
  onChange,
}: {
  state: TablePanelState;
  onChange: (state: TablePanelState) => void;
}) {
  const update = (partial: Partial<TablePanelState>) => onChange({ ...state, ...partial });

  return (
    <>
      <div className="dl-playground__field">
        <label className="dl-playground__label">Size</label>
        <div className="dl-playground__segmented">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              className={`dl-playground__seg-btn ${state.size === size ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ size })}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Header style</label>
        <div className="dl-playground__segmented">
          {([
            ['white', 'White'],
            ['grey', 'Grey'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={`dl-playground__seg-btn ${state.headerStyle === key ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ headerStyle: key })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Loading</label>
        <div className="dl-playground__segmented">
          {([
            ['off', 'Off'],
            ['skeleton', 'Skeleton'],
            ['scrim', 'Scrim'],
            ['spinner', 'Spinner'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={`dl-playground__seg-btn ${state.loading === key ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ loading: key })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Footer</label>
        <div className="dl-playground__segmented">
          {([
            ['off', 'Off'],
            ['simple', 'Simple'],
            ['advanced', 'Advanced'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={`dl-playground__seg-btn ${state.footer === key ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ footer: key, page: 1 })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dl-playground__field">
        <label className="dl-playground__label">Toolbar</label>
        <div className="dl-playground__segmented">
          {([
            ['off', 'Off'],
            ['title', 'Title'],
            ['search', 'Search'],
            ['title-search', 'Both'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={`dl-playground__seg-btn ${state.toolbar === key ? 'dl-playground__seg-btn--active' : ''}`}
              onClick={() => update({ toolbar: key })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(state.toolbar === 'title' || state.toolbar === 'title-search') && (
        <div className="dl-playground__field">
          <label className="dl-playground__label">Toolbar size</label>
          <div className="dl-playground__segmented">
            {([
              ['default', 'Default'],
              ['small', 'Small'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                className={`dl-playground__seg-btn ${state.toolbarSize === key ? 'dl-playground__seg-btn--active' : ''}`}
                onClick={() => update({ toolbarSize: key })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dl-playground__divider" />

      <div className="dl-playground__field dl-playground__field--row">
        <label className="dl-playground__label">Outer border</label>
        <button
          className={`dl-playground__toggle ${state.bordered ? 'dl-playground__toggle--on' : ''}`}
          onClick={() => update({ bordered: !state.bordered })}
        >
          <span className="dl-playground__toggle-thumb" />
        </button>
      </div>

      <div className="dl-playground__field dl-playground__field--row">
        <label className="dl-playground__label">Sortable columns</label>
        <button
          className={`dl-playground__toggle ${state.sortable ? 'dl-playground__toggle--on' : ''}`}
          onClick={() => update({ sortable: !state.sortable })}
        >
          <span className="dl-playground__toggle-thumb" />
        </button>
      </div>

      <div className="dl-playground__field dl-playground__field--row">
        <label className="dl-playground__label">Row selection</label>
        <button
          className={`dl-playground__toggle ${state.selectable ? 'dl-playground__toggle--on' : ''}`}
          onClick={() => update({ selectable: !state.selectable })}
        >
          <span className="dl-playground__toggle-thumb" />
        </button>
      </div>

      <div className="dl-playground__field dl-playground__field--row">
        <label className="dl-playground__label">Resizable columns</label>
        <button
          className={`dl-playground__toggle ${state.resizable ? 'dl-playground__toggle--on' : ''}`}
          onClick={() => update({ resizable: !state.resizable })}
        >
          <span className="dl-playground__toggle-thumb" />
        </button>
      </div>

      <div className="dl-playground__field dl-playground__field--row">
        <label className="dl-playground__label">Toolbar actions</label>
        <button
          className={`dl-playground__toggle ${state.toolbarActions ? 'dl-playground__toggle--on' : ''}`}
          onClick={() => update({ toolbarActions: !state.toolbarActions })}
        >
          <span className="dl-playground__toggle-thumb" />
        </button>
      </div>

      {state.toolbar !== 'off' && (
        <div className="dl-playground__field dl-playground__field--row">
          <label className="dl-playground__label">Toolbar in card</label>
          <button
            className={`dl-playground__toggle ${state.toolbarInCard ? 'dl-playground__toggle--on' : ''}`}
            onClick={() => update({ toolbarInCard: !state.toolbarInCard })}
          >
            <span className="dl-playground__toggle-thumb" />
          </button>
        </div>
      )}
    </>
  );
}
