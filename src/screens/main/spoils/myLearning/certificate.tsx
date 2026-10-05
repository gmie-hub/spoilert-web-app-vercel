"use client";

import { useEffect, useMemo, useState } from "react";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import useCompleteSpoilMutation, {
  type CompleteSpoilPayment,
  type SpoilCertificate,
} from "@spt/hooks/apiRequests/useCompleteSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import CertificateTemplatePreview from "@spt/screens/main/spoils/createSpoils/components/CertificateTemplatePreview";
import { useAuthStore } from "@spt/store/authStore";

import {
  buildFullName,
  loadUsedFonts,
  personalizeCertificate,
} from "./certificateHelpers";
import { createCertificatePdf, isTouchDevice } from "./certificatePdf";

interface MyLearningCertificatePageProps {
  spoilId: number | string;
}

const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function MyLearningCertificatePage({
  spoilId,
}: MyLearningCertificatePageProps) {
  // const router = useRouter();
  const { data: spoil } = useGetSpoilDetailsQuery(spoilId);
  const user = useAuthStore((state) => state.user);

  // This page is display-only and must never mark the spoil complete again —
  // but the cert id / QR verification link only come back from the
  // complete-spoil endpoint. Calling it here with `silent: true` is exactly
  // what that option exists for: it's idempotent on an already-completed
  // spoil (no toast, no re-triggering completion side effects), it just
  // hands back the already-issued certificate.
  const { completeSpoilHandler } = useCompleteSpoilMutation();
  const [certificate, setCertificate] = useState<SpoilCertificate | null>(
    null,
  );
  // Set when the endpoint responds with `status: "payment_required"` — the
  // certificate fee hasn't been paid, so no certificate has been issued yet.
  const [pendingPayment, setPendingPayment] =
    useState<CompleteSpoilPayment | null>(null);
  const [isCheckingCertificate, setIsCheckingCertificate] = useState(true);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);

  useEffect(() => {
    let cancelled = false;

    completeSpoilHandler(spoilId, { silent: true }).then((response) => {
      if (!cancelled) {
        setCertificate(response?.data?.certificate ?? null);
        setPendingPayment(
          response?.data?.status === "payment_required"
            ? (response?.data?.payment ?? null)
            : null,
        );
        setIsCheckingCertificate(false);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spoilId]);

  // Pull the actual certificate for this spoil from
  // /certificates/template/{spoilId}/spoil rather than showing a hardcoded image.
  const { data: spoilTemplate, isLoading: isTemplateLoading } =
    useGetSpoilTemplateQuery(spoilId);

  // The backend prefixes `template_content` with a plain-text scan banner
  // (e.g. "✅ Template dark_slate_merit.html is already safe") before the
  // actual certificate HTML. Drop everything before the first tag so that
  // banner never renders at the top of the certificate.
  const stripToHtml = (value?: string | null): string => {
    if (typeof value !== "string") return "";
    const firstTagIndex = value.indexOf("<");
    return firstTagIndex === -1 ? "" : value.slice(firstTagIndex);
  };

  const rawMarkup =
    stripToHtml(spoilTemplate?.template?.template_content) ||
    stripToHtml(spoilTemplate?.template?.description);

  const certificateTitle = spoil?.title
    ? `${spoil.title} certificate`
    : "Certificate";

  const learnerName = buildFullName(user?.first_name, user?.last_name);
  const tutorName = buildFullName(
    spoil?.tutor?.first_name,
    spoil?.tutor?.last_name,
    (spoil?.tutor as { display_name?: string | null } | undefined)?.display_name,
  );

  // The QR verification link is the single source of truth for the
  // certificate id: the id printed on the certificate is read straight out of
  // the link the QR encodes, so the two can never disagree. No template-id
  // fallback — that isn't a real certificate id.
  // The "silent" idempotent replay of an already-completed spoil doesn't
  // always echo back `resolved_url` even though it has a `cert_id`, so build
  // the same public verify link from `cert_id` in that case.
  const verifyUrl = pendingPayment
    ? null
    : (certificate?.resolved_url ??
      (certificate?.cert_id && typeof window !== "undefined"
        ? `${window.location.origin}/verify-certificate/qrcode/${encodeURIComponent(certificate.cert_id)}`
        : null));

  // …/verify-certificate/qrcode/{id} → {id}
  const certificateId = useMemo(() => {
    if (!verifyUrl) return undefined;
    try {
      const segments = new URL(verifyUrl, "http://placeholder").pathname
        .split("/")
        .filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      return lastSegment ? decodeURIComponent(lastSegment) : undefined;
    } catch {
      return undefined;
    }
  }, [verifyUrl]);


  // Inject the real values into the certificate template HTML.
  const certificateMarkup = useMemo(
    () =>
      personalizeCertificate(rawMarkup, {
        recipientName: learnerName,
        courseName: spoil?.title,
        instructorName: tutorName,
        certificateId,
        issuedAt: certificate?.generated_at ?? certificate?.created_at,
        verifyUrl,
      }),
    [
      rawMarkup,
      learnerName,
      spoil?.title,
      tutorName,
      certificateId,
      certificate?.generated_at,
      certificate?.created_at,
      verifyUrl,
    ],
  );

  const handlePayNow = () => {
    if (pendingPayment?.payment_link && typeof window !== "undefined") {
      window.open(pendingPayment.payment_link, "_blank", "noopener,noreferrer");
    }
  };

  // const handleBack = () => {
  //   if (typeof window !== "undefined" && window.history.length > 1) {
  //     router.back();
  //     return;
  //   }

  //   router.push("/my-learnings?tab=completed");
  // };

  const handleDownload = async () => {
    if (!certificateMarkup || typeof window === "undefined" || isPreparingPdf) {
      return;
    }

    // Phones and tablets get the PDF file built directly: their print dialogs
    // pick their own paper size, margins and scaling, and split the
    // certificate across two pages. Laptops keep the print flow below, which
    // gives sharp, selectable text.
    if (isTouchDevice()) {
      setIsPreparingPdf(true);
      try {
        const pdf = await createCertificatePdf(certificateMarkup);
        pdf.save(
          `${certificateTitle.replace(/[\\/:*?"<>|]+/g, "").trim() || "certificate"}.pdf`,
        );
        return;
      } catch {
        // Couldn't build the file (e.g. an image blocked the capture) — fall
        // back to the print dialog so the button still produces a certificate.
      } finally {
        setIsPreparingPdf(false);
      }
    }

    printCertificate();
  };

  const printCertificate = () => {
    if (!certificateMarkup) {
      return;
    }

    // Save the certificate through the browser's own "Save as PDF", so the PDF
    // is drawn by the same engine as the preview — identical fonts, spacing and
    // colours, with real (sharp) text. Rasterising it with html2canvas instead
    // redrew each word itself and the words ran together whenever the
    // template's web font wasn't available to its canvas.
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) {
      toast.error(
        "Please allow pop-ups so your certificate can open for download.",
      );
      return;
    }

    printWindow.document.open();
    printWindow.document.write(certificateMarkup);
    printWindow.document.close();
    // Sets the default file name when the user chooses "Save as PDF".
    printWindow.document.title = certificateTitle;

    const printDocument = printWindow.document;
    let hasPrinted = false;

    const triggerPrint = () => {
      if (hasPrinted || printWindow.closed) {
        return;
      }
      hasPrinted = true;
      printWindow.focus();
      printWindow.print();
    };

    // Wait for the template's web fonts (so the PDF never falls back to a
    // default font) and for the QR code and other images (otherwise the saved
    // PDF gets a blank QR) before printing.
    const printWhenImagesReady = async () => {
      await loadUsedFonts(printDocument);

      const images = Array.from(printDocument.images ?? []);
      const pending = images.filter((image) => !image.complete);

      if (pending.length === 0) {
        window.setTimeout(triggerPrint, 200);
        return;
      }

      let remaining = pending.length;
      const onSettled = () => {
        remaining -= 1;
        if (remaining <= 0) {
          window.setTimeout(triggerPrint, 200);
        }
      };

      pending.forEach((image) => {
        image.addEventListener("load", onSettled, { once: true });
        image.addEventListener("error", onSettled, { once: true });
      });

      // Safety net so a stalled image can never block the download entirely.
      window.setTimeout(triggerPrint, 5000);
    };

    if (printDocument.readyState === "complete") {
      printWhenImagesReady();
    } else {
      printWindow.addEventListener("load", printWhenImagesReady, {
        once: true,
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        {/* <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
        >
          <Image src={ArrowLeftIcon} alt="Back" width={18} height={18} />
          Back
        </button> */}

        <h1 className="mt-10 text-[40px] font-semibold tracking-[-0.03em] text-[#212529]">
          My Certificate
        </h1>

        <div className="mx-auto mt-10 max-w-[760px] rounded-[20px] border border-[#ECEFF2] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-7">
          {pendingPayment && pendingPayment ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <h2 className="text-lg font-semibold text-[#212529]">
                Pay to unlock your certificate
              </h2>
              <p className="max-w-sm text-sm text-[#5F6B76]">
                You&apos;ve completed this Spoylz — pay the certificate fee of{" "}
                <span className="font-semibold text-[#212529]">
                  {formatNaira(Number(pendingPayment.amount))}
                </span>{" "}
                to issue and download your certificate.
              </p>

              <Button
                variant="darkBlue"
                className="mt-4 w-full max-w-xs rounded-[12px] py-4"
                onClick={handlePayNow}
                disabled={!pendingPayment.payment_link}
              >
                Pay Now
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-[14px] border border-[#F0F2F4] bg-white">
                {isTemplateLoading || isCheckingCertificate ? (
                  <div className="flex h-[420px] items-center justify-center text-sm text-[#5F6B76]">
                    Loading certificate…
                  </div>
                ) : certificateMarkup ? (
                  <CertificateTemplatePreview
                    markup={certificateMarkup}
                    title={certificateTitle}
                    useResponsiveScaling
                    nativeCanvasSize
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
                disabled={!certificateMarkup || isPreparingPdf}
              >
                {isPreparingPdf
                  ? "Preparing certificate…"
                  : "Download Certificate"}
              </Button>
            </>
          )}

          {/* <Button
            variant="outline"
            className="mt-4 w-full rounded-[12px] border-[#D7DCE0] py-4 text-[#0B5368] hover:bg-white"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button> */}
        </div>
      </div>
    </section>
  );
}
