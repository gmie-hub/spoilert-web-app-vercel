export type RevenueTransactionStatus = "Successful" | "Failed";

export interface RevenueTransaction {
  id: string;
  transactionId: string;
  studentName: string;
  spoylzTitle: string;
  thumbnailColor: string;
  lecturerName: string;
  spoylzAmount: string;
  lecturerShare: string;
  institutionShare: string;
  status: RevenueTransactionStatus;
  date: string;
  dateTime: string;
}

export const REVENUE_STATS = {
  totalTransactions: "20",
  totalLecturerEarnings: "₦10,000",
  totalRevenueOvertime: "₦2,150,000",
  totalRevenueToday: "₦10,000",
  totalRevenueThisWeek: "₦400,000",
  totalRevenueThisMonth: "₦700,000",
  lecturerSplitPercent: 80,
  institutionSplitPercent: 20,
};

export const MOCK_REVENUE_TRANSACTIONS: RevenueTransaction[] = [
  {
    id: "1",
    transactionId: "ID-1234567891",
    studentName: "Omorinsola Ogunsola",
    spoylzTitle: "Understanding Design Principles",
    thumbnailColor: "#F4C77B",
    lecturerName: "Tayo Adebanjo",
    spoylzAmount: "₦20,000",
    lecturerShare: "₦960,000",
    institutionShare: "₦240,000",
    status: "Successful",
    date: "22-07-2026",
    dateTime: "Feb 20th, 2026 | 8:00pm",
  },
  {
    id: "2",
    transactionId: "ID-1234567892",
    studentName: "Savannah Nguyen",
    spoylzTitle: "Frontend Development",
    thumbnailColor: "#8FB7E8",
    lecturerName: "Ogunsola Omorinsola",
    spoylzAmount: "₦100,000",
    lecturerShare: "₦720,000",
    institutionShare: "₦180,000",
    status: "Successful",
    date: "22-07-2026",
    dateTime: "Feb 20th, 2026 | 9:15am",
  },
  {
    id: "3",
    transactionId: "ID-1234567893",
    studentName: "Annette Black",
    spoylzTitle: "CHM202- IUPAC Nomenclature",
    thumbnailColor: "#7DB7B0",
    lecturerName: "Albert Flores",
    spoylzAmount: "₦80,000",
    lecturerShare: "₦600,000",
    institutionShare: "₦150,000",
    status: "Successful",
    date: "22-07-2026",
    dateTime: "Feb 21st, 2026 | 10:40am",
  },
  {
    id: "4",
    transactionId: "ID-1234567894",
    studentName: "Wade Warren",
    spoylzTitle: "Financial Literacy",
    thumbnailColor: "#E3A6A6",
    lecturerName: "Amarachi Eze",
    spoylzAmount: "₦40,000",
    lecturerShare: "₦850,000",
    institutionShare: "₦230,000",
    status: "Successful",
    date: "22-07-2026",
    dateTime: "Feb 21st, 2026 | 1:05pm",
  },
  {
    id: "5",
    transactionId: "ID-1234567895",
    studentName: "Jane Cooper",
    spoylzTitle: "BCH 404- Pharmacology",
    thumbnailColor: "#A6A6E3",
    lecturerName: "Yetunde Adeyemi",
    spoylzAmount: "₦30,000",
    lecturerShare: "₦290,000",
    institutionShare: "₦50,000",
    status: "Successful",
    date: "22-07-2026",
    dateTime: "Feb 22nd, 2026 | 11:20am",
  },
  {
    id: "6",
    transactionId: "ID-1234567896",
    studentName: "Dianne Russell",
    spoylzTitle: "Entrepreneurship",
    thumbnailColor: "#F2C87A",
    lecturerName: "Chioma Davies",
    spoylzAmount: "₦25,000",
    lecturerShare: "₦200,000",
    institutionShare: "₦80,000",
    status: "Failed",
    date: "22-07-2026",
    dateTime: "Feb 22nd, 2026 | 2:30pm",
  },
  {
    id: "7",
    transactionId: "ID-1234567897",
    studentName: "Theresa Webb",
    spoylzTitle: "Backend Development",
    thumbnailColor: "#B79FE0",
    lecturerName: "Timilehin Josiah",
    spoylzAmount: "₦150,000",
    lecturerShare: "₦160,000",
    institutionShare: "₦60,000",
    status: "Successful",
    date: "22-07-2026",
    dateTime: "Feb 23rd, 2026 | 4:50pm",
  },
];
