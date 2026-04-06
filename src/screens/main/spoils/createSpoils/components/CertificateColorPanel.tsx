import { FiPlus, FiX } from "react-icons/fi";

interface CertificateColorPanelProps {
  designColors: readonly string[];
  defaultColors: readonly string[];
  selectedColor: string;
  onApplyColor: (color: string) => void;
  onClose: () => void;
}

export default function CertificateColorPanel({
  designColors,
  defaultColors,
  selectedColor,
  onApplyColor,
  onClose,
}: CertificateColorPanelProps) {
  const renderSwatch = (color: string, index: number) => {
    const isActive = selectedColor === color;
    const isWhite = color === "#FFFFFF";

    return (
      <button
        key={`${color}-${index}`}
        type="button"
        onClick={() => onApplyColor(color)}
        className={`relative h-8 w-8 rounded-full transition ${
          isWhite ? "border border-[#E6E7EB]" : ""
        } ${isActive ? "ring-2 ring-[#0B5368] ring-offset-2 ring-offset-white" : ""}`}
        style={{ backgroundColor: color }}
        aria-label={`Select color ${color}`}
      />
    );
  };

  return (
    <div className="mb-6 rounded-[24px] border border-[#EDEEF1] bg-white p-5 shadow-[0_20px_44px_rgba(15,23,42,0.08)] lg:absolute lg:left-0 lg:top-6 lg:z-10 lg:mb-0 lg:w-[298px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[24px] font-medium text-[#111827]">Colors</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[#252B37]"
          aria-label="Close colors panel"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-[#111827]">Design Colors</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {designColors.map(renderSwatch)}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-[#111827]">Default Colors</p>
        <p className="mt-1 text-[11px] text-[#98A2B3]">Solid colors</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="relative flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, #FF6B6B, #F9C74F, #43AA8B, #4D96FF, #9B5DE5, #FF6B6B)",
            }}
            aria-label="Open full color picker"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#39C37A]">
              <FiPlus className="h-3 w-3" />
            </span>
          </button>

          {defaultColors.map(renderSwatch)}
        </div>
      </div>
    </div>
  );
}
