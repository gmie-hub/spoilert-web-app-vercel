import Link from "next/link";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";

import {
  INSTITUTION_COUNTRIES,
  INSTITUTION_POSITIONS,
  INSTITUTION_TYPES,
  NIGERIA_STATES,
  type SignupStep,
} from "../constants";

import type { InstitutionApplicationValues } from "../types";
import type { FormikProps } from "formik";

const StepForm = ({
  step,
  formik,
  onBack,
}: {
  step: Exclude<SignupStep, "review" | "success">;
  formik: FormikProps<InstitutionApplicationValues>;
  onBack: () => void;
}) => (
  <>
    <div className="mt-8 space-y-1">
      <h2 className="text-lg font-semibold text-[#212529]">
        {step === "institution" ? "Institution Information" : "Representative Contact Info"}
      </h2>
      <p className="text-sm text-[#6B7280]">
        {step === "institution"
          ? "Provide details about your official institution to start the verification."
          : "This person will become the primary administrator for the institution if approved."}
      </p>
    </div>

    <div className="mt-6 space-y-5">
      {step === "institution" && (
        <>
          <Input
            name="institutionName"
            label="Institution Name"
            placeholder="Enter the name of your institution"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              name="institutionType"
              label="Institution Type"
              placeholder="Select type"
              options={INSTITUTION_TYPES}
            />
            <Select
              name="country"
              label="Country"
              placeholder="Select country"
              options={INSTITUTION_COUNTRIES}
              searchable
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              name="state"
              label="State"
              placeholder="Select state"
              options={NIGERIA_STATES}
              searchable
            />
            <Input name="city" label="City" placeholder="Enter the city" />
          </div>

          <Input
            name="institutionAddress"
            label="Institution Address"
            placeholder="Enter the address of your institution"
          />

          <Input
            name="officialEmail"
            type="email"
            label="Official Institution Email Address"
            placeholder="example @gmail.com"
          />

          <Input
            name="phone"
            label="Phone Number"
            placeholder="Enter the institution's phone number"
            numericOnly
          />
        </>
      )}

      {step === "contact" && (
        <>
          <Input
            name="repFullName"
            label="Full Name"
            placeholder="Enter the full name of the representative"
          />

          <div className="flex flex-col gap-1">
            <Input
              name="repEmail"
              type="email"
              label="Email Address"
              placeholder="example @gmail.com"
            />
            <p className="text-xs text-[#6B7280]">
              This would be your institution account log in email address
            </p>
          </div>

          <Input
            name="repPhone"
            label="Phone Number"
            placeholder="e.g 09012345678"
            numericOnly
          />

          <Select
            name="repPosition"
            label="Position in the Institution"
            placeholder="Select the role of the person in the institution"
            options={INSTITUTION_POSITIONS}
          />
        </>
      )}
    </div>

    <div className={`mt-8 ${step === "contact" ? "flex gap-4" : ""}`}>
      {step === "contact" && (
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Previous
        </Button>
      )}
      <Button
        type="submit"
        className={step === "contact" ? "flex-1" : "w-full"}
        disabled={formik.isSubmitting}
      >
        Save and Continue
      </Button>
    </div>

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

export default StepForm;
