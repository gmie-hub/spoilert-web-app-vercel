import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  CertificateAssetPlacement,
  CertificateElementOverride,
} from "@spt/store/createSpoilStore";

import {
  EditableCertificateElementRecord,
  EditableCertificateElementSelection,
  applyOverrideToElement,
  getEditableElements,
  getSelectionFromElement,
  getSelectionOffsets,
  restoreSelectionOffsets,
} from "./certificateTemplateEditing";

interface CertificateTemplatePreviewProps {
  markup: string;
  title: string;
  logoImage?: string | null;
  signatureImage?: string | null;
  logoPlacement?: CertificateAssetPlacement;
  signaturePlacement?: CertificateAssetPlacement;
  outerClassName?: string;
  canvasClassName?: string;
  transform?: string;
  children?: ReactNode;
  /** When true, the canvas fills the container width and preserves A4 aspect ratio instead of using fixed pixel dimensions. */
  useResponsiveScaling?: boolean;
  editableElementOverrides?: Record<string, CertificateElementOverride>;
  onSelectEditableElement?: (
    selection: EditableCertificateElementSelection | null,
  ) => void;
  onUpdateEditableElement?: (
    elementId: string,
    updates: CertificateElementOverride,
  ) => void;
  onUpdateAssetPlacement?: (
    asset: "logo" | "signature",
    placement: Partial<CertificateAssetPlacement>,
  ) => void;
}

export default function CertificateTemplatePreview({
  markup,
  title,
  logoImage,
  signatureImage,
  logoPlacement,
  signaturePlacement,
  outerClassName = "relative overflow-hidden bg-[#F8FAFC]",
  canvasClassName = "absolute left-1/2 top-1/2 h-[842px] w-[520px] -translate-x-1/2 -translate-y-1/2 origin-top-left overflow-hidden rounded-[6px] bg-white shadow-sm",
  transform,
  children,
  useResponsiveScaling = false,
  editableElementOverrides,
  onSelectEditableElement,
  onUpdateEditableElement,
  onUpdateAssetPlacement,
}: CertificateTemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const editableElementsRef = useRef<EditableCertificateElementRecord[]>([]);
  const selectedElementIdRef = useRef<string | null>(null);
  const selectionOffsetsRef = useRef<{ start: number; end: number } | null>(
    null,
  );
  const onSelectEditableElementRef = useRef(onSelectEditableElement);
  const onUpdateEditableElementRef = useRef(onUpdateEditableElement);

  useEffect(() => {
    onSelectEditableElementRef.current = onSelectEditableElement;
    onUpdateEditableElementRef.current = onUpdateEditableElement;
  }, [onSelectEditableElement, onUpdateEditableElement]);

  const isInteractive = useMemo(
    () => Boolean(onSelectEditableElement && onUpdateEditableElement),
    [onSelectEditableElement, onUpdateEditableElement],
  );

  const handleAssetPointerDown = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
      asset: "logo" | "signature",
      placement?: CertificateAssetPlacement,
    ) => {
      if (!canvasRef.current || !placement || !onUpdateAssetPlacement) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const target = event.currentTarget;
      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();
      const pointerId = event.pointerId;
      const startOffsetX = event.clientX - canvasRect.left;
      const startOffsetY = event.clientY - canvasRect.top;
      const widthPx = (placement.width / 100) * canvasRect.width;
      const heightPx = (placement.height / 100) * canvasRect.height;
      const pointerInsideAssetX =
        startOffsetX - (placement.left / 100) * canvasRect.width;
      const pointerInsideAssetY =
        startOffsetY - (placement.top / 100) * canvasRect.height;

      target.setPointerCapture(pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const currentX = moveEvent.clientX - canvasRect.left;
        const currentY = moveEvent.clientY - canvasRect.top;
        const nextLeftPx = Math.min(
          Math.max(0, currentX - pointerInsideAssetX),
          canvasRect.width - widthPx,
        );
        const nextTopPx = Math.min(
          Math.max(0, currentY - pointerInsideAssetY),
          canvasRect.height - heightPx,
        );

        onUpdateAssetPlacement(asset, {
          left: Number(((nextLeftPx / canvasRect.width) * 100).toFixed(2)),
          top: Number(((nextTopPx / canvasRect.height) * 100).toFixed(2)),
        });
      };

      const handlePointerUp = () => {
        target.releasePointerCapture(pointerId);
        target.removeEventListener("pointermove", handlePointerMove);
        target.removeEventListener("pointerup", handlePointerUp);
        target.removeEventListener("pointercancel", handlePointerUp);
      };

      target.addEventListener("pointermove", handlePointerMove);
      target.addEventListener("pointerup", handlePointerUp);
      target.addEventListener("pointercancel", handlePointerUp);
    },
    [onUpdateAssetPlacement],
  );

  const renderDraggableAsset = useCallback(
    (
      asset: "logo" | "signature",
      image: string | null | undefined,
      placement?: CertificateAssetPlacement,
    ) => {
      if (!image || !placement) {
        return null;
      }

      return (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Drag ${asset}`}
          onPointerDown={(event) =>
            handleAssetPointerDown(event, asset, placement)
          }
          className="absolute z-20 cursor-grab touch-none rounded-sm border border-transparent transition hover:border-[#0B5368]/35 active:cursor-grabbing"
          style={{
            left: `${placement.left}%`,
            top: `${placement.top}%`,
            width: `${placement.width}%`,
            height: `${placement.height}%`,
          }}
        >
          <img
            src={image}
            alt={`Certificate ${asset}`}
            className="pointer-events-none h-full w-full object-contain"
            draggable={false}
          />
        </div>
      );
    },
    [handleAssetPointerDown],
  );

  const applySelectionState = useCallback((selectedId: string | null) => {
    editableElementsRef.current.forEach(({ id, element }) => {
      const isSelected = id === selectedId;
      element.dataset.certificateSelected = isSelected ? "true" : "false";
      element.contentEditable = "true";
      element.spellcheck = false;
    });
  }, []);

  const selectElement = useCallback(
    (elementId: string | null) => {
      selectedElementIdRef.current = elementId;
      applySelectionState(elementId);

      if (!onSelectEditableElementRef.current) {
        return;
      }

      if (!elementId) return onSelectEditableElementRef.current(null);

      const match = editableElementsRef.current.find(({ id }) => id === elementId);
      onSelectEditableElementRef.current(
        match ? getSelectionFromElement(match.element) : null,
      );
    },
    [applySelectionState],
  );

  const handleIframeLoad = useCallback(() => {
    if (!isInteractive) {
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;

      if (!iframe || !doc?.body) return;

    const styleTag = doc.createElement("style");
    styleTag.textContent = `
      [data-certificate-editable-id] {
        cursor: text;
        outline: 1px solid transparent;
        outline-offset: 2px;
      }

      [data-certificate-editable-id][data-certificate-selected="true"] {
        outline-color: rgba(11, 83, 104, 0.45);
        background: rgba(11, 83, 104, 0.04);
      }
    `;
    doc.head.appendChild(styleTag);

    editableElementsRef.current = getEditableElements(doc);
    editableElementsRef.current.forEach(({ id, element }) => {
      applyOverrideToElement(element, editableElementOverrides?.[id]);

      const syncSelectionOffsets = () => {
        if (selectedElementIdRef.current === id) {
          selectionOffsetsRef.current = getSelectionOffsets(element);
        }
      };

      element.addEventListener("focus", () => {
        selectElement(id);
        syncSelectionOffsets();
      });

      element.addEventListener("click", () => {
        selectElement(id);
        syncSelectionOffsets();
      });

      element.addEventListener("mouseup", syncSelectionOffsets);
      element.addEventListener("keyup", syncSelectionOffsets);

      element.addEventListener("keydown", (event) => {
        syncSelectionOffsets();

        if (event.key === "Enter") {
          event.preventDefault();
        }
      });

      element.addEventListener("paste", (event) => {
        event.preventDefault();
        const text = event.clipboardData?.getData("text/plain") ?? "";

        const selection = element.ownerDocument.defaultView?.getSelection();
        if (selection?.rangeCount) {
          selection.deleteFromDocument();
          selection
            .getRangeAt(0)
            .insertNode(element.ownerDocument.createTextNode(text));
          selection.collapseToEnd();
        }

        selectionOffsetsRef.current = getSelectionOffsets(element);
        onUpdateEditableElementRef.current?.(id, { text: element.innerText });
        onSelectEditableElementRef.current?.(getSelectionFromElement(element));
      });

      element.addEventListener("input", () => {
        selectionOffsetsRef.current = getSelectionOffsets(element);
        onUpdateEditableElementRef.current?.(id, { text: element.innerText });
        onSelectEditableElementRef.current?.(getSelectionFromElement(element));
      });
    });

    applySelectionState(selectedElementIdRef.current);
  }, [
    applySelectionState,
    editableElementOverrides,
    isInteractive,
    onSelectEditableElement,
    onUpdateEditableElement,
    selectElement,
  ]);

  useEffect(() => {
    if (!isInteractive) {
      return;
    }

    editableElementsRef.current.forEach(({ id, element }) => {
      applyOverrideToElement(element, editableElementOverrides?.[id]);

      if (
        id === selectedElementIdRef.current &&
        element.ownerDocument.activeElement === element
      ) {
        restoreSelectionOffsets(element, selectionOffsetsRef.current);
      }
    });

    if (selectedElementIdRef.current) {
      const selectedElement = editableElementsRef.current.find(
        ({ id }) => id === selectedElementIdRef.current,
      );

      if (selectedElement) {
        onSelectEditableElementRef.current?.(
          getSelectionFromElement(selectedElement.element),
        );
      }
    }
  }, [editableElementOverrides, isInteractive]);

  if (useResponsiveScaling) {
    return (
      <div className={`w-full ${outerClassName}`}>
        <div
          ref={canvasRef}
          className="relative w-full overflow-hidden bg-white"
          style={{ aspectRatio: "595 / 842" }}
        >
          <iframe
            ref={iframeRef}
            title={title}
            srcDoc={markup}
            sandbox={
              isInteractive
                ? "allow-same-origin allow-scripts"
                : "allow-scripts"
            }
            onLoad={handleIframeLoad}
            className={`absolute inset-0 h-full w-full border-0 bg-white ${
              isInteractive ? "pointer-events-auto" : "pointer-events-none"
            }`}
          />

          {renderDraggableAsset("logo", logoImage, logoPlacement)}
          {renderDraggableAsset(
            "signature",
            signatureImage,
            signaturePlacement,
          )}

          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${outerClassName}`}>
      <div
        ref={canvasRef}
        className={canvasClassName}
        style={transform ? { transform } : undefined}
      >
        <iframe
          ref={iframeRef}
          title={title}
          srcDoc={markup}
          sandbox={
            isInteractive ? "allow-same-origin allow-scripts" : "allow-scripts"
          }
          onLoad={handleIframeLoad}
          className={`h-full w-full border-0 bg-white ${
            isInteractive ? "pointer-events-auto" : "pointer-events-none"
          }`}
        />

        {renderDraggableAsset("logo", logoImage, logoPlacement)}
        {renderDraggableAsset("signature", signatureImage, signaturePlacement)}

        {children}
      </div>
    </div>
  );
}
