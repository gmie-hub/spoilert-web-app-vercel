"use client";

import React, { useState } from "react";

import { Form, Formik, FormikHelpers, useField } from "formik";
import { FiChevronLeft, FiPlus, FiX } from "react-icons/fi";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";
import useUpdateProfileMutation from "@spt/hooks/apiRequests/useUpdateProfileMutation";

import type { ProfileDetailsData, ProfileDetailsFormValues } from "./types";

const COUNTRY_OPTIONS = [
  { value: "+234", label: "🇳🇬 +234" },
  { value: "+44", label: "🇬🇧 +44" },
  { value: "+1", label: "🇺🇸 +1" },
];

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits"),
  bio: Yup.string().max(500, "Bio must be at most 500 characters"),
  expertise: Yup.array().of(Yup.string()),
});

interface ExpertiseFieldProps {
  name: string;
}

const ExpertiseField = ({ name }: ExpertiseFieldProps) => {
  const [field, , helpers] = useField<string[]>(name);
  const [inputValue, setInputValue] = useState("");

  const addExpertise = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !field.value.includes(trimmed)) {
      helpers.setValue([...field.value, trimmed]);
      setInputValue("");
    }
  };

  const removeExpertise = (index: number) => {
    const newValue = field.value.filter((_, i) => i !== index);
    helpers.setValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addExpertise();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Expertise</label>
        <button
          type="button"
          onClick={addExpertise}
          className="flex items-center gap-1 text-sm text-[var(--color-blue)] hover:underline"
        >
          <FiPlus size={14} />
          Add
        </button>
      </div>

      {/* Input for adding new expertise */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter or click Add"
        className="h-12 w-full px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[var(--color-blue)]"
      />

      {/* List of expertise tags */}
      <div className="space-y-2">
        {field.value.map((expertise, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white"
          >
            <span className="text-sm text-[#20262D]">{expertise}</span>
            <button
              type="button"
              onClick={() => removeExpertise(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface EditProfileFormProps {
  initialData: ProfileDetailsData;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditProfileForm = ({ initialData, onCancel, onSuccess }: EditProfileFormProps) => {
  const { updateProfileHandler, isLoading } = useUpdateProfileMutation();

  const initialValues: ProfileDetailsFormValues = {
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    username: initialData.username,
    email: initialData.email,
    countryCode: initialData.countryCode,
    phoneNumber: initialData.phoneNumber,
    bio: initialData.bio,
    expertise: initialData.expertise || [],
  };

  const handleSubmit = async (
    values: ProfileDetailsFormValues,
    actions: FormikHelpers<ProfileDetailsFormValues>
  ) => {
    try {
      await updateProfileHandler({
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
        phone_number: values.phoneNumber,
        country_code: values.countryCode.replace("+", ""),
        bio: values.bio,
        expertise: values.expertise,
      });
      onSuccess();
    } catch {
      // Error is handled by the mutation hook
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-sm text-[var(--color-blue)] hover:underline"
          >
            <FiChevronLeft size={18} />
            Back
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold text-[#20262D]">Edit Profile</h2>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="firstName" label="First Name" placeholder="Enter first name" />
              <Input name="lastName" label="Last Name" placeholder="Enter last name" />
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="username" label="Username" placeholder="Enter username" />
              <Input 
                name="email" 
                label="Email Address" 
                placeholder="Enter email" 
                type="email" 
                disabled 
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="flex items-center gap-2">
                <div className="w-32">
                  <Select label="" name="countryCode" options={COUNTRY_OPTIONS} />
                </div>
                <div className="flex-1">
                  <Input name="phoneNumber" label="" placeholder="901234567" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <Textarea
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself..."
              rows={4}
            />

            {/* Expertise */}
            <ExpertiseField name="expertise" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="blueOutline"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="min-w-[140px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="darkBlue"
              disabled={isSubmitting || isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
