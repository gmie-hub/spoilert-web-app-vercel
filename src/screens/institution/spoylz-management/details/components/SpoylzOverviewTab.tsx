"use client";

import { type ReactNode, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { splitLearningOutcomes } from "@spt/screens/main/spoil/startSpoilUtils";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import Badge from "../../../lecturers/details/components/spoylz/Badge";
import { formatDate, humanize } from "../../../lecturers/utils";
import { NOT_AVAILABLE, formatSpoylzAmount, getFullName, isSpoylzDisabled } from "../../mappers";

import CertificateModal from "./modals/CertificateModal";

import type { Lecturer } from "../../../lecturers/types";

const FieldCell = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="mt-1 font-medium text-[#212529]">{value}</p>
  </div>
);

const FieldRow = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-4 border-b border-gray-100 py-4 last:border-0 sm:grid-cols-3">
    {children}
  </div>
);

const SpoylzOverviewTab = ({ spoil, lecturer }: { spoil: SpoilDetailsData; lecturer: Lecturer | null }) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const learnings = splitLearningOutcomes(spoil.what_to_learn);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {spoil.cover_image_url && (
            <Image src={spoil.cover_image_url} alt={spoil.title} fill sizes="80px" className="object-cover" />
          )}
        </span>
        {Boolean(spoil.has_certificate) && (
          <button
            type="button"
            onClick={() => setIsCertificateOpen(true)}
            className="rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
          >
            View Certificate
          </button>
        )}
      </div>

      <div className="mt-4">
        <FieldRow>
          <FieldCell label="Spoylz Title" value={spoil.title} />
          <div>
            <p className="text-sm text-gray-400">Name of Lecturer</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="font-medium text-[#212529]">{getFullName(spoil.tutor)}</p>
              {lecturer && (
                <Link
                  href={`/institution/lecturers/${lecturer.id}`}
                  className="rounded-lg border border-[var(--color-blue)] px-3 py-1 text-xs font-medium text-[var(--color-blue)]"
                >
                  View Profile
                </Link>
              )}
            </div>
          </div>
          <FieldCell
            label="Department"
            value={lecturer?.department ? `Department of ${lecturer.department}` : NOT_AVAILABLE}
          />
        </FieldRow>

        <FieldRow>
          <FieldCell label="Category" value={spoil.category?.name || NOT_AVAILABLE} />
          <FieldCell label="Course Code" value={spoil.course_code || NOT_AVAILABLE} />
          <FieldCell label="Pricing" value={spoil.pricing ? humanize(spoil.pricing) : NOT_AVAILABLE} />
        </FieldRow>

        <FieldRow>
          <FieldCell label="Spoylz Amount" value={formatSpoylzAmount(spoil.pricing, spoil.amount)} />
          <FieldCell label="Enrolled Students" value={spoil.enrolled_users ?? 0} />
          <FieldCell label="Date created" value={formatDate(spoil.created_at)} />
        </FieldRow>

        <FieldRow>
          {/* No endpoint serves earnings per Spoylz yet. */}
          <FieldCell label="Amount Earned By Lecturer" value={NOT_AVAILABLE} />
          <FieldCell label="Amount Earned By Institution" value={NOT_AVAILABLE} />
          <FieldCell label="Modules" value={spoil.modules_no ?? NOT_AVAILABLE} />
        </FieldRow>

        <FieldRow>
          <FieldCell label="Lessons" value={spoil.lessons_no ?? NOT_AVAILABLE} />
          <FieldCell
            label="Status"
            value={<Badge label={isSpoylzDisabled(spoil.is_active) ? "Disabled" : "Active"} />}
          />
        </FieldRow>

        <div className="border-b border-gray-100 py-4">
          <p className="text-sm text-gray-400">Description</p>
          <p className="mt-1 whitespace-pre-line font-medium text-[#212529]">{spoil.description || NOT_AVAILABLE}</p>
        </div>

        <div className="py-4">
          <p className="text-sm text-gray-400">What they will learn</p>
          {learnings.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-5 font-medium text-[#212529]">
              {learnings.map((point, index) => (
                <li key={`${point}-${index}`}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 font-medium text-[#212529]">{NOT_AVAILABLE}</p>
          )}
        </div>
      </div>

      {isCertificateOpen && (
        <CertificateModal spoilId={spoil.id} spoilTitle={spoil.title} onClose={() => setIsCertificateOpen(false)} />
      )}
    </div>
  );
};

export default SpoylzOverviewTab;
