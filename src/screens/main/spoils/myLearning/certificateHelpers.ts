interface CertificateValues {
  recipientName?: string;
  courseName?: string;
  instructorName?: string;
  certificateId?: string;
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
const injectQrCode = (doc: Document, verifyUrl?: string | null) => {
  if (!verifyUrl) return;

  const qrSrc = buildQrImageSrc(verifyUrl);

  const markedHost = doc.querySelector<HTMLElement>(
    '[id*="qr" i], [class*="qr" i], [data-certificate-qr], img[alt*="qr" i]',
  );
  const markedVisual =
    markedHost &&
    (["IMG", "CANVAS", "SVG"].includes(markedHost.tagName)
      ? markedHost
      : findQrVisual(markedHost));
  if (markedVisual) {
    applyQrToVisual(doc, markedVisual, qrSrc, verifyUrl);
    return;
  }

  const idAnchor = doc.getElementById("certificate_id");
  const verifyLabel =
    Array.from(doc.querySelectorAll<HTMLElement>("*")).find(
      (element) =>
        element.childElementCount === 0 &&
        (element.textContent || "").trim().toLowerCase().includes("verify"),
    ) ?? null;

  const nearVisual =
    findQrVisualNear(idAnchor) ?? findQrVisualNear(verifyLabel);
  if (nearVisual) {
    applyQrToVisual(doc, nearVisual, qrSrc, verifyUrl);
  }
};

// A4 portrait override so the certificate fills the full sheet instead of
// sitting as a small centered card on the template's own background.
const A4_FULL_PAGE_CSS = `
  html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
  body { display: block !important; min-height: 100vh !important; }
  .certificate-container,
  body > *:not(script):not(style) {
    max-width: none !important;
    width: 100% !important;
    min-height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
`;

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

    const setText = (id: string, value?: string) => {
      if (!value) return;
      const el = doc.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("recipient_name", values.recipientName);
    setText("course_name", values.courseName);
    setText("instructor_name", values.instructorName);
    setText("certificate_id", values.certificateId);

    // Encode the verification link into the certificate's QR code.
    injectQrCode(doc, values.verifyUrl);

    // Finished certificate — remove the "editable" markers/underlines.
    doc.querySelectorAll("[contenteditable]").forEach((el) => {
      el.removeAttribute("contenteditable");
    });

    const style = doc.createElement("style");
    style.textContent = A4_FULL_PAGE_CSS;
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

// Make a title safe to use as a download file name.
export const sanitizeFileName = (name: string) =>
  (name || "certificate")
    .trim()
    .replace(/[^a-z0-9\-_ ]+/gi, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "certificate";

// Resolve once the iframe document and all of its images (QR, logo, signature)
// have finished loading, so the PDF capture never grabs a half-loaded page.
export const waitForIframeReady = (iframe: HTMLIFrameElement) =>
  new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const settleImages = () => {
      const doc = iframe.contentDocument;
      if (!doc) return finish();

      const pending = Array.from(doc.images ?? []).filter(
        (image) => !image.complete,
      );
      if (pending.length === 0) return finish();

      let remaining = pending.length;
      const onImage = () => {
        remaining -= 1;
        if (remaining <= 0) finish();
      };
      pending.forEach((image) => {
        image.addEventListener("load", onImage, { once: true });
        image.addEventListener("error", onImage, { once: true });
      });
    };

    if (iframe.contentDocument?.readyState === "complete") {
      settleImages();
    } else {
      iframe.addEventListener("load", settleImages, { once: true });
    }

    // Safety net: never hang if an image stalls.
    window.setTimeout(finish, 6000);
  });
