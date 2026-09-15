const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M3 9.5h18" stroke="#9CA3AF" strokeWidth="1.6" />
  </svg>
);

export interface FilterOption {
  label: string;
  type?: "date";
}

const FilterBar = ({
  searchPlaceholder,
  filters,
  search,
  onSearchChange,
  onReset,
}: {
  searchPlaceholder: string;
  filters: FilterOption[];
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}) => (
  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-3">
    <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="1.8" />
        <path d="M20 20l-3.5-3.5" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full text-sm outline-none placeholder:text-gray-400"
      />
    </div>

    <span className="flex items-center gap-1.5 text-sm text-gray-500">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h16M7 12h10M10 18h4" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      Filter by
    </span>

    {filters.map((filter) => (
      <button
        key={filter.label}
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500"
      >
        {filter.label}
        {filter.type === "date" ? <CalendarIcon /> : <ChevronDown />}
      </button>
    ))}

    <button
      type="button"
      onClick={onReset}
      className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4v5h5" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 9A8 8 0 1 1 6 15" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      Reset Filter
    </button>
  </div>
);

export default FilterBar;
