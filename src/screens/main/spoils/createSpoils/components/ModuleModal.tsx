"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import Textarea from "@spt/components/textarea";
import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";

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
    serverId?: string | number,
  ) => void;
  /** optional spoil id to attach new modules to server-side spoil */
  spoilId?: string | number | null;
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
  const { createModuleHandler, isLoading: isCreatingModule } = useCreateModuleMutation();

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
        onSubmit={async (values, helpers) => {
          const payload = {
            title: values.title.trim(),
            description: values.description.trim(),
          };

          // If not editing and we have a server-side create handler, try to create on server
          if (!isEditing && createModuleHandler) {
            try {
              const res = await createModuleHandler(payload as any);
              const serverModuleId = res?.data?.id ?? res?.data?.module?.id ?? undefined;
              onSubmit(values, helpers, serverModuleId);
              return;
            } catch (err) {
              // API hook shows toast; fall back to local submit
              onSubmit(values, helpers);
              return;
            }
          }

          // Default: delegate to parent
          onSubmit(values, helpers);
        }}
      >
        {() => (
          <Form className="space-y-4">
            <Input
              name="title"
              label="Module Title"
              placeholder="Title"
              // hasAsterisk
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
              <Button type="submit" disabled={ isCreatingModule}>
                {isCreatingModule ? "Saving..." : "Save"}
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
