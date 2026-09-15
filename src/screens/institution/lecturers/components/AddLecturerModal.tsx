import { Form, Formik } from "formik";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import { validations } from "@spt/utils/validation";

export interface LecturerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  position: string;
}

const initialValues: LecturerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  faculty: "",
  department: "",
  position: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: validations.email,
  phone: validations.phoneNumber,
  faculty: Yup.string().trim().required("Faculty is required"),
  department: Yup.string().trim().required("Department is required"),
  position: Yup.string().trim().required("Academic position is required"),
});

const AddLecturerModal = ({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (values: LecturerFormValues) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
    <div className="w-full max-w-[560px] rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.15)] sm:p-10">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold text-[#212529] sm:text-2xl">Add Lecturer</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="mt-2 text-sm text-[#6B7280]">
        Enter the lecturer&rsquo;s details below. We&rsquo;ll send them an email
        with a secure invitation to join your institution on Spoylzert.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          onAdded(values);
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="mt-6 space-y-5">
            <Input name="firstName" label="First Name" placeholder="Enter first name" />
            <Input name="lastName" label="Last Name" placeholder="Enter last name" />
            <Input name="email" type="email" label="Email Address" placeholder="example@domain.com" />
            <Input name="phone" label="Phone Number" placeholder="Enter phone number" numericOnly />
            <Input name="faculty" label="Faculty" placeholder="e.g. Faculty of Medical Sciences" />
            <Input name="department" label="Department" placeholder="e.g. Pharmacy" />
            <Input name="position" label="Academic Position" placeholder="e.g. Senior Lecturer" />

            <div className="flex gap-4 pt-2">
              <Button type="button" variant="blueOutline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={!isValid || isSubmitting}>
                Add Lecturer
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);

export default AddLecturerModal;
