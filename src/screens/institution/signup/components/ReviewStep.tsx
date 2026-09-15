import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import EditIcon from "@spt/assets/icons/edit.svg";
import Button from "@spt/components/button";

import {
  INSTITUTION_COUNTRIES,
  INSTITUTION_POSITIONS,
  INSTITUTION_TYPES,
  type SignupStep,
} from "../constants";

import type { InstitutionApplicationValues } from "../types";

const ReviewSection = ({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-100">
    <div className="flex items-center justify-between bg-[var(--color-blue-lightest)] px-4 py-3">
      <h3 className="text-sm font-semibold text-[var(--color-blue)]">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 rounded-full border border-[var(--color-blue)]/20 bg-white px-3 py-1 text-xs font-medium text-[var(--color-blue)]"
      >
        <Image src={EditIcon} alt="" width={14} height={14} />
        Edit
      </button>
    </div>
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 text-sm sm:grid-cols-2">
      {children}
    </div>
  </div>
);

const ReviewField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-[#6B7280]">{label}</p>
    <p className="font-medium text-[#212529]">{value || "—"}</p>
  </div>
);

const ReviewStep = ({
  values,
  isSubmitting,
  onEdit,
  onSubmit,
}: {
  values: InstitutionApplicationValues;
  isSubmitting: boolean;
  onEdit: (step: SignupStep) => void;
  onSubmit: () => void;
}) => {
  const institutionType = INSTITUTION_TYPES.find(
    (option) => option.value === values.institutionType,
  )?.label;
  const country = INSTITUTION_COUNTRIES.find(
    (option) => option.value === values.country,
  )?.label;
  const position = INSTITUTION_POSITIONS.find(
    (option) => option.value === values.repPosition,
  )?.label;

  return (
    <>
      <div className="mt-8 space-y-1">
        <h2 className="text-lg font-semibold text-[#212529]">
          Review Your Application
        </h2>
        <p className="text-sm text-[#6B7280]">
          Verify the information before submitting. Applications are reviewed
          within 48 hours.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <ReviewSection
          title="Institution Information"
          onEdit={() => onEdit("institution")}
        >
          <ReviewField label="Institution Name" value={values.institutionName} />
          <ReviewField label="Institution Type" value={institutionType ?? ""} />
          <ReviewField label="Country" value={country ?? ""} />
          <ReviewField label="State" value={values.state} />
          <ReviewField label="City" value={values.city} />
          <div className="sm:col-span-2">
            <ReviewField
              label="Institution Address"
              value={values.institutionAddress}
            />
          </div>
          <ReviewField
            label="Official Institution Email Address"
            value={values.officialEmail}
          />
          <ReviewField label="Phone Number" value={values.phone} />
        </ReviewSection>

        <ReviewSection
          title="Representative Contact Info"
          onEdit={() => onEdit("contact")}
        >
          <ReviewField label="Full Name" value={values.repFullName} />
          <ReviewField label="Email Address" value={values.repEmail} />
          <ReviewField label="Phone Number" value={values.repPhone} />
          <ReviewField label="Position in the Institution" value={position ?? ""} />
        </ReviewSection>
      </div>

      <Button
        type="button"
        className="mt-8 w-full"
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        Submit Application
      </Button>

      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Already have an account?{" "}
        <Link
          href="/institution/login"
          className="font-medium text-[var(--color-yellow)] hover:underline"
        >
          Log In
        </Link>
      </p>
    </>
  );
};

export default ReviewStep;
