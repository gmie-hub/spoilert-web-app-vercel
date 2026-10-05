"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";

import EditIcon from "@spt/assets/icons/edit-2profile.svg";
import { SuccessModal } from "@spt/components";
import Button from "@spt/components/button";
import useProfileDetailsQuery from "@spt/hooks/apiRequests/useProfileDetailsQuery";
import { useVerifyPhoneMutation } from "@spt/hooks/apiRequests/useVerifyPhoneMutation";
import { useAuthStore } from "@spt/store/authStore";

import AddBankAccountModal from "./components/AddBankAccountModal";
import EditProfileModal from "./components/EditProfileModal";
import { BankIcon, PencilIcon, PhoneIcon } from "./components/icons";
import PhoneOtpModal from "./components/PhoneOtpModal";
import VerificationCard from "./components/VerificationCard";

import type { BankDetails } from "./components/AddBankAccountForm";
import type { ProfileChanges } from "./components/EditProfileModal";

type SuccessModalKind = "phone" | "bank" | null;
type EditMode = "profile" | "phone" | null;

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

// "University of Lagos" -> "UL", "aunty jummy international" -> "AJ"
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => word && !/^(of|and|the|for|&)$/i.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || name.charAt(0).toUpperCase();

const InstitutionProfile = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useProfileDetailsQuery();
  const { sendOtp, isLoading: isSendingOtp } = useVerifyPhoneMutation();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [successModal, setSuccessModal] = useState<SuccessModalKind>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [addedBank, setAddedBank] = useState<BankDetails | null>(null);

  // Fresh profile data wins; the logged-in user covers the time it's unavailable.
  const profile = data?.data ?? user;
  const institutionName = profile?.name || "Your Institution";
  const countryCode = String(profile?.country_code || "234").replace("+", "");
  // Stored as typed at sign-up (e.g. 09012345678); shown and sent for OTP without the 0.
  const rawPhoneNumber = String(profile?.phone_number || "");
  const phoneNumber = rawPhoneNumber.replace(/^0/, "");
  const phoneVerifiedAt = profile?.phone_verified_at;

  const savedBank = profile?.bank_accounts?.[0];
  const bankAccount = savedBank
    ? {
        bankName: savedBank.bank_name ?? savedBank.bank?.name ?? savedBank.bank_code,
        accountNumber: savedBank.account_number,
        accountName: savedBank.account_name,
      }
    : addedBank;

  // Show a change straight away — in the cached profile and the logged-in user
  // (which feeds the dashboard header) — while the profile refetch confirms it.
  const applyProfileChanges = (changes: ProfileChanges & { phone_verified_at?: string }) => {
    queryClient.setQueriesData({ queryKey: ["user-profile"] }, (old: any) =>
      old?.data ? { ...old, data: { ...old.data, ...changes } } : old,
    );

    const { user: currentUser, token } = useAuthStore.getState();
    if (currentUser && token) {
      useAuthStore.getState().setAuth({ user: { ...currentUser, ...changes }, token });
    }
  };

  const markPhoneVerified = () => {
    applyProfileChanges({ phone_verified_at: new Date().toISOString() });
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  };

  const handleVerifyPhone = async () => {
    if (isSendingOtp) return;

    try {
      const response = await sendOtp({ country_code: countryCode, phone_number: phoneNumber });
      toast.success(response?.message || "OTP sent successfully 📲");
      setShowOtpModal(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";

      // The backend already has this number down as verified — just sync the UI.
      if (message === "Phone already verified.") {
        toast.success(message);
        markPhoneVerified();
        return;
      }
      toast.error(message);
    }
  };

  const phoneFooter = phoneVerifiedAt ? (
    <p className="text-sm text-gray-400">
      To change your phone number, please contact the admin.
    </p>
  ) : phoneNumber ? (
    <Button type="button" className="w-full disabled:opacity-50" disabled={isSendingOtp} onClick={handleVerifyPhone}>
      {isSendingOtp ? "Sending Code…" : "Verify Phone Number"}
    </Button>
  ) : (
    <Button type="button" className="w-full" onClick={() => setEditMode("phone")}>
      Add Phone Number
    </Button>
  );

  const bankFooter = bankAccount ? (
    <p className="text-sm text-gray-400">
      Only one bank account can be linked. To change it, please contact the admin.
    </p>
  ) : (
    <Button type="button" className="w-full" onClick={() => setShowBankModal(true)}>
      Add Bank Account
    </Button>
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#212529]">Profile</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage your institution&rsquo;s details, phone number and bank account
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-[112px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-[360px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
            <div className="h-[360px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue-lightest)] text-xl font-semibold text-[var(--color-blue)]">
                {getInitials(institutionName)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-[#212529]">{institutionName}</h2>
                <p className="truncate text-sm text-gray-400">{profile?.email || "—"}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="darkBlue"
              iconLeft={<Image src={EditIcon} alt="" className="h-5 w-5" />}
              className="shrink-0 !gap-2 !px-4 !py-2 !text-sm"
              onClick={() => setEditMode("profile")}
            >
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VerificationCard
              icon={<PhoneIcon />}
              iconBg="bg-[var(--color-blue-lightest)]"
              title="Phone Number"
              description="Verify the phone number linked to your institution so we can reach you about your account."
              verified={Boolean(phoneVerifiedAt)}
              pendingLabel="Not Verified"
              rows={[
                { label: "Country Code", value: `+${countryCode}` },
                {
                  label: "Phone Number",
                  value: phoneNumber,
                  // Only an unverified number can be changed from here.
                  action: phoneNumber && !phoneVerifiedAt && (
                    <button
                      type="button"
                      onClick={() => setEditMode("phone")}
                      aria-label="Edit phone number"
                      className="flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--color-blue)] hover:underline"
                    >
                      <PencilIcon />
                      Edit
                    </button>
                  ),
                },
                { label: "Verified On", value: formatDate(phoneVerifiedAt) },
              ]}
              footer={phoneFooter}
            />

            <VerificationCard
              icon={<BankIcon />}
              iconBg="bg-orange-50"
              title="Bank Account"
              description="This account will be used for all your earnings as an Institution."
              verified={Boolean(bankAccount)}
              pendingLabel="Not Added"
              rows={[
                { label: "Bank Name", value: bankAccount?.bankName },
                { label: "Account Number", value: bankAccount?.accountNumber },
                { label: "Account Name", value: bankAccount?.accountName },
              ]}
              footer={bankFooter}
            />
          </div>
        </>
      )}

      {editMode && (
        <EditProfileModal
          phoneOnly={editMode === "phone"}
          name={profile?.name ?? ""}
          email={profile?.email ?? ""}
          countryCode={countryCode}
          phoneNumber={rawPhoneNumber}
          phoneVerified={Boolean(phoneVerifiedAt)}
          onClose={() => setEditMode(null)}
          onSaved={(changes: ProfileChanges) => {
            setEditMode(null);
            applyProfileChanges(changes);
          }}
        />
      )}

      {showOtpModal && (
        <PhoneOtpModal
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onClose={() => setShowOtpModal(false)}
          onVerified={() => {
            setShowOtpModal(false);
            markPhoneVerified();
            setSuccessModal("phone");
          }}
        />
      )}

      {showBankModal && (
        <AddBankAccountModal
          onClose={() => setShowBankModal(false)}
          onAdded={(details) => {
            setShowBankModal(false);
            setAddedBank(details);
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            setSuccessModal("bank");
          }}
        />
      )}

      {successModal === "phone" && (
        <SuccessModal
          title="Phone Number Verified Successfully 🎉"
          description="Your institution's phone number has been verified."
          onContinue={() => setSuccessModal(null)}
        />
      )}

      {successModal === "bank" && (
        <SuccessModal
          title="Bank Account Added Successfully 🎉"
          description="Your institution bank account has been added successfully. All your earnings will be paid into this account."
          onContinue={() => setSuccessModal(null)}
        />
      )}
    </div>
  );
};

export default InstitutionProfile;
