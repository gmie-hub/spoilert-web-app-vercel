export interface EarningsBreakdownItem {
  id: string;
  title: string;
  thumbnailColor: string;
  amount: string;
  enrolledStudents: number;
  grossRevenue: string;
  lecturerShare: string;
  institutionShare: string;
}

export const EARNINGS_SUMMARY = {
  totalGrossRevenue: "₦1,800,000.00",
  totalLecturerEarnings: "₦500,000",
  totalInstitutionEarnings: "₦360,000",
  lecturerSplitPercent: 80,
  institutionSplitPercent: 20,
};

export const MOCK_EARNINGS_BREAKDOWN: EarningsBreakdownItem[] = [
  {
    id: "1",
    title: "Financial Literacy",
    thumbnailColor: "#E3A6A6",
    amount: "₦20,000",
    enrolledStudents: 150,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
  {
    id: "2",
    title: "Understanding Design Principles",
    thumbnailColor: "#F4C77B",
    amount: "₦100,000",
    enrolledStudents: 5,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
  {
    id: "3",
    title: "CHM202- IUPAC Nomenclature",
    thumbnailColor: "#7DB7B0",
    amount: "₦80,000",
    enrolledStudents: 20,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
  {
    id: "4",
    title: "BCH 404- Pharmacology",
    thumbnailColor: "#A6A6E3",
    amount: "₦40,000",
    enrolledStudents: 15,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
  {
    id: "5",
    title: "Frontend Development",
    thumbnailColor: "#8FB7E8",
    amount: "₦30,000",
    enrolledStudents: 8,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
  {
    id: "6",
    title: "Entrepreneurship",
    thumbnailColor: "#F2C87A",
    amount: "₦25,000",
    enrolledStudents: 50,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
  {
    id: "7",
    title: "Backend Development",
    thumbnailColor: "#B79FE0",
    amount: "₦150,000",
    enrolledStudents: 3,
    grossRevenue: "₦1,500,000",
    lecturerShare: "₦1,200,000",
    institutionShare: "₦300,000",
  },
];
