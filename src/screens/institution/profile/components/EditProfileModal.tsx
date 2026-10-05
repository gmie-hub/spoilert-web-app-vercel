"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import useUpdateProfileMutation from "@spt/hooks/apiRequests/useUpdateProfileMutation";

import { CheckIcon } from "./icons";
import ModalShell from "./ModalShell";
import PhoneNumberField from "./PhoneNumberField";

export interface ProfileChanges {
  name?: string;
  phone_number?: string;
  country_code?: string;
}

interface FormValues {
  name: string;
  email: string;
  phoneNumber: string;
}

const phoneSchema = Yup.string()
  .matches(/^\d+$/, "Phone number must contain only digits")
  .min(7, "Phone number is too short")
  .max(15, "Phone number is too long");

// `phoneOnly` is the Phone Number card's "Edit" — same form, just the number.
const EditProfileModal = ({
  phoneOnly = false,
  name,
  email,
  countryCode,
  phoneNumber,
  phoneVerified,
  onClose,
  onSaved,
}: {
  phoneOnly?: boolean;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  phoneVerified: boolean;
  onClose: () => void;
  onSaved: (changes: ProfileChanges) => void;
}) => {
  const { updateProfileHandler } = useUpdateProfileMutation();

  const validationSchema = Yup.object({
    name: phoneOnly
      ? Yup.string()
      : Yup.string()
          .trim()
          .min(2, "Institution name is too short")
          .required("Institution name is required"),
    // A verified number is locked; an existing one can be changed but not removed.
    phoneNumber: phoneVerified
      ? Yup.string()
      : phoneOnly || phoneNumber
        ? phoneSchema.required("Phone number is required")
        : phoneSchema,
  });

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // Only send what actually changed.
    const changes: ProfileChanges = {};
    const trimmedName = values.name.trim();
    if (!phoneOnly && trimmedName !== name) changes.name = trimmedName;
    if (!phoneVerified && values.phoneNumber !== phoneNumber) {
      changes.phone_number = values.phoneNumber;
      changes.country_code = countryCode;
    }

    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    try {
      await updateProfileHandler(changes);
      onSaved(changes);
    } catch {
      // The hook already shows the error toast; keep the form open to retry.
    } finally {
      actions.setSubmitting(false);
    }
  };

  const title = !phoneOnly ? "Edit Profile" : phoneNumber ? "Edit Phone Number" : "Add Phone Number";
  const description = !phoneOnly
    ? "Update your institution's details."
    : phoneNumber
      ? "Update your institution's phone number. You'll need to verify the new number after saving."
      : "Add your institution's phone number. You'll need to verify it after saving.";

  return (
    <ModalShell title={title} onClose={onClose}>
      <p className="mt-2 text-sm text-[#6B7280]">{description}</p>

      <Formik<FormValues>
        initialValues={{ name, email, phoneNumber }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <Form className="mt-6 space-y-5">
            {!phoneOnly && (
              <>
                <Input
                  name="name"
                  label="Institution Name"
                  placeholder="Enter your institution's name"
                />
                <div>
                  <Input name="email" label="Email Address" disabled />
                  <p className="mt-1 text-xs text-gray-400">
                    This is your log in email, so it can&rsquo;t be changed here.
                  </p>
                </div>
              </>
            )}

            <div>
              <PhoneNumberField countryCode={countryCode} disabled={phoneVerified} />
              {phoneVerified ? (
                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <CheckIcon />
                  Verified. To change it, please contact the admin.
                </p>
              ) : (
                !phoneOnly && (
                  <p className="mt-1 text-xs text-gray-400">
                    If you change it, you&rsquo;ll need to verify the new number.
                  </p>
                )
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="blueOutline"
                className="flex-1 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 disabled:opacity-50"
                disabled={!dirty || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default EditProfileModal;
