export type TransactionKind = "purchase" | "withdrawal" | "other";

// Text fields hold "-" when the API has nothing for them.
export interface Transaction {
  id: string;
  // Decides which detail rows the modal shows.
  kind: TransactionKind;
  transactionType: string;
  transactionId: string;
  amount: string;
  date: string;
  time: string;
  status: string | null;
  description: string;
  studentName: string;
  spoylzTitle: string;
  spoylzCostFee: string;
  administratorFee: string;
  certificateFee: string;
  vat: string;
  totalAmountPaid: string;
  accountCredited: string;
}
