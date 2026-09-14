"use client";

const QuestionBubbleIcon = () => (
  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-blue)]">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.7 8.6a2.3 2.3 0 1 1 3.4 2c-.7.4-1.1.8-1.1 1.6"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15.2" r="0.15" fill="#fff" stroke="#fff" strokeWidth="1.3" />
    </svg>
  </span>
);

const ResendInvitationModal = ({
  email,
  onClose,
  onConfirm,
}: {
  email: string;
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
        <QuestionBubbleIcon />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-[#212529]">Resend Invitation?</h2>
      <p className="mt-2 text-sm text-gray-500">
        We&rsquo;ll send a new invitation email to <span className="font-semibold text-[#212529]">{email}</span>.
        The current invitation link will remain valid unless it has expired.
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
          className="flex-1 rounded-xl bg-[var(--color-blue)] py-3 text-sm font-medium text-white"
        >
          Yes, Resend Invitation
        </button>
      </div>
    </div>
  </div>
);

export default ResendInvitationModal;
