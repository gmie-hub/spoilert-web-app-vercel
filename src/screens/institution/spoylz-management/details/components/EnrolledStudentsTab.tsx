"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import { type EnrolledStudent, MOCK_ENROLLED_STUDENTS } from "../../../lecturers/details/components/spoylz/constants";
import EnrolledStudentsTable from "../../../lecturers/details/components/spoylz/EnrolledStudentsTable";
import StudentProgress from "../../../lecturers/details/components/spoylz/StudentProgress";

const EnrolledStudentsTab = () => {
  const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);

  if (selectedStudent) {
    return (
      <StudentProgress
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
        onViewProfile={() => toast("Learner profile page coming soon")}
      />
    );
  }

  return <EnrolledStudentsTable students={MOCK_ENROLLED_STUDENTS} onViewMore={setSelectedStudent} />;
};

export default EnrolledStudentsTab;
