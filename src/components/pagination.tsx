// 1 2 3 4 5 6 7 when there are few pages; otherwise 1 … 4 5 6 … 12 around the
// active page.
const getPageNumbers = (activePage: number, totalPages: number): (number | "...")[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: (number | "...")[] = [1];
  if (activePage > 3) pages.push("...");
  for (let page = Math.max(2, activePage - 1); page <= Math.min(totalPages - 1, activePage + 1); page++) {
    pages.push(page);
  }
  if (activePage < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
};

const Pagination = ({
  activePage,
  totalPages,
  onPageChange,
}: {
  activePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const lastPage = Math.max(1, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        disabled={activePage <= 1}
        onClick={() => onPageChange(Math.max(1, activePage - 1))}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-40"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers(activePage, lastPage).map((page, index) =>
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
        disabled={activePage >= lastPage}
        onClick={() => onPageChange(Math.min(lastPage, activePage + 1))}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-40"
      >
        Next
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
