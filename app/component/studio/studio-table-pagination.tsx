import { Button } from "@bridge/ui/app/component/shadcn/button"

export type StudioTablePageSize = 20 | 50 | 100 | 500

export function StudioTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: {
  readonly page: number
  readonly pageSize: StudioTablePageSize
  readonly total: number
  readonly onPageChange: (page: number) => void
  readonly onPageSizeChange: (pageSize: StudioTablePageSize) => void
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, pageCount)
  const first = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const last = Math.min(currentPage * pageSize, total)
  const pages = CreateVisiblePages(currentPage, pageCount)

  function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = Number(event.currentTarget.value)
    if (value === 20 || value === 50 || value === 100 || value === 500) onPageSizeChange(value)
  }

  return (
    <nav
      className="flex flex-col gap-3 border border-t-0 border-white/10 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
      aria-label="Table pagination">
      <span className="text-highlight/60">
        Showing {first}–{last} of {total}
      </span>
      <label className="flex items-center gap-2 text-highlight/60">
        Rows per page
        <select
          aria-label="Rows per page"
          className="rounded border border-white/15 bg-background px-2 py-1 text-highlight"
          value={pageSize}
          onChange={handlePageSizeChange}>
          {[20, 50, 100, 500].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          aria-label="Previous page"
          onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            variant={pageNumber === currentPage ? "default" : "secondary"}
            size="sm"
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}>
            {pageNumber}
          </Button>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={currentPage === pageCount}
          aria-label="Next page"
          onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      </div>
    </nav>
  )
}

function CreateVisiblePages(page: number, pageCount: number): readonly number[] {
  const start = Math.max(1, Math.min(page - 2, pageCount - 4))
  const end = Math.min(pageCount, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
