const DEFAULT_PAGE_NUMBERS: (number | "...")[] = [1, 2, 3, "...", 8, 9, 10];

const Pagination = ({
  activePage,
  onPageChange,
  pageNumbers = DEFAULT_PAGE_NUMBERS,
}: {
  activePage: number;
  onPageChange: (page: number) => void;
  pageNumbers?: (number | "...")[];
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <button
      type="button"
      disabled={activePage === 1}
      onClick={() => onPageChange(Math.max(1, activePage - 1))}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-40"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Previous
    </button>

    <div className="flex items-center gap-2">
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              activePage === page ? "bg-[var(--color-blue-lightest)] text-[var(--color-blue)]" : "text-gray-500"
            }`}
          >
            {page}
          </button>
        ),
      )}
    </div>

    <button
      type="button"
      onClick={() => onPageChange(activePage + 1)}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
    >
      Next
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

export default Pagination;
