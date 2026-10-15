"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import Input from "@spt/components/input";
import Textarea from "@spt/components/textarea";
import { useUpdateModuleMutation } from "@spt/hooks/apiRequests/useUpdateModuleMutation";
import type { SpoilModule } from "@spt/screens/main/spoil/startSpoilUtils";

import ModalShell, { ModalActions } from "./ModalShell";

const EditModuleModal = ({ module, onClose }: { module: SpoilModule; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { updateModuleHandler } = useUpdateModuleMutation();

  return (
    <ModalShell title="Edit Module" onClose={onClose}>
      <Formik
        initialValues={{ title: module.title ?? "", description: module.description ?? "" }}
        validationSchema={Yup.object({ title: Yup.string().trim().required("Module title is required") })}
        onSubmit={async (values) => {
          try {
            await updateModuleHandler({
              moduleId: module.id,
              title: values.title.trim(),
              description: values.description.trim(),
            });
            queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
            onClose();
          } catch {
            // updateModuleHandler has already shown the error.
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <Input name="title" label="Module Title" placeholder="Title" />
            <Textarea name="description" label="Description" placeholder="Enter description for module" rows={4} />
            <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default EditModuleModal;
