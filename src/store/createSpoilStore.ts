import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { BasicsFormData } from "@spt/screens/main/spoils/createSpoils/types";
import type { OutlineData } from "@spt/types";

export interface SelectedCertificateTemplate {
  id: number | string;
  code: string;
  name: string;
  templateContent: string;
  templateFileName?: string | null;
}

export interface CertificateCustomization {
  logoImage: string | null;
  signatureImage: string | null;
  logoPlacement: CertificateAssetPlacement;
  signaturePlacement: CertificateAssetPlacement;
  elementOverrides: Record<string, CertificateElementOverride>;
  fields: {
    title: CertificateTextField;
    recipientName: CertificateTextField;
    body: CertificateTextField;
  };
}

export interface CertificateAssetPlacement {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CertificateElementOverride {
  text?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
}

export type CertificateEditableField = "title" | "recipientName" | "body";

export interface CertificateTextField {
  text: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline";
  textAlign: "left" | "center" | "right" | "justify";
  lineHeight: number;
}

interface CreateSpoilDraftState {
  basics: BasicsFormData;
  outline: OutlineData;
  certificateTemplate: SelectedCertificateTemplate | null;
  certificateCustomization: CertificateCustomization;
  setBasics: (b: BasicsFormData) => void;
  setOutline: (o: OutlineData) => void;
  setCertificateTemplate: (
    template: SelectedCertificateTemplate | null,
  ) => void;
  setCertificateCustomization: (
    customization: Partial<CertificateCustomization>,
  ) => void;
  setCertificateTextField: (
    field: CertificateEditableField,
    updates: Partial<CertificateTextField>,
  ) => void;
  setCertificateElementOverride: (
    elementId: string,
    updates: CertificateElementOverride,
  ) => void;
  resetDraft: () => void;
}

const initialBasics: BasicsFormData = {
  coverImage: null,
  title: "",
  category: "",
  institution: "",
  courseCode: "",
  pricing: "",
  amount: "",
  expiryDate: "",
  moduleCount: "",
  lessonCount: "",
  description: "",
  learningOutcome: "",
  scheduledDate: "",
  scheduledTime: "",
  is_draft: 0,
};

const initialOutline: OutlineData = {
  modules: [],
};

const initialCertificateTemplate: SelectedCertificateTemplate | null = null;
const initialCertificateCustomization: CertificateCustomization = {
  logoImage: null,
  signatureImage: null,
  logoPlacement: {
    left: 10.4,
    top: 8.6,
    width: 18.5,
    height: 11.4,
  },
  signaturePlacement: {
    left: 56.2,
    top: 79,
    width: 28.8,
    height: 8.6,
  },
  elementOverrides: {},
  fields: {
    title: {
      text: "CERTIFICATE\nOF COMPLETION",
      color: "#111827",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 26,
      fontWeight: 700,
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      lineHeight: 1.15,
    },
    recipientName: {
      text: "Name Surname",
      color: "#222222",
      fontFamily: "Georgia, Times New Roman, serif",
      fontSize: 34,
      fontWeight: 400,
      fontStyle: "italic",
      textDecoration: "none",
      textAlign: "center",
      lineHeight: 1.1,
    },
    body: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus nulla tellus, vitae vitae amet fusce. Non nec aliquet nunc vitae eget mattis.",
      color: "#5F6670",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 10,
      fontWeight: 400,
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      lineHeight: 1.35,
    },
  },
};

const normalizeCertificateCustomization = (
  customization?: Partial<CertificateCustomization> | null,
): CertificateCustomization => ({
  ...initialCertificateCustomization,
  ...customization,
  logoPlacement: {
    ...initialCertificateCustomization.logoPlacement,
    ...(customization?.logoPlacement ?? {}),
  },
  signaturePlacement: {
    ...initialCertificateCustomization.signaturePlacement,
    ...(customization?.signaturePlacement ?? {}),
  },
  elementOverrides: {
    ...initialCertificateCustomization.elementOverrides,
    ...(customization?.elementOverrides ?? {}),
  },
  fields: {
    ...initialCertificateCustomization.fields,
    ...(customization?.fields ?? {}),
    title: {
      ...initialCertificateCustomization.fields.title,
      ...(customization?.fields?.title ?? {}),
    },
    recipientName: {
      ...initialCertificateCustomization.fields.recipientName,
      ...(customization?.fields?.recipientName ?? {}),
    },
    body: {
      ...initialCertificateCustomization.fields.body,
      ...(customization?.fields?.body ?? {}),
    },
  },
});

export const useCreateSpoilStore = create<CreateSpoilDraftState>()(
  persist(
    (set) => ({
      basics: initialBasics,
      outline: initialOutline,
      certificateTemplate: initialCertificateTemplate,
      certificateCustomization: initialCertificateCustomization,
      setBasics: (b: BasicsFormData) => set({ basics: b }),
      setOutline: (o: OutlineData) => set({ outline: o }),
      setCertificateTemplate: (template: SelectedCertificateTemplate | null) =>
        set({ certificateTemplate: template }),
      setCertificateCustomization: (
        customization: Partial<CertificateCustomization>,
      ) =>
        set((state) => ({
          certificateCustomization: normalizeCertificateCustomization({
            ...state.certificateCustomization,
            ...customization,
          }),
        })),
      setCertificateTextField: (
        field: CertificateEditableField,
        updates: Partial<CertificateTextField>,
      ) =>
        set((state) => {
          const normalizedCustomization = normalizeCertificateCustomization(
            state.certificateCustomization,
          );

          return {
            certificateCustomization: normalizeCertificateCustomization({
              ...normalizedCustomization,
              fields: {
                ...normalizedCustomization.fields,
                [field]: {
                  ...normalizedCustomization.fields[field],
                  ...updates,
                },
              },
            }),
          };
        }),
      setCertificateElementOverride: (
        elementId: string,
        updates: CertificateElementOverride,
      ) =>
        set((state) => {
          const normalizedCustomization = normalizeCertificateCustomization(
            state.certificateCustomization,
          );

          return {
            certificateCustomization: normalizeCertificateCustomization({
              ...normalizedCustomization,
              elementOverrides: {
                ...normalizedCustomization.elementOverrides,
                [elementId]: {
                  ...normalizedCustomization.elementOverrides[elementId],
                  ...updates,
                },
              },
            }),
          };
        }),
      resetDraft: () =>
        set({
          basics: initialBasics,
          outline: initialOutline,
          certificateTemplate: initialCertificateTemplate,
          certificateCustomization: initialCertificateCustomization,
        }),
    }),
    {
      name: "advanced-spoil-draft",
      storage: createJSONStorage(() => window.sessionStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | Partial<CreateSpoilDraftState>
          | undefined;

        return {
          ...currentState,
          ...persisted,
          certificateCustomization: normalizeCertificateCustomization(
            persisted?.certificateCustomization,
          ),
        };
      },
    },
  ),
);

export default useCreateSpoilStore;
