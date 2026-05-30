"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface SchedulePremiereFormState {
  date: string;
  time: string;
}

interface ScheduleSpoilPremiereModalProps {
  open: boolean;
  initialValues?: SchedulePremiereFormState;
  onClose: () => void;
  onSubmit: (
    values: SchedulePremiereFormState,
    helpers: FormikHelpers<SchedulePremiereFormState>,
  ) => void;
}

// const schedulePremiereValidationSchema = yup.object({
//   date: yup
//     .string()
//     .required("Date is required")
//     .test("is-future-date", "Date must be in the future", function (value) {
//       if (!value) return false;
//       const selectedDate = new Date(value);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return selectedDate >= today;
//     }),
//   time: yup.string().required("Time is required"),
// });

const defaultInitialValues: SchedulePremiereFormState = {
  date: "",
  time: "",
};

const ScheduleSpoilPremiereModal: FC<ScheduleSpoilPremiereModalProps> = ({
  open,
  initialValues = defaultInitialValues,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Schedule Spoylz Premiere">
      <Formik<SchedulePremiereFormState>
        initialValues={initialValues}
        enableReinitialize
        // validationSchema={schedulePremiereValidationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          isValid,
        }) => (
          <Form className="space-y-6">
            {/* Date Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={(e) => {
                    setFieldValue("date", e.target.value);
                    setFieldTouched("date", true);
                  }}
                  className={`
                    h-12 w-full px-3 rounded-lg border outline-none text-sm
                    ${touched.date && errors.date ? "border-red-500" : "border-gray-200"}
                  `}
                  placeholder="Select date"
                />
              </div>
              {touched.date && errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Time Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Time</label>
              <div className="relative">
                <input
                  type="time"
                  name="time"
                  value={values.time}
                  onChange={(e) => {
                    setFieldValue("time", e.target.value);
                    setFieldTouched("time", true);
                  }}
                  className={`
                    h-12 w-full px-3 rounded-lg border outline-none text-sm
                    ${touched.time && errors.time ? "border-red-500" : "border-gray-200"}
                  `}
                  placeholder="Select time"
                />
              </div>
              {touched.time && errors.time && (
                <p className="text-xs text-red-500">{errors.time}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ScheduleSpoilPremiereModal;
export type { SchedulePremiereFormState };
