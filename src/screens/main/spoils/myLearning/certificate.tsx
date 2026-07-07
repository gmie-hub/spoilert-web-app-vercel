"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import useCompleteSpoilMutation, {
  type SpoilCertificate,
} from "@spt/hooks/apiRequests/useCompleteSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import CertificateTemplatePreview from "@spt/screens/main/spoils/createSpoils/components/CertificateTemplatePreview";
import { useAuthStore } from "@spt/store/authStore";

interface MyLearningCertificatePageProps {
  spoilId: number | string;
}

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
  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=${encodeURIComponent(
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
    image.setAttribute("src", qrSrc);
  } else {
    image = doc.createElement("img");
    image.alt = "Certificate verification QR code";
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
const personalizeCertificate = (
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

const buildFullName = (
  first?: string | null,
  last?: string | null,
  display?: string | null,
) => {
  if (display) return display;
  return [first, last].filter(Boolean).join(" ").trim();
};

export default function MyLearningCertificatePage({
  spoilId,
}: MyLearningCertificatePageProps) {
  const router = useRouter();
  const { data: spoil } = useGetSpoilDetailsQuery(spoilId);
  const user = useAuthStore((state) => state.user);
  const { completeSpoilHandler } = useCompleteSpoilMutation();

  // The completed certificate (cert id + verification link) is issued by the
  // complete-spoil endpoint, so we complete the spoil when the learner views
  // their certificate and keep the returned certificate data.
  const [certificate, setCertificate] = useState<SpoilCertificate | null>(null);
  const completedSpoilIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!spoilId || completedSpoilIdRef.current === spoilId) {
      return;
    }
    completedSpoilIdRef.current = spoilId;

    completeSpoilHandler(spoilId, { silent: true }).then((response) => {
      if (response?.data?.certificate) {
        setCertificate(response.data.certificate);
      }
    });
    // completeSpoilHandler is recreated each render; the ref guard keeps this
    // to a single call per spoil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spoilId]);

  // Pull the actual certificate for this spoil from
  // /certificates/template/{spoilId}/spoil rather than showing a hardcoded image.
  const { data: spoilTemplate, isLoading: isTemplateLoading } =
    useGetSpoilTemplateQuery(spoilId);

  const rawMarkup =
    spoilTemplate?.template?.template_content ??
    spoilTemplate?.template?.description ??
    "";

  const certificateTitle = spoil?.title
    ? `${spoil.title} certificate`
    : "Certificate";

  const learnerName = buildFullName(user?.first_name, user?.last_name);
  const tutorName = buildFullName(
    spoil?.tutor?.first_name,
    spoil?.tutor?.last_name,
    (spoil?.tutor as { display_name?: string | null } | undefined)?.display_name,
  );

  // Prefer the issued certificate's public id / verification link; fall back to
  // the template id while the complete-spoil response is still loading.
  const certificateId =
    certificate?.cert_id ??
    (spoilTemplate?.id ? String(spoilTemplate.id) : undefined);
  const verifyUrl = certificate?.resolved_url || certificate?.url || null;

  // Inject the real values into the certificate template HTML.
  const certificateMarkup = useMemo(
    () =>
      personalizeCertificate(rawMarkup, {
        recipientName: learnerName,
        courseName: spoil?.title,
        instructorName: tutorName,
        certificateId,
        verifyUrl,
      }),
    [rawMarkup, learnerName, spoil?.title, tutorName, certificateId, verifyUrl],
  );

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/my-learnings?tab=completed");
  };

  const handleDownload = () => {
    if (!certificateMarkup || typeof window === "undefined") {
      return;
    }

    // The certificate is rendered HTML, so open it in a new window and let the
    // user save it as a PDF via the browser's print dialog.
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return;
    }

    printWindow.document.write(certificateMarkup);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
        >
          <Image src={ArrowLeftIcon} alt="Back" width={18} height={18} />
          Back
        </button>

        <h1 className="mt-10 text-[40px] font-semibold tracking-[-0.03em] text-[#212529]">
          My Learnings
        </h1>

        <div className="mx-auto mt-10 max-w-[760px] rounded-[20px] border border-[#ECEFF2] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="overflow-hidden rounded-[14px] border border-[#F0F2F4] bg-white">
            {isTemplateLoading ? (
              <div className="flex h-[420px] items-center justify-center text-sm text-[#5F6B76]">
                Loading certificate…
              </div>
            ) : certificateMarkup ? (
              <CertificateTemplatePreview
                markup={certificateMarkup}
                title={certificateTitle}
                useResponsiveScaling
                outerClassName="relative overflow-hidden bg-white"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center px-6 text-center text-sm text-[#5F6B76]">
                No certificate is available for this Spoylz yet.
              </div>
            )}
          </div>

          <Button
            variant="darkBlue"
            className="mt-8 w-full rounded-[12px] py-4"
            onClick={handleDownload}
            disabled={!certificateMarkup}
          >
            Download Certificate
          </Button>

          <Button
            variant="outline"
            className="mt-4 w-full rounded-[12px] border-[#D7DCE0] py-4 text-[#0B5368] hover:bg-white"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
