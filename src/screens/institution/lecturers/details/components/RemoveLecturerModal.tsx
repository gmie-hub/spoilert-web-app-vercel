"use client";

const TrashIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
      stroke="#9CA3AF"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 11v6M14 11v6" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const RemoveLecturerModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-[480px] rounded-2xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.15)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-center">
        <TrashIcon />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-[#212529]">
        Are You Sure You Want To Remove This Lecturer From Your Institution?
      </h2>
      <p className="mt-2 text-sm text-gray-500">This action cannot be undone</p>

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
          className="flex-1 rounded-xl bg-[var(--color-red)] py-3 text-sm font-medium text-white"
        >
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
);

export default RemoveLecturerModal;
