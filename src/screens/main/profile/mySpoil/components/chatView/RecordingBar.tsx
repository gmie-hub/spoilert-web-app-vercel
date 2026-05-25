import { FiMic, FiTrash2 } from "react-icons/fi";

import { formatDuration } from "./types";

interface Props {
  duration: number;
  cancelled: boolean;
  slideOffset: number;
  onCancel: () => void;
}

export function RecordingBar({ duration, cancelled, slideOffset, onCancel }: Props) {
  return (
    <div className="flex items-center gap-3 h-[44px] px-1 select-none">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCancel}
        className="text-red-500 hover:text-red-600 shrink-0 transition-colors"
      >
        <FiTrash2 size={20} />
      </button>

      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-[#20262D] tabular-nums">
            {formatDuration(duration)}
          </span>
        </div>
        <span
          className={`text-xs whitespace-nowrap transition-colors duration-150 ${cancelled ? "text-red-500 font-semibold" : "text-[#8A98A3]"}`}
          style={{ transform: `translateX(${Math.max(slideOffset * 0.25, -40)}px)` }}
        >
          {cancelled ? "Release to cancel" : "← Slide to cancel"}
        </span>
      </div>

      <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 animate-pulse">
        <FiMic size={16} />
      </div>
    </div>
  );
}
