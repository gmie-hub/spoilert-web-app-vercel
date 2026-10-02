interface CertificateValues {
  recipientName?: string;
  courseName?: string;
  instructorName?: string;
  certificateId?: string;
  /** When the certificate was issued (`generated_at` from the API). */
  issuedAt?: string | null;
  /** Verification link the certificate's QR code should encode. */
  verifyUrl?: string | null;
}

// Render a scannable QR that points at the certificate's verification page.
// We use a zero-dependency image service so the QR works both in the preview
// iframe and in the printed/downloaded document.
const buildQrImageSrc = (verifyUrl: string) =>
  // Request a high-resolution QR (rendered small on screen) so it stays crisp
  // and scannable when the certificate is printed / saved as a PDF.
  `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=0&data=${encodeURIComponent(
    verifyUrl,
  )}`;

// The QR node in the badge could be an <img>, a placeholder <canvas>/<svg>, or
// a <picture>. Look for them in priority order (a real <img> first) so we don't
// accidentally grab a decorative icon.
const findQrVisual = (root: Element): Element | null => {
  for (const selector of ["img", "canvas", "svg", "picture"]) {
    const found = root.querySelector(selector);
    if (found) return found;
  }
  return null;
};

// Point a QR node at the encoded verification link. For an <img> we just swap
// its src; other node types are replaced with an <img> carrying over the
// designer's sizing so it keeps the same footprint in the badge.
const applyQrToVisual = (
  doc: Document,
  node: Element,
  qrSrc: string,
  verifyUrl: string,
) => {
  let image: HTMLImageElement;

  if (node.tagName === "IMG") {
    image = node as HTMLImageElement;
    image.removeAttribute("srcset");
    // crossorigin lets the PDF capture (html2canvas) read the QR without
    // tainting the canvas; the QR service returns permissive CORS headers.
    image.setAttribute("crossorigin", "anonymous");
    image.setAttribute("src", qrSrc);
  } else {
    image = doc.createElement("img");
    image.alt = "Certificate verification QR code";
    image.crossOrigin = "anonymous";
    image.src = qrSrc;

    const original = node as HTMLElement;
    const className = original.getAttribute?.("class");
    if (className) image.setAttribute("class", className);
    if (original.style?.width) image.style.width = original.style.width;
    if (original.style?.height) image.style.height = original.style.height;

    node.replaceWith(image);
  }

  // A <picture>'s <source> siblings take priority over the <img src> we just
  // set — if we leave them in place the browser keeps showing the template's
  // original placeholder instead of the real QR. Drop them so our src wins.
  const picture = image.closest("picture");
  if (picture) {
    picture.querySelectorAll("source").forEach((source) => source.remove());
  }

  // The QR-service image is 240px, so when the template didn't size the QR
  // explicitly it would render oversized. Give it a modest badge size in that
  // case, and always cap it to its container so it can never dominate the sheet.
  const hasExplicitWidth =
    image.getAttribute("width") !== null ||
    Boolean(image.style.width && image.style.width !== "auto");
  if (!hasExplicitWidth) {
    image.style.width = "100px";
    image.style.height = "100px";
  }
  image.style.maxWidth = "100%";
  image.style.maxHeight = "100%";
  image.style.objectFit = "contain";

  // Scanning uses the encoded pixels, but if the QR is wrapped in a link make
  // that link resolve to the verification page too.
  const anchor = image.closest("a");
  if (anchor) {
    anchor.setAttribute("href", verifyUrl);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  }
};

// Climb up to `maxDepth` ancestors from `start`, returning the first QR-looking
// node found. Used to reach the QR sitting next to the id / "VERIFY" labels.
const findQrVisualNear = (
  start: Element | null,
  maxDepth = 4,
): Element | null => {
  let current: Element | null = start;
  for (let depth = 0; current && depth < maxDepth; depth += 1) {
    const visual = findQrVisual(current);
    if (visual) return visual;
    current = current.parentElement;
  }
  return null;
};

// Encode the verification link into the certificate's existing QR code. The
// badge markup varies by template, so we locate the QR three ways, most
// reliable first:
//   1. An element explicitly marked as the QR (id/class/data contains "qr").
//   2. The QR next to the `certificate_id` placeholder (renders the cert id).
//   3. The QR next to the "VERIFY" label.
// We only ever repoint the QR already in the badge — we never add a second one
// or stretch it across the certificate.
const findQrTarget = (doc: Document): Element | null => {
  const markedHost = doc.querySelector<HTMLElement>(
    '[id*="qr" i], [class*="qr" i], [data-certificate-qr], img[alt*="qr" i]',
  );
  const markedVisual =
    markedHost &&
    (["IMG", "CANVAS", "SVG"].includes(markedHost.tagName)
      ? markedHost
      : findQrVisual(markedHost));
  if (markedVisual) return markedVisual;

  const idAnchor = doc.getElementById("certificate_id");
  const verifyLabel =
    Array.from(doc.querySelectorAll<HTMLElement>("*")).find(
      (element) =>
        element.childElementCount === 0 &&
        (element.textContent || "").trim().toLowerCase().includes("verify"),
    ) ?? null;

  return findQrVisualNear(idAnchor) ?? findQrVisualNear(verifyLabel);
};

const injectQrCode = (doc: Document, verifyUrl?: string | null) => {
  const target = findQrTarget(doc);
  if (!target) return;

  // No real verification link — hide the template's sample QR rather than
  // showing one that verifies nothing.
  if (!verifyUrl) {
    (target as HTMLElement).style.display = "none";
    return;
  }

  applyQrToVisual(doc, target, buildQrImageSrc(verifyUrl), verifyUrl);
};

// Matches a bare id label such as "ID:", "Cert ID", "Certificate ID #".
const ID_LABEL_PATTERN = /^(cert(ificate)?\s*)?id\s*[:#-]?$/i;

// Fill in the certificate id, or — when there's no real id — hide it along
// with its "ID:" label so nothing shows at all.
const applyCertificateId = (doc: Document, certificateId?: string) => {
  const el = doc.getElementById("certificate_id");
  if (!el) return;

  if (certificateId) {
    el.textContent = certificateId;
    return;
  }

  el.textContent = "";
  el.style.display = "none";

  // The "ID:" label is usually a sibling in the same wrapper — hide the
  // wrapper too when the label is all that's left in it.
  const parent = el.parentElement;
  const remainingText = (parent?.textContent || "").trim();
  if (parent && parent !== doc.body && ID_LABEL_PATTERN.test(remainingText)) {
    parent.style.display = "none";
  }
};

// "September 17, 2026" — same format the verify-certificate page shows.
const formatIssueDate = (value?: string | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Placeholder ids templates use for the issue date, most specific first.
const DATE_PLACEHOLDER_IDS = [
  "issue_date",
  "issued_date",
  "date_issued",
  "certificate_date",
  "completion_date",
  "generated_at",
  "date",
];

// A sample date baked into the template, e.g. "January 1, 2025",
// "1 Jan 2025", "01/01/2025" or "2025-01-01".
const SAMPLE_DATE_PATTERN =
  /^(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}(st|nd|rd|th)?\s+\w+,?\s+\d{4}|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{4}-\d{2}-\d{2})$/i;

// Fill in the date the certificate was generated. Prefer an explicit date
// placeholder; otherwise replace the template's hardcoded sample date so it
// never shows a date the learner didn't earn it on.
const applyIssueDate = (doc: Document, issuedAt?: string | null) => {
  const formatted = formatIssueDate(issuedAt);
  if (!formatted) return;

  const placeholder =
    DATE_PLACEHOLDER_IDS.map((id) => doc.getElementById(id)).find(Boolean) ??
    doc.querySelector<HTMLElement>("[data-certificate-date]");
  if (placeholder) {
    placeholder.textContent = formatted;
    return;
  }

  const sampleDate = Array.from(doc.body.querySelectorAll<HTMLElement>("*")).find(
    (element) =>
      element.childElementCount === 0 &&
      SAMPLE_DATE_PATTERN.test((element.textContent || "").trim()),
  );
  if (sampleDate) sampleDate.textContent = formatted;
};

// Marks the single element we stretch to fill the A4 sheet (see below) —
// scoped to one element via a data attribute rather than a broad selector so
// we never touch sibling elements we don't know about.
const A4_ROOT_ATTR = "data-certificate-a4-root";

// A4 in CSS pixels (210mm x 297mm at 96dpi) — the same canvas the on-screen
// preview renders the certificate at.
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

// A4 portrait override so the certificate fills the full sheet instead of
// sitting as a small centered card on the template's own background.
// The print rules make "Save as PDF" match the preview: one borderless A4
// page, with background colours kept (browsers drop them when printing
// unless told otherwise, which would blank out dark templates).
// The sheet is sized in absolute A4 units, never `100%` / `100vh`: on a phone
// those resolve to the narrow, tall screen, so the text reflowed into a long
// strip that printed across two pages.
// <html> is left to size itself around <body>. Templates' own print rules
// often pin it to 297mm, and the fit-to-page zoom below only shrinks <body>,
// so on a smaller printable area (Safari, which ignores @page) the leftover
// <html> height printed as a second page.
const A4_FULL_PAGE_CSS = `
  @page { size: A4; margin: 0; }
  html, body, body * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html { width: auto !important; height: auto !important; min-height: 0 !important; }
  html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
  body {
    display: block !important;
    width: 210mm !important;
    height: 297mm !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
  [${A4_ROOT_ATTR}] {
    max-width: none !important;
    width: 100% !important;
    min-height: 297mm !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
`;

// Some phone browsers ignore `@page { size: A4 }` and print on Letter paper or
// add their own margins, leaving less than a full A4 sheet — the bottom of the
// certificate then spilled onto a second page. Print media queries measure the
// real printable area, so shrink the sheet in 1% steps until it fits there.
// Each step zooms 2% below the size it tested for, leaving room for the 1mm
// tolerance that keeps an exact A4 page (laptops) from matching at all.
const FIT_TO_PAGE_CSS = Array.from({ length: 30 }, (_, step) => {
  const tested = 1 - step / 100;
  const maxWidth = (210 * tested - 1).toFixed(1);
  const maxHeight = (297 * tested - 1).toFixed(1);
  return `@media print and (max-width: ${maxWidth}mm), print and (max-height: ${maxHeight}mm) {
    body { zoom: ${(tested - 0.02).toFixed(2)} !important; margin: 0 auto !important; }
  }`;
}).join("\n");

// Lay the page out at the A4 width on every device. Templates usually ship
// `width=device-width`, which made phones lay the certificate out at ~390px.
const pinViewportToA4 = (doc: Document) => {
  doc
    .querySelectorAll('meta[name="viewport"]')
    .forEach((meta) => meta.remove());
  const viewport = doc.createElement("meta");
  viewport.setAttribute("name", "viewport");
  viewport.setAttribute("content", `width=${A4_WIDTH_PX}`);
  doc.head.prepend(viewport);
};

// The certificate template is an HTML document with editable placeholder
// elements (id="recipient_name" / "course_name" / "instructor_name" /
// "certificate_id"). Swap in the real learner, spoylz and tutor values, drop the
// editing affordances, and stretch it to fill a full A4 page.
export const personalizeCertificate = (
  markup: string,
  values: CertificateValues,
): string => {
  if (!markup) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return markup;
  }

  try {
    const doc = new DOMParser().parseFromString(markup, "text/html");

    // The finished certificate is static. Templates can ship scripts (or
    // inline on* handlers) that generate their own random id on every load,
    // overwriting the real one — so the id changed on each refresh while the
    // QR stayed the same. Strip them so only the values we inject are shown.
    doc.querySelectorAll("script").forEach((script) => script.remove());
    doc.querySelectorAll("*").forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.toLowerCase().startsWith("on")) {
          el.removeAttribute(attr.name);
        }
      });
    });

    const setText = (id: string, value?: string) => {
      if (!value) return;
      const el = doc.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("recipient_name", values.recipientName);
    setText("course_name", values.courseName);
    setText("instructor_name", values.instructorName);
    // Encode the verification link into the certificate's QR code (or hide
    // the QR when there is none). Runs before the id is hidden so the QR can
    // still be located next to the id placeholder.
    injectQrCode(doc, values.verifyUrl);

    applyCertificateId(doc, values.certificateId);
    applyIssueDate(doc, values.issuedAt);

    // Finished certificate — remove the "editable" markers/underlines.
    doc.querySelectorAll("[contenteditable]").forEach((el) => {
      el.removeAttribute("contenteditable");
    });

    // Pick the single element that represents the certificate "card" —
    // templates commonly wrap it in `.certificate-container`, but fall back to
    // the body's first real element (skipping script/style) otherwise. Only
    // this one element gets stretched to fill the A4 sheet; every other
    // top-level element (icon sprites, decorative layers, etc.) is left as-is
    // so it can't accidentally get forced to a full extra 100vh of height.
    const a4Root =
      doc.querySelector<HTMLElement>(".certificate-container") ??
      Array.from(doc.body.children).find(
        (el): el is HTMLElement =>
          el instanceof HTMLElement && !["SCRIPT", "STYLE"].includes(el.tagName),
      ) ??
      null;
    a4Root?.setAttribute(A4_ROOT_ATTR, "");

    pinViewportToA4(doc);
    const style = doc.createElement("style");
    style.textContent = A4_FULL_PAGE_CSS + FIT_TO_PAGE_CSS;
    doc.head.appendChild(style);

    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  } catch {
    return markup;
  }
};

export const buildFullName = (
  first?: string | null,
  last?: string | null,
  display?: string | null,
) => {
  if (display) return display;
  return [first, last].filter(Boolean).join(" ").trim();
};

// Explicitly load every font face the certificate's text uses, so it's never
// printed in a fallback font. `fonts.ready` alone isn't enough: browsers only
// fetch a web font once text using it has been laid out, so `ready` can
// resolve before the template fonts have even started loading.
// `fonts.load()` fetches each face on demand.
export const loadUsedFonts = async (doc: Document) => {
  const view = doc.defaultView;
  if (!doc.fonts || !view) return;

  const fonts = new Set<string>();
  doc.body?.querySelectorAll<HTMLElement>("*").forEach((element) => {
    if (!element.textContent?.trim()) return;
    const style = view.getComputedStyle(element);
    fonts.add(
      `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
    );
  });

  // A face that fails to load shouldn't block the download.
  await Promise.all(
    Array.from(fonts).map((font) => doc.fonts.load(font).catch(() => [])),
  );
  await doc.fonts.ready.catch(() => undefined);
};
