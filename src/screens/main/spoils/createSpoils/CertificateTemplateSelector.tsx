"use client";

import { useDeferredValue, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import useGetCertificateTemplatesQuery, {
  CertificateTemplate,
} from "@spt/hooks/apiRequests/useGetCertificateTemplatesQuery";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CertificateTemplatePreview from "./components/CertificateTemplatePreview";

const getTemplateName = (
  template: CertificateTemplate,
  index: number,
): string => {
  const rawName = template.template?.certificate_template_name;

  if (typeof rawName === "string" && rawName.trim()) {
    return rawName
      .replace(/\.html$/i, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return `Certificate Template ${index + 1}`;
};

const getTemplatePreviewMarkup = (template: CertificateTemplate): string =>
  template.template?.template_content || "";

const matchesSearch = (template: CertificateTemplate, searchText: string) => {
  if (!searchText) {
    return true;
  }

  const haystack = [
    template.code,
    template.template?.certificate_template_name,
    getTemplateName(template, 0),
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchText);
};

export default function CertificateTemplateSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") === "simple" ? "simple" : "advanced";

  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(
    searchValue.trim().toLowerCase(),
  );

  const { templates, isLoading, isError, errorMessage } =
    useGetCertificateTemplatesQuery();
  const certificateTemplate = useCreateSpoilStore(
    (state) => state.certificateTemplate,
  );
  const setCertificateTemplate = useCreateSpoilStore(
    (state) => state.setCertificateTemplate,
  );

  const filteredTemplates = templates.filter((template) =>
    matchesSearch(template, deferredSearchValue),
  );

  const handleSelectTemplate = (
    templateId: string,
    code: string,
    name: string,
    templateFileName: string | null | undefined,
    previewMarkup: string,
  ) => {
    setCertificateTemplate({
      id: templateId,
      code,
      name,
      templateContent: previewMarkup,
      templateFileName: templateFileName || null,
    });
    router.push(`/create-spoils/certificate-template/customize?flow=${flow}`);
  };

  const handleBack = () => {
    router.push(
      flow === "simple"
        ? "/create-spoils/simple-spoil"
        : "/create-spoils/advance-spoil",
    );
  };

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
        >
          <img
            src={ArrowLeftIcon.src}
            alt="Back"
            className="h-[18px] w-[18px]"
          />
          Back
        </button>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-[-0.03em] text-[#212529] sm:text-xl">
              Choose Your Certificate Template
            </h1>
            <p className="mt-3 text-base text-[#667085]">
              Search a template for your certificate.
            </p>
          </div>

          <div className="relative w-full max-w-xl">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search template.."
              className="h-14 w-full rounded-2xl border border-[#EFEFEF] bg-[#FBFBFB] pl-12 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#0B5368]"
            />
          </div>
        </div>

        {certificateTemplate?.name ? (
          <div className="mt-6 rounded-2xl border border-[#CDE8E5] bg-[#EDF8F6] px-4 py-3 text-sm text-[#0B5368]">
            Selected template:{" "}
            <span className="font-semibold">{certificateTemplate.name}</span>
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[220px] animate-pulse rounded-2xl border border-[#EEF2F6] bg-white"
              />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="mt-8 rounded-2xl border border-[#F3D2D2] bg-[#FFF7F7] px-5 py-4 text-sm text-[#9B1C1C]">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !isError ? (
          filteredTemplates.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTemplates.map((template, index) => {
                const name = getTemplateName(template, index);
                const previewMarkup = getTemplatePreviewMarkup(template);
                const templateId = String(template.id);
                const isSelected =
                  certificateTemplate?.id != null &&
                  String(certificateTemplate.id) === templateId;

                return (
                  <button
                    key={templateId}
                    type="button"
                    onClick={() =>
                      handleSelectTemplate(
                        templateId,
                        template.code,
                        name,
                        template.template?.certificate_template_name,
                        previewMarkup,
                      )
                    }
                    className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition ${
                      isSelected
                        ? "border-[#0B5368] ring-2 ring-[#0B5368]/15"
                        : "border-[#EEF2F6] hover:-translate-y-1 hover:border-[#C6D6DE]"
                    }`}
                  >
                    <CertificateTemplatePreview
                      markup={previewMarkup}
                      title={`${name} preview`}
                      outerClassName="relative h-[360px] w-full overflow-hidden bg-[#F8FAFC]"
                      canvasClassName="absolute left-2/3 top-0 h-[842px] w-full origin-top-left overflow-hidden rounded-[6px] bg-white shadow-sm"
                      transform="translateX(-50%) scale(0.58)"
                    />

                    {isSelected ? (
                      <span className="absolute right-3 top-3 rounded-full bg-[#0B5368] px-3 py-1 text-xs font-semibold text-white">
                        Selected
                      </span>
                    ) : null}

                    <div className="flex items-center justify-between gap-4 px-4 py-4">
                      <div>
                        <p className="font-semibold text-[#111827]">{name}</p>
                        {/* <p className="mt-1 text-sm text-[#667085]">
                          {template.code}
                        </p> */}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          isSelected
                            ? "bg-[#E7F6F3] text-[#0B5368]"
                            : "bg-[#F4F7FA] text-[#516170]"
                        }`}
                      >
                        {isSelected ? "In Use" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#D5DDE5] bg-white px-6 py-12 text-center text-[#667085]">
              No certificate templates matched your search.
            </div>
          )
        ) : null}

        <div className="mt-8 flex justify-end">
          <Button
            variant="darkBlue"
            className="rounded-xl px-8"
            onClick={handleBack}
          >
            Back To Review
          </Button>
        </div>
      </div>
    </section>
  );
}
