"use client";

import { useState } from "react";

import { Form, Formik } from "formik";

import { Card } from "@spt/components";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import { useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";
import { useVerifyBankMutation } from "@spt/hooks/apiRequests/useVerifyBankAccountMutation";

export interface BankDetails {
  bankId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const AddBankAccountStep = ({ onNext }: { onNext: (details: BankDetails) => void }) => {
  const [bankSearch, setBankSearch] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState<string | null>(null);

  const { data, isLoading } = useGetBanksQuery(bankSearch, 1, 50);
  const banks = data?.data?.data ?? [];
  const bankOptions = banks.map((bank) => ({ value: bank.code, label: bank.name }));

  const { verifyBankHandler, isLoading: isVerifying } = useVerifyBankMutation();

  const verifyAccount = async (number: string, code: string) => {
    if (number.length !== 10 || !code) return;

    const bank = banks.find((b) => b.code === code);
    if (!bank) return;

    const result = await verifyBankHandler(number, bank.id);
    setAccountName(result?.data?.res?.account_name ?? null);
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    setAccountName(null);
    if (value.length === 10) verifyAccount(value, bankCode);
  };

  const handleSubmit = () => {
    const bank = banks.find((b) => b.code === bankCode);

    onNext({
      bankId: bank?.id ?? 0,
      bankName: bank?.name ?? bankCode,
      accountNumber,
      accountName: accountName ?? "",
    });
  };

  return (
    <main className="w-full bg-white">
      <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
        <h1 className="text-center text-2xl font-semibold text-[#212529] sm:text-[28px]">
          Add Bank Account
        </h1>

        <div className="mt-6 flex gap-3 rounded-lg border border-[var(--color-blue-lightest)] bg-[var(--color-blue-lightest)] p-4 text-sm text-[#212529]">
          <svg
            className="mt-0.5 shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="var(--color-blue)" strokeWidth="1.5" />
            <path d="M12 11v5" stroke="var(--color-blue)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1" fill="var(--color-blue)" />
          </svg>
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
              onSearchChange={setBankSearch}
              onChange={(value) => {
                setBankCode(value);
                setAccountName(null);
                if (accountNumber.length === 10) verifyAccount(accountNumber, value);
              }}
            />

            <div>
              <Input
                name="accountNumber"
                label="Account Number"
                placeholder="Enter account number"
                numericOnly
                onValueChange={handleAccountNumberChange}
              />
              {isVerifying && (
                <p className="mt-1 text-xs text-gray-400">Verifying account number...</p>
              )}
              {accountName && !isVerifying && (
                <p className="mt-1 text-xs text-gray-500">{accountName}</p>
              )}
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={accountNumber.length !== 10}
              onClick={handleSubmit}
            >
              Save Bank Details
            </Button>
          </Form>
        </Formik>
      </Card>
    </main>
  );
};

export default AddBankAccountStep;
