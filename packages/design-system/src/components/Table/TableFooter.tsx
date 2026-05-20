import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { DropdownSingle } from '../Dropdown';
import type { DropdownOption } from '../Dropdown';

export type TableFooterType = 'simple' | 'advanced';

export interface TablePagination {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

interface TableFooterProps {
  type: TableFooterType;
  pagination?: TablePagination;
  totalItems?: number;
}

function numberOptions(values: number[]): DropdownOption[] {
  return values.map((value) => ({ value: String(value), label: String(value) }));
}

function resultsLabel(total: number): string {
  return `${total.toLocaleString('en-US')} ${total === 1 ? 'result' : 'results'}`;
}

function PageControls({ pagination }: { pagination: TablePagination }) {
  const { page, pageCount, onPageChange } = pagination;
  const pageOptions = numberOptions(
    Array.from({ length: Math.max(pageCount, 1) }, (_, i) => i + 1),
  );

  return (
    <div className="jf-table__footer-group">
      <span className="jf-table__footer-label">Page</span>
      <div className="jf-table__footer-select">
        <DropdownSingle
          size="sm"
          showLeadingIcon={false}
          usePortal
          portalAlign="start"
          options={pageOptions}
          value={String(page)}
          onChange={(value) => onPageChange(Number(value))}
        />
      </div>
      <span className="jf-table__footer-label">of {pageCount}</span>
      <div className="jf-table__footer-nav">
        <Button
          variant="transparent"
          colorScheme="secondary"
          shape="rectangle"
          size="md"
          iconOnly
          aria-label="Previous page"
          disabled={page <= 1}
          leftIcon={<Icon name="chevron-left" category="arrows" size={20} />}
          onClick={() => onPageChange(page - 1)}
        />
        <Button
          variant="transparent"
          colorScheme="secondary"
          shape="rectangle"
          size="md"
          iconOnly
          aria-label="Next page"
          disabled={page >= pageCount}
          leftIcon={<Icon name="chevron-right" category="arrows" size={20} />}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}

export function TableFooter({ type, pagination, totalItems }: TableFooterProps) {
  const results = totalItems != null ? resultsLabel(totalItems) : null;

  if (type === 'advanced' && pagination) {
    const sizeOptions = numberOptions(pagination.pageSizeOptions ?? []);
    return (
      <div className="jf-table__footer">
        <div className="jf-table__footer-results">
          <span className="jf-table__footer-label">Show</span>
          {pagination.pageSize != null && sizeOptions.length > 0 && (
            <div className="jf-table__footer-select">
              <DropdownSingle
                size="sm"
                showLeadingIcon={false}
                usePortal
                portalAlign="start"
                options={sizeOptions}
                value={String(pagination.pageSize)}
                onChange={(value) => pagination.onPageSizeChange?.(Number(value))}
              />
            </div>
          )}
          {results && <span className="jf-table__footer-results-text">of {results}</span>}
        </div>
        <PageControls pagination={pagination} />
      </div>
    );
  }

  return (
    <div className="jf-table__footer">
      {results && <span className="jf-table__footer-results-text">{results}</span>}
      {pagination && <PageControls pagination={pagination} />}
    </div>
  );
}
