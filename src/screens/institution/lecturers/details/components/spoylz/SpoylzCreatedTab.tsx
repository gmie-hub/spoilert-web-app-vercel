"use client";

import { useState } from "react";

import { type EnrolledStudent, MOCK_ENROLLED_STUDENTS, MOCK_SPOYLZ, type SpoylzItem } from "./constants";
import EnrolledStudentsTable from "./EnrolledStudentsTable";
import SpoylzDetails from "./SpoylzDetails";
import SpoylzTable from "./SpoylzTable";
import StudentProgress from "./StudentProgress";

type SpoylzView = "list" | "details" | "enrolled" | "progress";

const SpoylzCreatedTab = () => {
  const [view, setView] = useState<SpoylzView>("list");
  const [selectedSpoylz, setSelectedSpoylz] = useState<SpoylzItem | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);

  if (view === "details" && selectedSpoylz) {
    return (
      <SpoylzDetails
        item={selectedSpoylz}
        onBack={() => setView("list")}
        onViewEnrolled={() => setView("enrolled")}
      />
    );
  }

  if (view === "enrolled") {
    return (
      <EnrolledStudentsTable
        students={MOCK_ENROLLED_STUDENTS}
        onBack={() => setView(selectedSpoylz ? "details" : "list")}
        onViewMore={(student) => {
          setSelectedStudent(student);
          setView("progress");
        }}
      />
    );
  }

  if (view === "progress" && selectedStudent) {
    return <StudentProgress student={selectedStudent} onBack={() => setView("enrolled")} />;
  }

  return (
    <SpoylzTable
      spoylz={MOCK_SPOYLZ}
      onViewMore={(item) => {
        setSelectedSpoylz(item);
        setView("details");
      }}
    />
  );
};

export default SpoylzCreatedTab;
