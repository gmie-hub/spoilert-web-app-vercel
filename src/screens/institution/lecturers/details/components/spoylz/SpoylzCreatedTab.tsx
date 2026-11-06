"use client";

import { useState } from "react";

import useGetEnrolledLearnersQuery from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import useGetLearnerProgressQuery from "@spt/hooks/apiRequests/useGetLearnerProgressQuery";
import useGetLecturerSpoilsQuery from "@spt/hooks/apiRequests/useGetLecturerSpoilsQuery";

import { type StudentRow, toSpoylzItem, toStudentProgress, toStudentRow } from "../../mappers";

import EnrolledStudentsTable from "./EnrolledStudentsTable";
import SpoylzDetails from "./SpoylzDetails";
import SpoylzTable from "./SpoylzTable";
import StudentProgress from "./StudentProgress";

import type { SpoylzItem } from "./types";
import type { Lecturer } from "../../../types";

type SpoylzView = "list" | "details" | "enrolled" | "progress";

const EnrolledStudents = ({
  spoilId,
  onBack,
  onViewMore,
}: {
  spoilId: string;
  onBack: () => void;
  onViewMore: (student: StudentRow) => void;
}) => {
  const { learners, isLoading, isError, errorMessage } = useGetEnrolledLearnersQuery(spoilId);

  return (
    <EnrolledStudentsTable
      students={learners.map(toStudentRow)}
      isLoading={isLoading}
      errorMessage={isError ? errorMessage : null}
      onBack={onBack}
      onViewMore={onViewMore}
    />
  );
};

const LearnerProgress = ({
  spoilId,
  student,
  onBack,
}: {
  spoilId: string;
  student: StudentRow;
  onBack: () => void;
}) => {
  const { progress, isLoading, isError, errorMessage } = useGetLearnerProgressQuery(spoilId, student.learnerId);

  if (progress) {
    return <StudentProgress student={toStudentProgress(student, progress)} onBack={onBack} />;
  }

  return (
    <div>
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
      <p className="mt-4 text-gray-500">{student.name}</p>
      <h2 className="mt-1 text-xl font-semibold text-[#212529]">Progress Details</h2>
      {isLoading ? (
        <div className="mt-5 h-[300px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
      ) : (
        <div
          className={`mt-5 rounded-2xl border border-gray-100 bg-white p-6 text-sm sm:p-8 ${
            isError ? "text-red-600" : "text-gray-400"
          }`}
        >
          {isError ? errorMessage : "No progress recorded for this learner yet."}
        </div>
      )}
    </div>
  );
};

const SpoylzCreatedTab = ({ lecturer }: { lecturer: Lecturer }) => {
  const [view, setView] = useState<SpoylzView>("list");
  const [selectedSpoylz, setSelectedSpoylz] = useState<SpoylzItem | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  const { spoils, isLoading, isError, errorMessage } = useGetLecturerSpoilsQuery(lecturer.userId);
  const spoylz = spoils.map((spoil) => toSpoylzItem(spoil));

  if (view === "details" && selectedSpoylz) {
    return (
      <SpoylzDetails
        item={selectedSpoylz}
        onBack={() => setView("list")}
        onViewEnrolled={() => setView("enrolled")}
      />
    );
  }

  if (view === "enrolled" && selectedSpoylz) {
    return (
      <EnrolledStudents
        spoilId={selectedSpoylz.id}
        onBack={() => setView("details")}
        onViewMore={(student) => {
          setSelectedStudent(student);
          setView("progress");
        }}
      />
    );
  }

  if (view === "progress" && selectedSpoylz && selectedStudent) {
    return (
      <LearnerProgress
        spoilId={selectedSpoylz.id}
        student={selectedStudent}
        onBack={() => setView("enrolled")}
      />
    );
  }

  return (
    <SpoylzTable
      spoylz={spoylz}
      isLoading={isLoading}
      errorMessage={isError ? errorMessage : null}
      onViewMore={(item) => {
        setSelectedSpoylz(item);
        setView("details");
      }}
    />
  );
};

export default SpoylzCreatedTab;
