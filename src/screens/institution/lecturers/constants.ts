export type InviteStatus = "Accepted" | "Pending" | "Declined";

export interface Lecturer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  position: string;
  totalCourses: number;
  inviteStatus: InviteStatus;
  dateSent: string;
  lastLogin: string;
  bio?: string;
  metrics: {
    totalRevenueGenerated: string;
    totalSpoylzCreated: number;
    studentsEnrolled: number;
    institutionEarnings: string;
    lecturerEarnings: string;
  };
}

const LECTURER_BIO =
  "I am a dedicated professional with a deep understanding of design principles and user-centered development.  With years of experience in design, I have helped students navigate the complexities of user interface (UI) and user experience (UX) design.";

const ZERO_METRICS = {
  totalRevenueGenerated: "₦0",
  totalSpoylzCreated: 0,
  studentsEnrolled: 0,
  institutionEarnings: "₦0",
  lecturerEarnings: "₦0",
};

export const MOCK_LECTURERS: Lecturer[] = [
  {
    id: "1",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 1,
    inviteStatus: "Accepted",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    bio: LECTURER_BIO,
    metrics: {
      totalRevenueGenerated: "₦1,100,000",
      totalSpoylzCreated: 20,
      studentsEnrolled: 40,
      institutionEarnings: "₦80,000",
      lecturerEarnings: "₦280,000",
    },
  },
  {
    id: "2",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 4,
    inviteStatus: "Pending",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    metrics: ZERO_METRICS,
  },
  {
    id: "3",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 8,
    inviteStatus: "Accepted",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    bio: LECTURER_BIO,
    metrics: {
      totalRevenueGenerated: "₦1,100,000",
      totalSpoylzCreated: 20,
      studentsEnrolled: 40,
      institutionEarnings: "₦80,000",
      lecturerEarnings: "₦280,000",
    },
  },
  {
    id: "4",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 16,
    inviteStatus: "Pending",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    metrics: ZERO_METRICS,
  },
  {
    id: "5",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 22,
    inviteStatus: "Accepted",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    bio: LECTURER_BIO,
    metrics: {
      totalRevenueGenerated: "₦1,100,000",
      totalSpoylzCreated: 20,
      studentsEnrolled: 40,
      institutionEarnings: "₦80,000",
      lecturerEarnings: "₦280,000",
    },
  },
  {
    id: "6",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 18,
    inviteStatus: "Declined",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    metrics: ZERO_METRICS,
  },
  {
    id: "7",
    firstName: "Omorinsola",
    lastName: "Ogunsola",
    email: "morin234@gmail.com",
    phone: "090123456789",
    faculty: "Faculty of Medicine",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalCourses: 13,
    inviteStatus: "Accepted",
    dateSent: "22-07-2026",
    lastLogin: "25-02-2026",
    bio: LECTURER_BIO,
    metrics: {
      totalRevenueGenerated: "₦1,100,000",
      totalSpoylzCreated: 20,
      studentsEnrolled: 40,
      institutionEarnings: "₦80,000",
      lecturerEarnings: "₦280,000",
    },
  },
];
