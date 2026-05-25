"use client";

export const REPORT_REASONS = [
  "Inappropriate behavior",
  "Fraud or scam",
  "Poor quality or misleading content",
  "Harassment or abuse",
  "Spam",
  "Others",
] as const;

export type ReportStep = "reason" | "confirm" | "success" | null;

/* ─── Reason Modal ───────────────────────────────────────── */

interface ReasonModalProps {
  selectedReason: string;
  description: string;
  onSelectReason: (r: string) => void;
  onDescriptionChange: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function ReportReasonModal({
  selectedReason,
  description,
  onSelectReason,
  onDescriptionChange,
  onClose,
  onSubmit,
}: ReasonModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#20262D]">Report Tutor</h2>
            <p className="text-sm text-[#8A98A3] mt-1">
              Tell us what the issue is. Your report will be reviewed by our team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8A98A3] hover:text-[#20262D] transition-colors ml-4 mt-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-2">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-3 py-3 cursor-pointer border-b border-[#F1F4F7] last:border-0"
            >
              <input
                type="radio"
                name="report-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => onSelectReason(reason)}
                className="w-4 h-4 accent-[#0B5368] cursor-pointer"
              />
              <span className="text-sm text-[#20262D]">{reason}</span>
            </label>
          ))}
        </div>

        <div className="px-6 pb-5">
          <p className="text-sm font-semibold text-[#20262D] mb-2">Tell Us More</p>
          <textarea
            placeholder="Describe in details why you want to report this tutor"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-[#E9EEF2] px-4 py-3 text-sm text-[#20262D] placeholder:text-[#C4C4C4] outline-none focus:border-[#0B5368] resize-none transition-colors"
          />
        </div>

        <div className="px-6 pb-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={!selectedReason}
            onClick={onSubmit}
            className="w-full py-3.5 rounded-xl bg-[#0B5368] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#094558] transition-colors"
          >
            Report Tutor
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl border border-[#E9EEF2] text-[#20262D] font-medium text-sm hover:bg-[#F8FAFB] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────── */

interface ConfirmModalProps {
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReportConfirmModal({ onClose, onBack, onConfirm }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[480px] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-5 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-[#8A98A3] hover:text-[#20262D] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center text-center px-8 pb-2 pt-2">
          <div className="mb-5">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L56 52H8L32 8Z" stroke="#EF4444" strokeWidth="3" strokeLinejoin="round" />
              <line x1="32" y1="28" x2="32" y2="40" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
              <circle cx="32" cy="46" r="2" fill="#EF4444" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#20262D] leading-snug mb-2">
            Are You Sure You Want To Report This Tutor?
          </h2>
          <p className="text-sm text-[#8A98A3] leading-relaxed max-w-[320px]">
            Your report will be reviewed by the Admin. False reports may lead to account restrictions.
          </p>
        </div>

        <div className="px-8 py-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Yes, Report Tutor
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3.5 rounded-xl border border-[#E9EEF2] text-[#20262D] font-medium text-sm hover:bg-[#F8FAFB] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
