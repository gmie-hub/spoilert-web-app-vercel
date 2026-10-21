import { FiCornerUpLeft, FiEdit2, FiX } from "react-icons/fi";

interface Props {
  mode: "reply" | "edit";
  /** Whose message it is ("You" for my own). */
  title: string;
  text: string;
  onCancel: () => void;
}

/** "Replying to…" / "Editing message" strip above the composer. */
export function ComposerBanner({ mode, title, text, onCancel }: Props) {
  const Icon = mode === "edit" ? FiEdit2 : FiCornerUpLeft;

  return (
    <div className="flex items-center gap-3 mb-2 rounded-xl bg-[#F5F6F8] border-l-4 border-[#0B5368] px-3 py-2">
      <Icon size={16} className="text-[#0B5368] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#0B5368]">
          {mode === "edit" ? "Editing message" : `Replying to ${title}`}
        </p>
        <p className="text-xs text-[#5F6368] truncate">{text}</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        aria-label={mode === "edit" ? "Cancel editing" : "Cancel reply"}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A98A3] hover:text-[#20262D] hover:bg-white transition-colors shrink-0 cursor-pointer"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
