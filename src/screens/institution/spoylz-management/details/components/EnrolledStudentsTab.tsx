"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import EnrolledStudentsTable from "../../../lecturers/details/components/spoylz/EnrolledStudentsTable";
import StudentProgress from "../../../lecturers/details/components/spoylz/StudentProgress";

import { MOCK_ENROLLED_STUDENTS } from "./enrolledStudentsConstants";

import type { StudentProgressDetails } from "../../../lecturers/details/components/spoylz/types";

const EnrolledStudentsTab = ({ simplified = false }: { simplified?: boolean }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressDetails | null>(null);

  if (selectedStudent) {
    return (
      <StudentProgress
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
        onViewProfile={() => toast("Learner profile page coming soon")}
        simplified={simplified}
      />
    );
  }

  return <EnrolledStudentsTable students={MOCK_ENROLLED_STUDENTS} onViewMore={setSelectedStudent} />;
};

export default EnrolledStudentsTab;
