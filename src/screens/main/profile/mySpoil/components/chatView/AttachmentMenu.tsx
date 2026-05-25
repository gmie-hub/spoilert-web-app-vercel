import { FiFile, FiImage } from "react-icons/fi";

interface Props {
  onImageClick: () => void;
  onDocumentClick: () => void;
}

export function AttachmentMenu({ onImageClick, onDocumentClick }: Props) {
  return (
    <div
      className="absolute bottom-full right-14 mb-2 bg-white rounded-2xl shadow-xl border border-[#E9EEF2] overflow-hidden z-20 min-w-[180px]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onImageClick}
        className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-[#F8FAFC] text-sm text-[#20262D] transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
          <FiImage size={18} className="text-pink-500" />
        </div>
        Photos &amp; Videos
      </button>
      <div className="h-px bg-[#E9EEF2]" />
      <button
        type="button"
        onClick={onDocumentClick}
        className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-[#F8FAFC] text-sm text-[#20262D] transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-[#0B5368]/10 flex items-center justify-center shrink-0">
          <FiFile size={18} className="text-[#0B5368]" />
        </div>
        Document
      </button>
    </div>
  );
}
