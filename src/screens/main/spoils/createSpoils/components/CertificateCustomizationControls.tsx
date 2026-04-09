import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiChevronDown,
  FiLink2,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiType,
} from "react-icons/fi";

import Button from "@spt/components/button";
import {
  CertificateCustomization,
  CertificateTextField,
} from "@spt/store/createSpoilStore";

interface CertificateCustomizationControlsProps {
  certificateCustomization: CertificateCustomization;
  isSaving?: boolean;
  hasSelectedText: boolean;
  selectedTextStyle: CertificateTextField;
  toolbarTextActions: readonly string[];
  onToggleItalic: () => void;
  onToggleBold: () => void;
  onCycleFontFamily: () => void;
  onToggleUnderline: () => void;
  onSetStrikeDecoration: () => void;
  onSetTextAlign: (textAlign: CertificateTextField["textAlign"]) => void;
  onToggleColorPanel: () => void;
  onSelectTextField: () => void;
  onUpdateFontSize: (delta: number) => void;
  onRemoveLogo: () => void;
  onRemoveSignature: () => void;
  onSave: () => void;
}

export default function CertificateCustomizationControls({
  certificateCustomization,
  isSaving = false,
  hasSelectedText,
  selectedTextStyle,
  toolbarTextActions,
  onToggleItalic,
  onToggleBold,
  onCycleFontFamily,
  onToggleUnderline,
  onSetStrikeDecoration,
  onSetTextAlign,
  onToggleColorPanel,
  onSelectTextField,
  onUpdateFontSize,
  onRemoveLogo,
  onRemoveSignature,
  onSave,
}: CertificateCustomizationControlsProps) {
  const isTextActionDisabled = !hasSelectedText;

  return (
    <div className="mt-8 flex flex-col w-full  gap-5">
      <div className="flex flex-wrap items-center justify-between gap-5 text-[#111827]">
        {toolbarTextActions.map((label) => {
          const isActive =
            (label === "B" && selectedTextStyle.fontWeight >= 600) ||
            (label === "I" && selectedTextStyle.fontStyle === "italic") ||
            (label === "U" &&
              selectedTextStyle.textDecoration === "underline") ||
            (label === "S" && selectedTextStyle.textDecoration === "underline");

          return (
            <button
              key={label}
              type="button"
              disabled={isTextActionDisabled}
              onClick={() => {
                if (label === "I") onToggleItalic();
                if (label === "B") onToggleBold();
                if (label === "U") onToggleUnderline();
                if (label === "A") onCycleFontFamily();
                if (label === "S") onSetStrikeDecoration();
              }}
              className={`text-lg cursor-pointer rounded-md px-2 py-1 transition-colors ${
                label === "B" ? "font-bold" : "font-medium"
              } ${label === "I" ? "italic" : ""} ${label === "U" ? "underline" : ""} ${
                isActive ? "bg-[#E7F6F3] text-[#0B5368]" : ""
              } ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {label}
            </button>
          );
        })}

        <button type="button" disabled={isTextActionDisabled}>
          <FiLink2 className="h-4 w-4 cursor-pointer" />
        </button>

        <button
          type="button"
          disabled={isTextActionDisabled}
          className="text-lg text-[#252B37]"
        >
          ■
        </button>

        <button
          type="button"
          disabled={isTextActionDisabled}
          onClick={() => onSetTextAlign("left")}
          className={`rounded-md p-1.5 transition-colors ${selectedTextStyle.textAlign === "left" ? "bg-[#E7F6F3] text-[#0B5368]" : ""} ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : ""}`}
        >
          <FiAlignLeft className="h-4 w-4 cursor-pointer" />
        </button>
        <button
          type="button"
          disabled={isTextActionDisabled}
          onClick={() => onSetTextAlign("center")}
          className={`rounded-md p-1.5 transition-colors ${selectedTextStyle.textAlign === "center" ? "bg-[#E7F6F3] text-[#0B5368]" : ""} ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : ""}`}
        >
          <FiAlignCenter className="h-4 w-4 cursor-pointer" />
        </button>
        <button
          type="button"
          disabled={isTextActionDisabled}
          onClick={() => onSetTextAlign("right")}
          className={`rounded-md p-1.5 transition-colors ${selectedTextStyle.textAlign === "right" ? "bg-[#E7F6F3] text-[#0B5368]" : ""} ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : ""}`}
        >
          <FiAlignRight className="h-4 w-4 cursor-pointer" />
        </button>
        <button
          type="button"
          disabled={isTextActionDisabled}
          onClick={() => onSetTextAlign("justify")}
          className={`rounded-md p-1.5 transition-colors ${selectedTextStyle.textAlign === "justify" ? "bg-[#E7F6F3] text-[#0B5368]" : ""} ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : ""}`}
        >
          <FiAlignJustify className="h-4 w-4 cursor-pointer" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-8">
        <button
          type="button"
          disabled={isTextActionDisabled}
          onClick={onToggleColorPanel}
          className={`flex flex-col items-center gap-2 text-[#111827] ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
        >
          <span
            className="h-7 w-7 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, #FF6B6B, #F9C74F, #43AA8B, #4D96FF, #9B5DE5, #FF6B6B)",
            }}
          />
          <span className="text-sm">Color</span>
        </button>

        <button
          type="button"
          disabled={isTextActionDisabled}
          className="flex flex-col items-center gap-2 text-[#111827] cursor-pointer"
          onClick={onSelectTextField}
        >
          <FiType className="h-6 w-6" />
          <span className="text-sm">Text</span>
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={isTextActionDisabled}
            onClick={onCycleFontFamily}
            className={`flex h-11 items-center gap-2 rounded-[12px] border border-[#E2E8F0] px-4 text-[#667085] ${isTextActionDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
          >
            {selectedTextStyle.fontFamily.split(",")[0]}
            <FiChevronDown className="h-4 w-4 cursor-pointer" />
          </button>

          <div className="flex h-11 items-center rounded-[12px] border border-[#E2E8F0] px-3 text-[#667085]">
            <button
              type="button"
              disabled={isTextActionDisabled}
              className="px-1"
              onClick={() => onUpdateFontSize(-2)}
            >
              <FiMinus className="h-4 w-4 cursor-pointer" />
            </button>
            <span className="min-w-10 text-center">
              {selectedTextStyle.fontSize}
            </span>
            <button
              type="button"
              disabled={isTextActionDisabled}
              className="px-1"
              onClick={() => onUpdateFontSize(2)}
            >
              <FiPlus className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {certificateCustomization.logoImage ||
      certificateCustomization.signatureImage ? (
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#516170]">
          {certificateCustomization.logoImage ? (
            <button
              type="button"
              onClick={onRemoveLogo}
              className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFC] px-3 py-2 text-[#D14343] cursor-pointer"
            >
              <FiTrash2 className="h-4 w-4 cursor-pointer" />
              Remove Logo
            </button>
          ) : null}

          {certificateCustomization.signatureImage ? (
            <button
              type="button"
              onClick={onRemoveSignature}
              className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFC] px-3 py-2 text-[#D14343] cursor-pointer"
            >
              <FiTrash2 className="h-4 w-4 cursor-pointer" />
              Remove Signature
            </button>
          ) : null}
        </div>
      ) : null}

      <Button
        variant="darkBlue"
        className="mt-2 w-full  rounded-[14px] py-4 text-base"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Certificate"}
      </Button>
    </div>
  );
}
