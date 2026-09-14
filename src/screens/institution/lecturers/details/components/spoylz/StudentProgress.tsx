import type { ReactNode } from "react";

import Badge from "./Badge";

import type { EnrolledStudent } from "./constants";

const Row2 = ({
  left,
  right,
}: {
  left: { label: string; value: ReactNode };
  right: { label: string; value: ReactNode };
}) => (
  <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-4">
    <div>
      <p className="text-sm text-gray-400">{left.label}</p>
      <p className="mt-1 font-medium text-[#212529]">{left.value}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">{right.label}</p>
      <p className="mt-1 font-medium text-[#212529]">{right.value}</p>
    </div>
  </div>
);

const RowFull = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="border-b border-gray-100 py-4">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="mt-1 font-medium text-[#212529]">{value}</p>
  </div>
);

const StudentProgress = ({
  student,
  onBack,
  onViewProfile,
}: {
  student: EnrolledStudent;
  onBack: () => void;
  onViewProfile?: () => void;
}) => (
  <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
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

      {onViewProfile && (
        <button
          type="button"
          onClick={onViewProfile}
          className="rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
        >
          View Learner&rsquo;s Profile
        </button>
      )}
    </div>

    {!onViewProfile && <p className="mt-4 text-gray-500">{student.name}</p>}
    <h2 className={`${onViewProfile ? "mt-4" : "mt-1"} text-xl font-semibold text-[#212529]`}>Progress Details</h2>

    <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-[#212529]">Progress</h3>
        <div className="mt-3">
          <Row2
            left={{ label: "Progress", value: `${student.progress}%` }}
            right={{ label: "Overall Modules", value: student.overallModules }}
          />
          <Row2
            left={{ label: "Modules Completed", value: student.modulesCompleted }}
            right={{ label: "Modules Pending", value: student.modulesPending }}
          />
          <RowFull label="Current Module" value={student.currentModule} />
          <RowFull label="Current Lesson" value={student.currentLesson} />
          <Row2
            left={{ label: "Pre-Spoylz Quiz Score", value: student.preQuizScore }}
            right={{ label: "Post-Spoylz Quiz Score", value: student.postQuizScore }}
          />
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-sm text-gray-400">Date Enrolled</p>
              <p className="mt-1 font-medium text-[#212529]">{student.dateEnrolled}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <div className="mt-1">
                <Badge label={student.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-[#212529]">Progress Breakdown</h3>
        <div className="mt-3">
          {student.moduleBreakdown.map((module, index) => (
            <div key={module.title} className="border-b border-gray-100 py-4 last:border-0">
              <p className="text-sm text-gray-400">
                Module {index + 1} ({module.lessons} Lessons)
              </p>
              <p className="mt-1 font-medium text-[#212529]">{module.title}</p>
              <div className="mt-2">
                <Badge label={module.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StudentProgress;
