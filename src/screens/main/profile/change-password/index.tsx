"use client";

import { useState } from "react";
import React from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import { useChangePasswordMutation } from "@spt/hooks/apiRequests/useChangePasswordMutation";
import { validations } from "@spt/utils/validation";

import PasswordSuccessModal from "./PasswordSuccessModal";



export default function ChangePasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate, isPending } = useChangePasswordMutation();

  const validationSchema = Yup.object().shape({
    current: Yup.string().required("Current password is required"),
    next: validations.password,
    confirm: Yup.string()
      .oneOf([Yup.ref("next")], "Passwords do not match")
      .required("Please re-enter your password"),
  });

  return (
    <div>
      <Formik
        initialValues={{ current: "", next: "", confirm: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          mutate(
            { current_password: values.current, password: values.next },
            {
              onSuccess: () => {
                setShowSuccess(true);
                actions.resetForm();
              },
            }
          );
        }}
      >
        {({   isValid, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-6 text-[#20262D]">Change Password</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Input
                    name="current"
                    type="password"
                    label="Current Password"
                    placeholder="Enter your password"
                  />
                
                </div>
                <div className="flex-1">
                  <Input
                    name="next"
                    type="password"
                    label="New Password"
                    placeholder="Enter your password"
                  />
                
                </div>
              </div>
              <div>
                <Input
                  name="confirm"
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your new password"
                />
               
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-10"
              disabled={isPending || !isValid}
            >
              {isPending ? "Changing..." : "Change Password"}
            </Button>
          </Form>
        )}
      </Formik>
      <PasswordSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
