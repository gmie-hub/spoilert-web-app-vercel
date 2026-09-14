import Button from "@spt/components/button";

const EmptyLecturersIcon = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <rect x="18" y="24" width="60" height="56" rx="8" stroke="#D1D5DB" strokeWidth="2" fill="#fff" />
    <rect x="28" y="40" width="34" height="3" rx="1.5" fill="#E5E7EB" />
    <rect x="28" y="48" width="40" height="3" rx="1.5" fill="#E5E7EB" />
    <rect x="28" y="56" width="30" height="3" rx="1.5" fill="#E5E7EB" />
    <rect x="28" y="64" width="24" height="3" rx="1.5" fill="#E5E7EB" />
    <rect x="24" y="16" width="26" height="14" rx="4" fill="var(--color-blue)" />
    <rect x="30" y="21" width="14" height="2.4" rx="1.2" fill="#fff" />
  </svg>
);

const EmptyState = ({ onAddLecturer }: { onAddLecturer: () => void }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
    <h1 className="text-2xl font-semibold text-[#212529]">Lecturers</h1>

    <div className="flex flex-col items-center py-16 text-center">
      <EmptyLecturersIcon />

      <h2 className="mt-6 text-xl font-semibold text-[#212529]">
        You Haven&rsquo;t Added Any Lecturer Yet!
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-gray-400 sm:text-[15px]">
        Add lecturers to your institution. They&rsquo;ll receive an email
        invitation to join Spoylzert and can begin creating courses once they
        accept.
      </p>

      <Button type="button" className="mt-8 rounded-full px-8" onClick={onAddLecturer}>
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.7" />
            <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          Add Lecturer
        </span>
      </Button>
    </div>
  </div>
);

export default EmptyState;
