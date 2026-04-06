"use client";

import { ChangeEvent, useCallback, useRef, useState } from "react";

import Image from "next/image";

import brushIcon from "@spt/assets/icons/brush.svg";
import documentUploadIcon from "@spt/assets/icons/document-upload.svg";
import Button from "@spt/components/button";
import {
  CertificateAssetPlacement,
  CertificateCustomization,
  CertificateElementOverride,
  CertificateTextField,
  SelectedCertificateTemplate,
} from "@spt/store/createSpoilStore";

import CertificateColorPanel from "./CertificateColorPanel";
import {
  DEFAULT_COLORS,
  DESIGN_COLORS,
  FONT_OPTIONS,
  TOOLBAR_TEXT_ACTIONS,
} from "./certificateCustomizationConfig";
import CertificateCustomizationControls from "./CertificateCustomizationControls";
import CertificateTemplatePreview from "./CertificateTemplatePreview";
import SignatureUploadModal from "./SignatureUploadModal";

interface CertificateCustomizationWorkspaceProps {
  certificateTemplate: SelectedCertificateTemplate;
  certificateCustomization: CertificateCustomization;
  onUpdateCustomization: (
    customization: Partial<CertificateCustomization>,
  ) => void;
  onUpdateTextElement: (
    elementId: string,
    updates: CertificateElementOverride,
  ) => void;
  onSave: () => void;
}

const DEFAULT_SELECTED_TEXT_STYLE: CertificateTextField = {
  text: "",
  color: "#111827",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 16,
  fontWeight: 400,
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  lineHeight: 1.2,
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file."));
    };

    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });

export default function CertificateCustomizationWorkspace({
  certificateTemplate,
  certificateCustomization,
  onUpdateCustomization,
  onUpdateTextElement,
  onSave,
}: CertificateCustomizationWorkspaceProps) {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureDraft, setSignatureDraft] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [selectedTextStyle, setSelectedTextStyle] =
    useState<CertificateTextField>(DEFAULT_SELECTED_TEXT_STYLE);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const signatureInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelection = async (
    file: File | undefined,
    onSuccess: (value: string) => void,
  ) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAssetError("Please upload an image file.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAssetError(null);
      onSuccess(dataUrl);
    } catch {
      setAssetError("We could not read that file. Try again.");
    }
  };

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleImageSelection(event.target.files?.[0], (value) => {
      onUpdateCustomization({ logoImage: value });
    });

    event.target.value = "";
  };

  const handleSignatureChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    await handleImageSelection(event.target.files?.[0], (value) => {
      setSignatureDraft(value);
    });

    event.target.value = "";
  };

  const openSignatureModal = () => {
    setSignatureDraft(certificateCustomization.signatureImage);
    setIsSignatureModalOpen(true);
  };

  const handleSaveSignature = () => {
    onUpdateCustomization({ signatureImage: signatureDraft });
    setIsSignatureModalOpen(false);
  };

  const handleSelectedElementUpdate = (updates: CertificateElementOverride) => {
    if (!selectedElementId) {
      return;
    }

    onUpdateTextElement(selectedElementId, updates);
  };

  const applyColor = (color: string) => {
    handleSelectedElementUpdate({ color });
  };

  const updateFontSize = (delta: number) => {
    const nextFontSize = Math.max(8, selectedTextStyle.fontSize + delta);
    handleSelectedElementUpdate({ fontSize: nextFontSize });
  };

  const toggleBold = () => {
    handleSelectedElementUpdate({
      fontWeight: selectedTextStyle.fontWeight >= 600 ? 400 : 700,
    });
  };

  const toggleItalic = () => {
    handleSelectedElementUpdate({
      fontStyle:
        selectedTextStyle.fontStyle === "italic" ? "normal" : "italic",
    });
  };

  const toggleUnderline = () => {
    handleSelectedElementUpdate({
      textDecoration:
        selectedTextStyle.textDecoration === "underline"
          ? "none"
          : "underline",
    });
  };

  const cycleFontFamily = () => {
    const currentIndex = FONT_OPTIONS.indexOf(selectedTextStyle.fontFamily);
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % FONT_OPTIONS.length : 0;
    handleSelectedElementUpdate({
      fontFamily: FONT_OPTIONS[nextIndex],
    });
  };

  const setTextAlign = (textAlign: CertificateTextField["textAlign"]) => {
    handleSelectedElementUpdate({ textAlign });
  };

  const handleAssetPlacementUpdate = useCallback(
    (
      asset: "logo" | "signature",
      placement: Partial<CertificateAssetPlacement>,
    ) => {
      if (asset === "logo") {
        onUpdateCustomization({
          logoPlacement: {
            ...certificateCustomization.logoPlacement,
            ...placement,
          },
        });
        return;
      }

      onUpdateCustomization({
        signaturePlacement: {
          ...certificateCustomization.signaturePlacement,
          ...placement,
        },
      });
    },
    [
      certificateCustomization.logoPlacement,
      certificateCustomization.signaturePlacement,
      onUpdateCustomization,
    ],
  );

  const handleElementSelection = useCallback(
    (
      selection: {
        id: string;
        style: CertificateTextField;
      } | null,
    ) => {
      setSelectedElementId(selection?.id ?? null);
      setSelectedTextStyle(selection?.style ?? DEFAULT_SELECTED_TEXT_STYLE);
    },
    [],
  );

  return (
    <>
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />

      {assetError ? (
        <div className="mt-6 rounded-2xl border border-[#F3D2D2] bg-[#FFF7F7] px-5 py-4 text-sm text-[#9B1C1C]">
          {assetError}
        </div>
      ) : null}

      <div className="mt-8 lg:relative">
        {showColorPanel ? (
          <CertificateColorPanel
            designColors={DESIGN_COLORS}
            defaultColors={DEFAULT_COLORS}
            selectedColor={selectedTextStyle.color}
            onApplyColor={applyColor}
            onClose={() => setShowColorPanel(false)}
          />
        ) : null}

        <div className="mx-auto max-w-[700px]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-[14px] border-[#D9DFE5] px-5 text-[#0B5368]"
                iconLeft={
                  <Image
                    src={documentUploadIcon.src}
                    alt="Upload Logo"
                    width={20}
                    height={20}
                  />
                }
                onClick={() => logoInputRef.current?.click()}
              >
                {certificateCustomization.logoImage
                  ? "Edit Logo"
                  : "Upload Logo"}
              </Button>

              <Button
                variant="outline"
                className="h-12 rounded-[14px] border-[#D9DFE5] px-5 text-[#0B5368]"
                iconLeft={
                  <Image
                    src={brushIcon.src}
                    alt="Edit Signature"
                    width={20}
                    height={20}
                  />
                }
                onClick={openSignatureModal}
              >
                {certificateCustomization.signatureImage
                  ? "Edit Signature"
                  : "Add Signature"}
              </Button>
            </div>
          </div>

          <div className="w-full">
            <CertificateTemplatePreview
              markup={certificateTemplate.templateContent}
              title={`${certificateTemplate.name} preview`}
              logoImage={certificateCustomization.logoImage}
              signatureImage={certificateCustomization.signatureImage}
              logoPlacement={certificateCustomization.logoPlacement}
              signaturePlacement={certificateCustomization.signaturePlacement}
              editableElementOverrides={certificateCustomization.elementOverrides}
              onSelectEditableElement={handleElementSelection}
              onUpdateEditableElement={onUpdateTextElement}
              onUpdateAssetPlacement={handleAssetPlacementUpdate}
              outerClassName="relative w-full overflow-hidden bg-white"
              useResponsiveScaling
            />
          </div>

          <CertificateCustomizationControls
            certificateCustomization={certificateCustomization}
            hasSelectedText={Boolean(selectedElementId)}
            selectedTextStyle={selectedTextStyle}
            toolbarTextActions={TOOLBAR_TEXT_ACTIONS}
            onToggleItalic={toggleItalic}
            onToggleBold={toggleBold}
            onCycleFontFamily={cycleFontFamily}
            onToggleUnderline={toggleUnderline}
            onSetStrikeDecoration={() => {
              handleSelectedElementUpdate({
                textDecoration:
                  selectedTextStyle.textDecoration === "none"
                    ? "underline"
                    : "none",
              });
            }}
            onSetTextAlign={setTextAlign}
            onToggleColorPanel={() => setShowColorPanel((current) => !current)}
            onSelectTextField={() => undefined}
            onUpdateFontSize={updateFontSize}
            onRemoveLogo={() => onUpdateCustomization({ logoImage: null })}
            onRemoveSignature={() =>
              onUpdateCustomization({ signatureImage: null })
            }
            onSave={onSave}
          />
        </div>
      </div>

      <SignatureUploadModal
        open={isSignatureModalOpen}
        signatureDraft={signatureDraft}
        signatureInputRef={signatureInputRef}
        onFileChange={handleSignatureChange}
        onClose={() => setIsSignatureModalOpen(false)}
        onClear={() => setSignatureDraft(null)}
        onSave={handleSaveSignature}
      />
    </>
  );
}
