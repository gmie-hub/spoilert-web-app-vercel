import type { ReactNode } from "react";

// Same frame as the Add Lecturer modal: title (optional) with a round close button.
const ModalShell = ({
  title,
  ariaLabel = title,
  onClose,
  children,
}: {
  title?: string;
  ariaLabel?: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="w-full max-w-[560px] rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.15)] sm:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        {title && <h2 className="text-xl font-semibold text-[#212529] sm:text-2xl">{title}</h2>}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {children}
    </div>
  </div>
);

export default ModalShell;
