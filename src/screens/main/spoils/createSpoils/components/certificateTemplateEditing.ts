/* eslint-disable max-lines */
import {
  CertificateAssetPlacement,
  CertificateCustomization,
  CertificateElementOverride,
  CertificateTextField,
} from "@spt/store/createSpoilStore";

export interface EditableCertificateElementSelection {
  id: string;
  text: string;
  style: CertificateTextField;
}

export interface EditableCertificateElementRecord {
  id: string;
  element: HTMLElement;
}

const SKIPPED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "PATH",
  "IMG",
  "CANVAS",
  "VIDEO",
  "AUDIO",
]);

const DEFAULT_TEXT_STYLE: CertificateTextField = {
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

export const getEditableElements = (
  doc: Document,
): EditableCertificateElementRecord[] => {
  const elements: EditableCertificateElementRecord[] = [];
  const seen = new Set<HTMLElement>();
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let index = 0;

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const rawText = textNode.textContent ?? "";

    if (!rawText.trim()) {
      continue;
    }

    const parent = textNode.parentElement;

    if (!parent || seen.has(parent) || SKIPPED_TAGS.has(parent.tagName)) {
      continue;
    }

    if (parent.closest("svg, script, style, noscript")) {
      continue;
    }

    const childElements = Array.from(parent.children).filter(
      (child) => child.tagName !== "BR",
    );

    if (childElements.length > 0) {
      continue;
    }

    const id = `certificate-editable-${index}`;
    parent.dataset.certificateEditableId = id;
    seen.add(parent);
    elements.push({ id, element: parent });
    index += 1;
  }

  return elements;
};

const parseFontWeight = (value: string): number => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  return value === "bold" ? 700 : 400;
};

const parseLineHeight = (value: string, fontSize: number): number => {
  if (!value || value === "normal") {
    return DEFAULT_TEXT_STYLE.lineHeight;
  }

  if (value.endsWith("px")) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && fontSize > 0
      ? parsed / fontSize
      : DEFAULT_TEXT_STYLE.lineHeight;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : DEFAULT_TEXT_STYLE.lineHeight;
};

const normalizeTextAlign = (
  value: string,
): CertificateTextField["textAlign"] => {
  if (
    value === "left" ||
    value === "center" ||
    value === "right" ||
    value === "justify"
  ) {
    return value;
  }

  return "left";
};

export const getSelectionFromElement = (
  element: HTMLElement,
): EditableCertificateElementSelection => {
  const computedStyle =
    element.ownerDocument.defaultView?.getComputedStyle(element);
  const fontSize = Number.parseFloat(
    computedStyle?.fontSize ?? `${DEFAULT_TEXT_STYLE.fontSize}`,
  );

  return {
    id: element.dataset.certificateEditableId ?? "",
    text: element.innerText,
    style: {
      text: element.innerText,
      color: computedStyle?.color || DEFAULT_TEXT_STYLE.color,
      fontFamily: computedStyle?.fontFamily || DEFAULT_TEXT_STYLE.fontFamily,
      fontSize: Number.isFinite(fontSize)
        ? fontSize
        : DEFAULT_TEXT_STYLE.fontSize,
      fontWeight: parseFontWeight(
        computedStyle?.fontWeight ?? `${DEFAULT_TEXT_STYLE.fontWeight}`,
      ),
      fontStyle: computedStyle?.fontStyle === "italic" ? "italic" : "normal",
      textDecoration: computedStyle?.textDecorationLine?.includes("underline")
        ? "underline"
        : "none",
      textAlign: normalizeTextAlign(
        computedStyle?.textAlign ?? DEFAULT_TEXT_STYLE.textAlign,
      ),
      lineHeight: parseLineHeight(
        computedStyle?.lineHeight ?? `${DEFAULT_TEXT_STYLE.lineHeight}`,
        fontSize,
      ),
    },
  };
};

export const applyOverrideToElement = (
  element: HTMLElement,
  override?: CertificateElementOverride,
) => {
  if (!override) {
    return;
  }

  if (
    typeof override.text === "string" &&
    override.text !== element.innerText
  ) {
    element.innerText = override.text;
  }

  if (override.color && element.style.color !== override.color) {
    element.style.color = override.color;
  }

  if (override.fontFamily && element.style.fontFamily !== override.fontFamily) {
    element.style.fontFamily = override.fontFamily;
  }

  if (
    typeof override.fontSize === "number" &&
    element.style.fontSize !== `${override.fontSize}px`
  ) {
    element.style.fontSize = `${override.fontSize}px`;
  }

  if (
    typeof override.fontWeight === "number" &&
    element.style.fontWeight !== `${override.fontWeight}`
  ) {
    element.style.fontWeight = `${override.fontWeight}`;
  }

  if (override.fontStyle && element.style.fontStyle !== override.fontStyle) {
    element.style.fontStyle = override.fontStyle;
  }

  if (
    override.textDecoration &&
    element.style.textDecoration !== override.textDecoration
  ) {
    element.style.textDecoration = override.textDecoration;
  }

  if (override.textAlign && element.style.textAlign !== override.textAlign) {
    element.style.textAlign = override.textAlign;
  }

  if (
    typeof override.lineHeight === "number" &&
    element.style.lineHeight !== `${override.lineHeight}`
  ) {
    element.style.lineHeight = `${override.lineHeight}`;
  }
};

export const serializeCertificateMarkup = (
  markup: string,
  overrides: Record<string, CertificateElementOverride> = {},
  assets?: Pick<
    CertificateCustomization,
    "logoImage" | "signatureImage" | "logoPlacement" | "signaturePlacement"
  >,
) => {
  if (!markup || typeof window === "undefined") {
    return markup;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(markup, "text/html");
  const editableElements = getEditableElements(doc);

  editableElements.forEach(({ id, element }) => {
    applyOverrideToElement(element, overrides[id]);
  });

  embedCertificateAsset(doc, "logo", assets?.logoImage, assets?.logoPlacement);
  embedCertificateAsset(
    doc,
    "signature",
    assets?.signatureImage,
    assets?.signaturePlacement,
  );

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

interface ExtractedCertificateAssets {
  cleanedMarkup: string;
  assets: Pick<
    CertificateCustomization,
    "logoImage" | "signatureImage" | "logoPlacement" | "signaturePlacement"
  >;
}

const ensureBodyPositioning = (body: HTMLElement) => {
  const currentPosition = body.style.position?.trim().toLowerCase();
  if (!currentPosition || currentPosition === "static") {
    body.style.position = "relative";
  }
};

const removeExistingEmbeddedAsset = (doc: Document, asset: "logo" | "signature") => {
  doc
    .querySelectorAll(`[data-certificate-embedded-asset="${asset}"]`)
    .forEach((node) => node.remove());
};

const applyAssetPlacementStyles = (
  element: HTMLElement,
  placement: CertificateAssetPlacement,
) => {
  element.style.position = "absolute";
  element.style.left = `${placement.left}%`;
  element.style.top = `${placement.top}%`;
  element.style.width = `${placement.width}%`;
  element.style.height = `${placement.height}%`;
  element.style.zIndex = "20";
  element.style.pointerEvents = "none";
};

const embedCertificateAsset = (
  doc: Document,
  asset: "logo" | "signature",
  image: string | null | undefined,
  placement?: CertificateAssetPlacement,
) => {
  removeExistingEmbeddedAsset(doc, asset);

  if (!image || !placement || !doc.body) {
    return;
  }

  ensureBodyPositioning(doc.body);

  const wrapper = doc.createElement("div");
  wrapper.dataset.certificateEmbeddedAsset = asset;
  applyAssetPlacementStyles(wrapper, placement);

  const img = doc.createElement("img");
  img.src = image;
  img.alt = `Certificate ${asset}`;
  img.draggable = false;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.display = "block";

  wrapper.appendChild(img);
  doc.body.appendChild(wrapper);
};

interface SelectionOffsets {
  start: number;
  end: number;
}

const getTextNodes = (element: HTMLElement): Text[] => {
  const textNodes: Text[] = [];
  const walker = element.ownerDocument.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    }
  }

  return textNodes;
};

const getNodeOffset = (element: HTMLElement, node: Node, offset: number) => {
  const textNodes = getTextNodes(element);
  let currentOffset = 0;

  for (const textNode of textNodes) {
    if (textNode === node) {
      return currentOffset + offset;
    }

    currentOffset += textNode.textContent?.length ?? 0;
  }

  return currentOffset;
};

const parsePlacementPercentage = (
  value: string,
  fallback: number,
): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const extractEmbeddedCertificateAssets = (
  markup: string,
  fallbackAssets: Pick<
    CertificateCustomization,
    "logoPlacement" | "signaturePlacement"
  >,
): ExtractedCertificateAssets => {
  if (!markup || typeof window === "undefined") {
    return {
      cleanedMarkup: markup,
      assets: {
        logoImage: null,
        signatureImage: null,
        logoPlacement: fallbackAssets.logoPlacement,
        signaturePlacement: fallbackAssets.signaturePlacement,
      },
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(markup, "text/html");

  const readAsset = (asset: "logo" | "signature") => {
    const fallbackPlacement =
      asset === "logo"
        ? fallbackAssets.logoPlacement
        : fallbackAssets.signaturePlacement;
    const wrapper = doc.querySelector<HTMLElement>(
      `[data-certificate-embedded-asset="${asset}"]`,
    );
    const image = wrapper?.querySelector("img")?.getAttribute("src") ?? null;

    if (!wrapper) {
      return {
        image,
        placement: fallbackPlacement,
      };
    }

    return {
      image,
      placement: {
        left: parsePlacementPercentage(wrapper.style.left, fallbackPlacement.left),
        top: parsePlacementPercentage(wrapper.style.top, fallbackPlacement.top),
        width: parsePlacementPercentage(
          wrapper.style.width,
          fallbackPlacement.width,
        ),
        height: parsePlacementPercentage(
          wrapper.style.height,
          fallbackPlacement.height,
        ),
      },
    };
  };

  const logo = readAsset("logo");
  const signature = readAsset("signature");

  removeExistingEmbeddedAsset(doc, "logo");
  removeExistingEmbeddedAsset(doc, "signature");

  return {
    cleanedMarkup: `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`,
    assets: {
      logoImage: logo.image,
      signatureImage: signature.image,
      logoPlacement: logo.placement,
      signaturePlacement: signature.placement,
    },
  };
};

export const getSelectionOffsets = (
  element: HTMLElement,
): SelectionOffsets | null => {
  const selection = element.ownerDocument.defaultView?.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (
    !element.contains(range.startContainer) ||
    !element.contains(range.endContainer)
  ) {
    return null;
  }

  return {
    start: getNodeOffset(element, range.startContainer, range.startOffset),
    end: getNodeOffset(element, range.endContainer, range.endOffset),
  };
};

export const restoreSelectionOffsets = (
  element: HTMLElement,
  offsets: SelectionOffsets | null,
) => {
  if (!offsets) {
    return;
  }

  const selection = element.ownerDocument.defaultView?.getSelection();

  if (!selection) {
    return;
  }

  const textNodes = getTextNodes(element);
  const range = element.ownerDocument.createRange();

  if (textNodes.length === 0) {
    range.selectNodeContents(element);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }

  const resolvePosition = (targetOffset: number) => {
    let remaining = Math.max(0, targetOffset);

    for (const textNode of textNodes) {
      const nodeLength = textNode.textContent?.length ?? 0;
      if (remaining <= nodeLength) {
        return { node: textNode, offset: remaining };
      }

      remaining -= nodeLength;
    }

    const lastNode = textNodes[textNodes.length - 1];
    return {
      node: lastNode,
      offset: lastNode.textContent?.length ?? 0,
    };
  };

  const start = resolvePosition(offsets.start);
  const end = resolvePosition(offsets.end);

  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  selection.removeAllRanges();
  selection.addRange(range);
};
