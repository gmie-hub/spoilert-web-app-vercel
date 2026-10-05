"use client";

import { useState } from "react";

import useGetLecturerSpoilsQuery from "@spt/hooks/apiRequests/useGetLecturerSpoilsQuery";
import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";

import { PAGE_SIZE } from "../../../utils";
import { toTransaction } from "../../mappers";

import TransactionDetailsModal from "./TransactionDetailsModal";
import TransactionsTable from "./TransactionsTable";

import type { Transaction } from "./types";
import type { Lecturer } from "../../../types";

const TransactionsTab = ({ lecturer }: { lecturer: Lecturer }) => {
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { payments, pagination, isLoading, isError, errorMessage } = useGetPaymentsQuery({
    tutor_id: lecturer.userId,
    page,
    per_page: PAGE_SIZE,
  });
  // Payments only carry a spoil id; the lecturer's spoils give its title.
  const { spoils } = useGetLecturerSpoilsQuery(lecturer.userId);
  const spoilTitles = new Map(spoils.map((spoil) => [spoil.id, spoil.title]));

  return (
    <>
      <TransactionsTable
        transactions={payments.map((payment) => toTransaction(payment, spoilTitles))}
        isLoading={isLoading}
        errorMessage={isError ? errorMessage : null}
        page={page}
        // Keeps the current page listed while the next one loads.
        totalPages={Math.max(page, pagination.last_page)}
        firstRowNumber={(page - 1) * (pagination.per_page ?? PAGE_SIZE) + 1}
        onPageChange={setPage}
        onViewMore={setSelectedTransaction}
      />
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
