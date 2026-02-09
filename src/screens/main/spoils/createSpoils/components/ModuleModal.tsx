"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import Textarea from "@spt/components/textarea";

interface ModuleFormState {
  title: string;
  description: string;
}

interface ModuleModalProps {
  open: boolean;
  isEditing: boolean;
  initialValues: ModuleFormState;
  onClose: () => void;
  onSubmit: (
    values: ModuleFormState,
    helpers: FormikHelpers<ModuleFormState>,
  ) => void;
}

const moduleValidationSchema = yup.object({
  title: yup.string().trim().required("Module title is required"),
  description: yup.string().trim(),
});

const ModuleModal: FC<ModuleModalProps> = ({
  open,
  isEditing,
  initialValues,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Module" : "Add Module"}
    >
      <Formik<ModuleFormState>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={moduleValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4">
            <Input
              name="title"
              label="Module Title"
              placeholder="Title"
              hasAsterisk
            />

            <Textarea
              name="description"
              label="Description"
              rows={4}
              placeholder="Enter description for module"
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ModuleModal;
export type { ModuleFormState };
