import type { ReactNode } from "react";

import Badge from "../../../lecturers/details/components/spoylz/Badge";

import type { SpoylzManagementItem } from "../../constants";

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

const SpoylzOverviewTab = ({ item }: { item: SpoylzManagementItem }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <span
        className="h-20 w-20 shrink-0 rounded-xl"
        style={{ backgroundColor: item.thumbnailColor }}
      />
      <button
        type="button"
        className="rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
      >
        View Certificate
      </button>
    </div>

    <div className="mt-4">
      <FieldRow>
        <FieldCell label="Spoylz Title" value={item.title} />
        <div>
          <p className="text-sm text-gray-400">Name of Lecturer</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="font-medium text-[#212529]">{item.lecturerName}</p>
            <button
              type="button"
              className="rounded-lg border border-[var(--color-blue)] px-3 py-1 text-xs font-medium text-[var(--color-blue)]"
            >
              View Profile
            </button>
          </div>
        </div>
        <FieldCell label="Department" value={`Department of ${item.department}`} />
      </FieldRow>

      <FieldRow>
        <FieldCell label="Category" value={item.category} />
        <FieldCell label="Course Code" value={item.courseCode} />
        <FieldCell label="Pricing" value={item.pricing} />
      </FieldRow>

      <FieldRow>
        <FieldCell label="Spoylz Amount" value={item.detailAmount} />
        <FieldCell label="Enrolled Students" value={item.enrolledStudents} />
        <FieldCell label="Date created" value={item.dateCreated} />
      </FieldRow>

      <FieldRow>
        <FieldCell label="Amount Earned By Lecturer" value={item.detailEarnedByLecturer} />
        <FieldCell label="Amount Earned By Institution" value={item.detailEarnedByInstitution} />
        <FieldCell label="Modules" value={item.modules} />
      </FieldRow>

      <FieldRow>
        <FieldCell label="Lessons" value={item.lessons} />
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

export default SpoylzOverviewTab;
