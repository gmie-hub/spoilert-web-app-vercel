const DeleteIconButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default DeleteIconButton;
