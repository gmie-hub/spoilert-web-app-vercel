export type SpoylzStatus = "Active" | "Unpublished" | "Disabled";
export type EnrollmentStatus = "Ongoing" | "Completed" | "Not Started";

// Text fields hold "-" when the API has nothing for them.
export interface SpoylzItem {
  id: string;
  title: string;
  coverImage: string | null;
  pricing: string;
  amount: string;
  enrolledStudents: number;
  earnedByLecturer: string;
  earnedByInstitution: string;
  dateCreated: string;
  status: SpoylzStatus;
  category: string;
  courseCode: string;
  modules: number | null;
  lessons: number | null;
  description: string;
  whatTheyWillLearn: string[];
}

export interface EnrolledStudent {
  id: string;
  name: string;
  avatar?: string | null;
  username: string;
  dateEnrolled: string;
  status: EnrollmentStatus | null;
}

// null fields show as "-".
export interface StudentProgressDetails extends EnrolledStudent {
  progress: number | null;
  overallModules: number | null;
  modulesCompleted: number | null;
  modulesPending: number | null;
  currentModule: string | null;
  currentLesson: string | null;
  preQuizScore: string | null;
  postQuizScore: string | null;
  moduleBreakdown: { title: string; lessons: number | null; status: EnrollmentStatus | null }[];
}
