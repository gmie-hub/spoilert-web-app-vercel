"use client";

import { useState } from "react";

import { MOCK_TRANSACTIONS, type Transaction } from "./constants";
import TransactionDetailsModal from "./TransactionDetailsModal";
import TransactionsTable from "./TransactionsTable";

const TransactionsTab = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <>
      <TransactionsTable transactions={MOCK_TRANSACTIONS} onViewMore={setSelectedTransaction} />
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
};

export default TransactionsTab;
