"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import CertificateTemplatePreview from "@spt/screens/main/spoils/createSpoils/components/CertificateTemplatePreview";
import { useAuthStore } from "@spt/store/authStore";

import {
  buildFullName,
  personalizeCertificate,
  sanitizeFileName,
  waitForIframeReady,
} from "./certificateHelpers";

interface MyLearningCertificatePageProps {
  spoilId: number | string;
}

export default function MyLearningCertificatePage({
  spoilId,
}: MyLearningCertificatePageProps) {
  const router = useRouter();
  const { data: spoil } = useGetSpoilDetailsQuery(spoilId);
  const user = useAuthStore((state) => state.user);

  // This page is display-only: it renders and downloads the certificate but must
  // not mark the spoil complete. We deliberately do NOT call the complete-spoil
  // endpoint (/spoils/learner/complete) here.
  const [isDownloading, setIsDownloading] = useState(false);

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

  // The issued cert id / verification link come from the complete-spoil endpoint,
  // which we no longer call here, so use the template id and omit the verify link.
  const certificateId = spoilTemplate?.id
    ? String(spoilTemplate.id)
    : undefined;
  const verifyUrl = null;

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

    // The QR code is an external image — wait for it (and any other images) to
    // finish loading before printing, otherwise the saved PDF gets a blank QR.
    const printWhenImagesReady = () => {
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

  // Direct "Save as PDF" (no print dialog): render the certificate into an
  // off-screen iframe, rasterise it with html2canvas and write it into a jsPDF
  // A4 page. If anything fails (e.g. a non-CORS asset taints the canvas) we fall
  // back to the print-to-PDF flow so the button always produces a certificate.
  const handleDownloadPdf = async () => {
    if (!certificateMarkup || typeof window === "undefined" || isDownloading) {
      return;
    }

    setIsDownloading(true);

    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.style.width = "794px"; // ~A4 width at 96dpi
    iframe.style.height = "1123px"; // ~A4 height at 96dpi
    iframe.style.border = "0";
    iframe.style.background = "#ffffff";

    try {
      document.body.appendChild(iframe);

      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) {
        throw new Error("Unable to prepare the certificate for download.");
      }

      iframeDocument.open();
      iframeDocument.write(certificateMarkup);
      iframeDocument.close();

      await waitForIframeReady(iframe);

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(iframeDocument.body, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 2,
        windowWidth: 794,
        windowHeight: Math.max(1123, iframeDocument.body.scrollHeight),
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageData = canvas.toDataURL("image/png");
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      if (imageHeight <= pageHeight) {
        pdf.addImage(imageData, "PNG", 0, 0, imageWidth, imageHeight);
      } else {
        // Taller than one page — tile the same image across pages.
        let position = 0;
        let remaining = imageHeight;
        while (remaining > 0) {
          pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
          remaining -= pageHeight;
          if (remaining > 0) {
            pdf.addPage();
            position -= pageHeight;
          }
        }
      }

      pdf.save(`${sanitizeFileName(certificateTitle)}.pdf`);
    } catch {
      // Capture failed — fall back to the browser print dialog.
      handleDownload();
    } finally {
      iframe.remove();
      setIsDownloading(false);
    }
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
            onClick={handleDownloadPdf}
            disabled={!certificateMarkup || isDownloading}
          >
            {isDownloading ? "Preparing PDF…" : "Download Certificate"}
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
