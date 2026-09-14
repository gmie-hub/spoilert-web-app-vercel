import type { ReactNode } from "react";

import Badge from "./Badge";
import type { SpoylzItem } from "./constants";

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

const SpoylzDetails = ({
  item,
  onBack,
  onViewEnrolled,
}: {
  item: SpoylzItem;
  onBack: () => void;
  onViewEnrolled: () => void;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Go Back
    </button>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-[#212529]">Spoylz Details</h2>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onViewEnrolled}
          className="rounded-lg bg-[var(--color-blue)] px-4 py-2 text-sm font-medium text-white"
        >
          View Enrolled Students
        </button>
        <button
          type="button"
          className="rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
        >
          View Full Spoylz Details
        </button>
      </div>
    </div>

    <div className="mt-4">
      <FieldRow>
        <FieldCell label="Spoylz Title" value={item.title} />
        <FieldCell label="Category" value={item.category} />
        <FieldCell label="Course Code" value={item.courseCode} />
      </FieldRow>
      <FieldRow>
        <FieldCell label="Pricing" value={item.pricing} />
        <FieldCell label="Amount" value={item.detailAmount} />
        <FieldCell label="Enrolled Students" value={item.enrolledStudents} />
      </FieldRow>
      <FieldRow>
        <FieldCell label="Amount Earned by Lecturer" value={item.detailEarnedByLecturer} />
        <FieldCell label="Amount Earned by Institution" value={item.detailEarnedByInstitution} />
        <FieldCell label="Modules" value={item.modules} />
      </FieldRow>
      <FieldRow>
        <FieldCell label="Lessons" value={item.lessons} />
        <FieldCell label="Date created" value={item.dateCreated} />
        <FieldCell label="Status" value={<Badge label={item.status} />} />
      </FieldRow>

      <div className="border-b border-gray-100 py-4">
        <p className="text-sm text-gray-400">Description</p>
        <p className="mt-1 font-medium text-[#212529]">{item.description}</p>
      </div>

      <div className="py-4">
        <p className="text-sm text-gray-400">What they will learn</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 font-medium text-[#212529]">
          {item.whatTheyWillLearn.map((point, index) => (
            <li key={`${point}-${index}`}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default SpoylzDetails;
