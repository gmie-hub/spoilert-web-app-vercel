import { A4_HEIGHT_PX, A4_WIDTH_PX, loadUsedFonts } from "./certificateHelpers";

// ~290dpi on the printed sheet, while staying well under iOS Safari's canvas
// size limit.
const CAPTURE_SCALE = 3;

// Resolve once `promise` settles or `ms` passes, whichever is first — a
// stalled font or image must never block the download.
const settleWithin = (promise: Promise<unknown>, ms: number) =>
  Promise.race([
    promise.catch(() => undefined),
    new Promise((resolve) => window.setTimeout(resolve, ms)),
  ]);

const waitForLoad = (frame: HTMLIFrameElement) =>
  new Promise((resolve) => {
    if (frame.contentDocument?.readyState === "complete") {
      resolve(undefined);
      return;
    }
    frame.addEventListener("load", resolve, { once: true });
  });

const waitForImages = (doc: Document) =>
  Promise.all(
    Array.from(doc.images)
      .filter((image) => !image.complete)
      .map(
        (image) =>
          new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
      ),
  );

// Phones and tablets (a touch screen as the main pointer).
export const isTouchDevice = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(pointer: coarse)").matches);

// Build the certificate as a one-page A4 PDF file without the browser's print
// dialog. Phone browsers each print a web page differently (paper size,
// margins, scaling) and kept splitting the certificate across two pages; a PDF
// with a single A4 page prints as one page everywhere.
export const createCertificatePdf = async (markup: string) => {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.left = "-10000px";
  frame.style.top = "0";
  frame.style.width = `${A4_WIDTH_PX}px`;
  frame.style.height = `${A4_HEIGHT_PX}px`;
  frame.style.border = "0";
  document.body.appendChild(frame);

  try {
    const doc = frame.contentDocument;
    if (!doc) {
      throw new Error("Unable to prepare the certificate for download.");
    }

    doc.open();
    doc.write(markup);
    doc.close();

    await settleWithin(waitForLoad(frame), 10000);
    await settleWithin(loadUsedFonts(doc), 10000);
    await settleWithin(waitForImages(doc), 5000);

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    // Paint onto a canvas owned by the certificate's document: a canvas draws
    // text with the fonts loaded in its own document, and the app's document
    // doesn't have the template's web fonts.
    const canvas = doc.createElement("canvas");
    canvas.width = A4_WIDTH_PX * CAPTURE_SCALE;
    canvas.height = A4_HEIGHT_PX * CAPTURE_SCALE;

    await html2canvas(doc.body, {
      canvas,
      scale: CAPTURE_SCALE,
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      backgroundColor: "#ffffff",
      useCORS: true,
      // html2canvas lays the text out again in its own copy of the page. Load
      // the template fonts there too — otherwise each word is positioned for a
      // fallback font but painted in the real one, and the words overlap.
      onclone: (clone) => settleWithin(loadUsedFonts(clone), 10000),
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
    return pdf;
  } finally {
    frame.remove();
  }
};
