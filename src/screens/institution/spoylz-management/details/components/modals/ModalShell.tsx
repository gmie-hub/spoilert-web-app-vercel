import type { ReactNode } from "react";

import Button from "@spt/components/button";

// Frame shared by the Spoylz edit modals, styled like the Add Lecturer modal.
const ModalShell = ({
  title,
  description,
  onClose,
  children,
  widthClassName = "max-w-[560px]",
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  widthClassName?: string;
}) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
    <div
      className={`w-full ${widthClassName} rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.15)] sm:p-10`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-[#212529] sm:text-2xl">{title}</h2>
          {description && <p className="mt-2 text-sm text-[#6B7280]">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  </div>
);

export const ModalActions = ({
  onCancel,
  isSubmitting,
  submitLabel = "Save Changes",
  submittingLabel = "Saving...",
}: {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}) => (
  <div className="flex gap-4 pt-2">
    <Button type="button" variant="blueOutline" className="flex-1" onClick={onCancel} disabled={isSubmitting}>
      Cancel
    </Button>
    <Button type="submit" className="flex-1" disabled={isSubmitting}>
      {isSubmitting ? submittingLabel : submitLabel}
    </Button>
  </div>
);

export default ModalShell;
