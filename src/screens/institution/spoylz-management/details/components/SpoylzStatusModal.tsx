"use client";

const WarningIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
      stroke="#DC3545"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M12 9.5v4.2" stroke="#DC3545" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="16.8" r="0.15" fill="#DC3545" stroke="#DC3545" strokeWidth="1.3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.3" stroke="#28A745" strokeWidth="1.4" />
    <path d="M8 12.3l2.6 2.6L16.2 9" stroke="#28A745" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type SpoylzStatusAction = "disable" | "enable";

const SpoylzStatusModal = ({
  action,
  onClose,
  onConfirm,
}: {
  action: SpoylzStatusAction;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const isDisable = action === "disable";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">{isDisable ? <WarningIcon /> : <CheckCircleIcon />}</div>

        <h2 className="mt-5 text-xl font-semibold text-[#212529]">
          {isDisable
            ? "Are You Sure You Want To Disable This Spoylz?"
            : "Are You Sure You Want To Enable This Spoylz?"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {isDisable
            ? "Students will no longer be able to purchase or access this Spoylz until it is re-enabled."
            : "Students will be able to purchase and access this Spoylz again."}
        </p>

        <div className="mt-7 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#212529]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 text-sm font-medium text-white ${
              isDisable ? "bg-[var(--color-red)]" : "bg-[var(--color-green)]"
            }`}
          >
            {isDisable ? "Yes, Disable" : "Yes, Enable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpoylzStatusModal;
