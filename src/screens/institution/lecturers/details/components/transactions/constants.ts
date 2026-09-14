export type TransactionType = "Spoylz Purchase" | "Withdrawal" | "Airtime" | "Data";
export type TransactionStatus = "Successful" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  transactionType: TransactionType;
  transactionId: string;
  amount: string;
  date: string;
  time: string;
  status: TransactionStatus;
  description: string;
  studentName?: string;
  spoylzTitle?: string;
  spoylzCostFee?: string;
  administratorFee?: string;
  certificateFee?: string;
  vat?: string;
  totalAmountPaid?: string;
  accountCredited?: string;
  phoneNumber?: string;
  network?: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    transactionType: "Spoylz Purchase",
    transactionId: "ID-12345683901",
    amount: "₦150,000",
    date: "12-10-2026",
    time: "09:43am",
    status: "Successful",
    description: "Ogunsola Omorinsola purchased Financial Literacy",
    studentName: "Ogunsola Omorinsola",
    spoylzTitle: "Financial Literacy",
    spoylzCostFee: "₦150,000",
    administratorFee: "₦2,000",
    certificateFee: "₦500",
    vat: "₦0.00",
    totalAmountPaid: "₦152,500",
  },
  {
    id: "2",
    transactionType: "Withdrawal",
    transactionId: "ID-12345683902",
    amount: "₦250,000",
    date: "12-10-2026",
    time: "11:05am",
    status: "Successful",
    description: "Withdrawal to bank account",
    accountCredited: "2102925627 (Access Bank) - Ogunsola Omorinsola",
  },
  {
    id: "3",
    transactionType: "Airtime",
    transactionId: "ID-12345683903",
    amount: "₦2,000",
    date: "12-10-2026",
    time: "01:20pm",
    status: "Successful",
    description: "Airtime purchase from wallet balance",
    phoneNumber: "0901 234 5678",
    network: "MTN",
  },
  {
    id: "4",
    transactionType: "Data",
    transactionId: "ID-12345683904",
    amount: "₦1,000",
    date: "12-10-2026",
    time: "09:43am",
    status: "Successful",
    description: "Data purchase from wallet balance",
    phoneNumber: "0901 234 5678",
    network: "MTN",
  },
  {
    id: "5",
    transactionType: "Spoylz Purchase",
    transactionId: "ID-12345683905",
    amount: "₦10,000",
    date: "12-10-2026",
    time: "09:43am",
    status: "Pending",
    description: "Ogunsola Omorinsola purchased Frontend Development",
    studentName: "Ogunsola Omorinsola",
    spoylzTitle: "Frontend Development",
    spoylzCostFee: "₦10,000",
    administratorFee: "₦2,000",
    certificateFee: "₦500",
    vat: "₦0.00",
    totalAmountPaid: "₦12,500",
  },
  {
    id: "6",
    transactionType: "Spoylz Purchase",
    transactionId: "ID-12345683906",
    amount: "₦100,000",
    date: "12-10-2026",
    time: "09:43am",
    status: "Failed",
    description: "Ogunsola Omorinsola purchased Entrepreneurship",
    studentName: "Ogunsola Omorinsola",
    spoylzTitle: "Entrepreneurship",
    spoylzCostFee: "₦100,000",
    administratorFee: "₦2,000",
    certificateFee: "₦500",
    vat: "₦0.00",
    totalAmountPaid: "₦102,500",
  },
  {
    id: "7",
    transactionType: "Withdrawal",
    transactionId: "ID-12345683907",
    amount: "₦40,000",
    date: "12-10-2026",
    time: "09:43am",
    status: "Successful",
    description: "Withdrawal to bank account",
    accountCredited: "2102925627 (Access Bank) - Ogunsola Omorinsola",
  },
];
