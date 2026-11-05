// One row of the Transaction History table, mapped from GET /payments. Values
// the API doesn't serve are "-" (status is null).
export interface RevenueTransaction {
  id: string;
  transactionId: string;
  studentName: string;
  spoylzTitle: string;
  thumbnail: string | null;
  lecturerName: string;
  spoylzAmount: string;
  lecturerShare: string;
  institutionShare: string;
  status: string | null;
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
