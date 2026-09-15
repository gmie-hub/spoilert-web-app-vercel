export type SpoylzStatus = "Active" | "Unpublished";
export type EnrollmentStatus = "Ongoing" | "Completed" | "Not Started";

export interface SpoylzItem {
  id: string;
  title: string;
  thumbnailColor: string;
  amount: string;
  enrolledStudents: number;
  earnedByLecturer: string;
  earnedByInstitution: string;
  dateCreated: string;
  status: SpoylzStatus;
  category: string;
  courseCode: string;
  pricing: string;
  detailAmount: string;
  detailEarnedByLecturer: string;
  detailEarnedByInstitution: string;
  modules: number;
  lessons: number;
  description: string;
  whatTheyWillLearn: string[];
}

export const MOCK_SPOYLZ: SpoylzItem[] = [
  {
    id: "1",
    title: "Understanding Design Principles",
    thumbnailColor: "#F4C77B",
    amount: "₦20,000",
    enrolledStudents: 10,
    earnedByLecturer: "₦200,000",
    earnedByInstitution: "₦200,000",
    dateCreated: "12-02-2026",
    status: "Active",
    category: "UI/UX Design",
    courseCode: "CHM 404",
    pricing: "Paid",
    detailAmount: "₦15,000",
    detailEarnedByLecturer: "₦200,000",
    detailEarnedByInstitution: "₦20,000",
    modules: 5,
    lessons: 10,
    description: "This course is for aspiring product designers",
    whatTheyWillLearn: ["Basics of design", "Principles of Design", "Basics of design"],
  },
  {
    id: "2",
    title: "Frontend Development",
    thumbnailColor: "#8FB7E8",
    amount: "₦100,000",
    enrolledStudents: 5,
    earnedByLecturer: "₦500,000",
    earnedByInstitution: "₦500,000",
    dateCreated: "12-02-2026",
    status: "Active",
    category: "Software Engineering",
    courseCode: "CSC 210",
    pricing: "Paid",
    detailAmount: "₦100,000",
    detailEarnedByLecturer: "₦500,000",
    detailEarnedByInstitution: "₦500,000",
    modules: 8,
    lessons: 24,
    description: "Learn to build modern, responsive web interfaces.",
    whatTheyWillLearn: ["HTML & CSS fundamentals", "JavaScript essentials", "Building responsive layouts"],
  },
  {
    id: "3",
    title: "CHM202- IUPAC Nomenclature",
    thumbnailColor: "#7DB7B0",
    amount: "₦80,000",
    enrolledStudents: 20,
    earnedByLecturer: "₦1,600,000",
    earnedByInstitution: "₦1,600,000",
    dateCreated: "12-02-2026",
    status: "Unpublished",
    category: "Chemistry",
    courseCode: "CHM 202",
    pricing: "Paid",
    detailAmount: "₦80,000",
    detailEarnedByLecturer: "₦1,600,000",
    detailEarnedByInstitution: "₦1,600,000",
    modules: 6,
    lessons: 18,
    description: "A deep dive into IUPAC naming conventions for organic compounds.",
    whatTheyWillLearn: ["Naming organic compounds", "Functional group priority", "Common exceptions"],
  },
  {
    id: "4",
    title: "Financial Literacy",
    thumbnailColor: "#E3A6A6",
    amount: "₦40,000",
    enrolledStudents: 15,
    earnedByLecturer: "₦850,000",
    earnedByInstitution: "₦850,000",
    dateCreated: "12-02-2026",
    status: "Active",
    category: "Personal Finance",
    courseCode: "FIN 101",
    pricing: "Paid",
    detailAmount: "₦40,000",
    detailEarnedByLecturer: "₦850,000",
    detailEarnedByInstitution: "₦850,000",
    modules: 4,
    lessons: 12,
    description: "Practical money management for students.",
    whatTheyWillLearn: ["Budgeting basics", "Saving and investing", "Avoiding common debt traps"],
  },
  {
    id: "5",
    title: "BCH 404- Pharmacology",
    thumbnailColor: "#A6A6E3",
    amount: "₦30,000",
    enrolledStudents: 8,
    earnedByLecturer: "₦240,000",
    earnedByInstitution: "₦240,000",
    dateCreated: "12-02-2026",
    status: "Active",
    category: "Biochemistry",
    courseCode: "BCH 404",
    pricing: "Paid",
    detailAmount: "₦30,000",
    detailEarnedByLecturer: "₦240,000",
    detailEarnedByInstitution: "₦240,000",
    modules: 5,
    lessons: 15,
    description: "Core principles of drug action and pharmacokinetics.",
    whatTheyWillLearn: ["Drug absorption & metabolism", "Dose-response relationships", "Common drug interactions"],
  },
  {
    id: "6",
    title: "Entrepreneurship",
    thumbnailColor: "#F2C87A",
    amount: "₦25,000",
    enrolledStudents: 50,
    earnedByLecturer: "₦1,500,000",
    earnedByInstitution: "₦1,500,000",
    dateCreated: "12-02-2026",
    status: "Active",
    category: "Business",
    courseCode: "BUS 300",
    pricing: "Paid",
    detailAmount: "₦25,000",
    detailEarnedByLecturer: "₦1,500,000",
    detailEarnedByInstitution: "₦1,500,000",
    modules: 6,
    lessons: 20,
    description: "From idea to launch: building your first venture.",
    whatTheyWillLearn: ["Validating a business idea", "Building a lean business plan", "Pitching to investors"],
  },
  {
    id: "7",
    title: "Backend Development",
    thumbnailColor: "#B79FE0",
    amount: "₦150,000",
    enrolledStudents: 3,
    earnedByLecturer: "₦450,000",
    earnedByInstitution: "₦450,000",
    dateCreated: "12-02-2026",
    status: "Unpublished",
    category: "Software Engineering",
    courseCode: "CSC 320",
    pricing: "Paid",
    detailAmount: "₦150,000",
    detailEarnedByLecturer: "₦450,000",
    detailEarnedByInstitution: "₦450,000",
    modules: 7,
    lessons: 21,
    description: "Server-side development with modern frameworks.",
    whatTheyWillLearn: ["REST API design", "Databases & ORMs", "Authentication & security basics"],
  },
];

export interface EnrolledStudent {
  id: string;
  name: string;
  username: string;
  dateEnrolled: string;
  status: EnrollmentStatus;
  progress: number;
  overallModules: number;
  modulesCompleted: number;
  modulesPending: number;
  currentModule: string;
  currentLesson: string;
  preQuizScore: string;
  postQuizScore: string;
  moduleBreakdown: { title: string; lessons: number; status: EnrollmentStatus }[];
}

const MODULE_BREAKDOWN = [
  { title: "Introduction to Design", lessons: 5, status: "Completed" as const },
  { title: "Basic Principles of Design", lessons: 5, status: "Completed" as const },
  { title: "Information Architecture", lessons: 5, status: "Ongoing" as const },
  { title: "How To Write Case Studies", lessons: 5, status: "Not Started" as const },
  { title: "Wrap up & Project", lessons: 5, status: "Not Started" as const },
];

export const MOCK_ENROLLED_STUDENTS: EnrolledStudent[] = [
  {
    id: "1",
    name: "Adejola Daniel",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Ongoing",
    progress: 70,
    overallModules: 5,
    modulesCompleted: 2,
    modulesPending: 3,
    currentModule: "Module 3- Introduction to Design",
    currentLesson: "What is design",
    preQuizScore: "2500",
    postQuizScore: "-",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
  {
    id: "2",
    name: "Ogunsola Omorinsola",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Completed",
    progress: 100,
    overallModules: 5,
    modulesCompleted: 5,
    modulesPending: 0,
    currentModule: "Module 5- Wrap up & Project",
    currentLesson: "Final submission",
    preQuizScore: "2200",
    postQuizScore: "4800",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
  {
    id: "3",
    name: "Ogunsola Omorinsola",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Completed",
    progress: 100,
    overallModules: 5,
    modulesCompleted: 5,
    modulesPending: 0,
    currentModule: "Module 5- Wrap up & Project",
    currentLesson: "Final submission",
    preQuizScore: "2100",
    postQuizScore: "4600",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
  {
    id: "4",
    name: "Ogunsola Omorinsola",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Ongoing",
    progress: 40,
    overallModules: 5,
    modulesCompleted: 2,
    modulesPending: 3,
    currentModule: "Module 3- Introduction to Design",
    currentLesson: "What is design",
    preQuizScore: "2000",
    postQuizScore: "-",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
  {
    id: "5",
    name: "Ogunsola Omorinsola",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Not Started",
    progress: 0,
    overallModules: 5,
    modulesCompleted: 0,
    modulesPending: 5,
    currentModule: "-",
    currentLesson: "-",
    preQuizScore: "-",
    postQuizScore: "-",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
  {
    id: "6",
    name: "Ogunsola Omorinsola",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Completed",
    progress: 100,
    overallModules: 5,
    modulesCompleted: 5,
    modulesPending: 0,
    currentModule: "Module 5- Wrap up & Project",
    currentLesson: "Final submission",
    preQuizScore: "2400",
    postQuizScore: "4900",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
  {
    id: "7",
    name: "Ogunsola Omorinsola",
    username: "Omorinn",
    dateEnrolled: "12-02-2026",
    status: "Not Started",
    progress: 0,
    overallModules: 5,
    modulesCompleted: 0,
    modulesPending: 5,
    currentModule: "-",
    currentLesson: "-",
    preQuizScore: "-",
    postQuizScore: "-",
    moduleBreakdown: MODULE_BREAKDOWN,
  },
];
