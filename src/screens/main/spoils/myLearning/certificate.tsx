"use client";

import { useMemo } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
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
}

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

  // Inject the real values into the certificate template HTML.
  const certificateMarkup = useMemo(
    () =>
      personalizeCertificate(rawMarkup, {
        recipientName: learnerName,
        courseName: spoil?.title,
        instructorName: tutorName,
        certificateId: spoilTemplate?.id ? String(spoilTemplate.id) : undefined,
      }),
    [rawMarkup, learnerName, spoil?.title, tutorName, spoilTemplate?.id],
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
