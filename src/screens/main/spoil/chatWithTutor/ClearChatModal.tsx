"use client";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearChatModal({ onClose, onConfirm }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[460px] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center px-8 pt-10 pb-6">
          {/* Chat bubble with "?" — matches the design */}
          <div className="mb-6">
            <svg
              width="80"
              height="76"
              viewBox="0 0 80 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4" y="4" width="72" height="56" rx="14"
                stroke="#0B5368" strokeWidth="3.5"
              />
              <path
                d="M24 60 L14 74 L38 66"
                stroke="#0B5368" strokeWidth="3.5" strokeLinejoin="round"
              />
              <text
                x="40" y="36"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0B5368"
                fontSize="30"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                ?
              </text>
            </svg>
          </div>

          <h2 className="text-[17px] font-bold text-[#20262D] leading-snug mb-2">
            Are You Sure You Want to Clear This Chat? 🎉
          </h2>
          <p className="text-sm text-[#8A98A3]">This action cannot be undone</p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl bg-[#0B5368] text-white font-semibold text-sm hover:bg-[#094558] transition-colors"
          >
            Clear Chat
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
