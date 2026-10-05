"use client";

import { useRef, useState } from "react";

import { Form, Formik } from "formik";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import { type BankData, useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";
import { useVerifyBankMutation } from "@spt/hooks/apiRequests/useVerifyBankAccountMutation";

import { InfoIcon } from "./icons";

export interface BankDetails {
  bankId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const AddBankAccountForm = ({ onNext }: { onNext: (details: BankDetails) => void }) => {
  const [bankSearch, setBankSearch] = useState("");
  // Kept as the bank itself, not looked up later — every search replaces the list.
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState<string | null>(null);
  const [verifyFailed, setVerifyFailed] = useState(false);
  // Bumped on every bank/account-number change so a slow response for an
  // older combination can't overwrite the current one.
  const latestRequest = useRef(0);

  // Searched on the backend, e.g. banks/NG?page=1&per_page=50&search=polaris
  const { data, isLoading } = useGetBanksQuery(bankSearch, 1, 50);
  const banks = data?.data?.data ?? [];
  // Keyed by id: verification needs the id, and bank codes aren't guaranteed unique.
  const bankOptions = banks.map((bank) => ({ value: String(bank.id), label: bank.name }));

  const {
    verifyBankHandler,
    isLoading: isVerifying,
    errorMessage: verifyErrorMessage,
  } = useVerifyBankMutation();

  const resetVerification = () => {
    latestRequest.current += 1;
    setAccountName(null);
    setVerifyFailed(false);
  };

  const verifyAccount = async (number: string, bank: BankData | null) => {
    if (number.length !== 10 || !bank) return;

    const requestId = latestRequest.current;
    const result = await verifyBankHandler(number, bank.id);
    if (requestId !== latestRequest.current) return;

    const name = result?.data?.res?.account_name ?? null;
    setAccountName(name);
    setVerifyFailed(!name);
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    resetVerification();
    if (value.length === 10) verifyAccount(value, selectedBank);
  };

  const handleSubmit = () => {
    if (!selectedBank || !accountName) return;

    onNext({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      accountNumber,
      accountName,
    });
  };

  return (
    <>
      <div className="mt-6 flex gap-3 rounded-lg border border-[var(--color-blue-lightest)] bg-[var(--color-blue-lightest)] p-4 text-sm text-[#212529]">
        <InfoIcon />
        <p>
          This account will be used for all your earnings as an Institution.
          Note that only <strong>one</strong> bank account can be added to
          receive payments. Please verify that your details are correct
          before saving.
        </p>
      </div>

      <Formik initialValues={{ bankName: "", accountNumber: "" }} onSubmit={() => {}}>
        <Form className="mt-6 space-y-5">
          <Select
            name="bankName"
            label="Bank Name"
            searchable
            placeholder="Select bank name"
            options={bankOptions}
            isLoading={isLoading}
            filterOnFrontend={false}
            onSearchChange={setBankSearch}
            onChange={(value) => {
              const bank = banks.find((b) => String(b.id) === value) ?? null;
              setSelectedBank(bank);
              // The search box is cleared on pick, so drop the backend filter too —
              // otherwise reopening shows stale results under an empty search box.
              setBankSearch("");
              resetVerification();
              if (accountNumber.length === 10) verifyAccount(accountNumber, bank);
            }}
          />

          <div>
            <Input
              name="accountNumber"
              label="Account Number"
              placeholder="Enter 10-digit account number"
              numericOnly
              onValueChange={handleAccountNumberChange}
            />
            {isVerifying && (
              <p className="mt-1 text-xs text-gray-400">Verifying account number...</p>
            )}
            {accountName && !isVerifying && (
              <p className="mt-1 text-xs font-medium text-green-600">{accountName}</p>
            )}
            {verifyFailed && !isVerifying && (
              <p className="mt-1 text-xs text-red-500">
                {verifyErrorMessage ||
                  "We couldn't verify this account. Please check the bank and account number."}
              </p>
            )}
          </div>

          <Button
            type="button"
            className="w-full disabled:opacity-50"
            disabled={accountNumber.length !== 10 || !accountName || isVerifying}
            onClick={handleSubmit}
          >
            Save Bank Details
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default AddBankAccountForm;
