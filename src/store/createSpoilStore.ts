import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BasicsFormData, OutlineData } from "@spt/types";

interface CreateSpoilDraftState {
  basics: BasicsFormData;
  outline: OutlineData;
  setBasics: (b: BasicsFormData) => void;
  setOutline: (o: OutlineData) => void;
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
};

const initialOutline: OutlineData = {
  modules: [],
};

export const useCreateSpoilStore = create<CreateSpoilDraftState>()(
  persist(
    (set) => ({
      basics: initialBasics,
      outline: initialOutline,
      setBasics: (b: BasicsFormData) => set({ basics: b }),
      setOutline: (o: OutlineData) => set({ outline: o }),
      resetDraft: () => set({ basics: initialBasics, outline: initialOutline }),
    }),
    {
      name: "advanced-spoil-draft",
      getStorage: () => (typeof window !== "undefined" ? window.sessionStorage : undefined),
    },
  ),
);

export default useCreateSpoilStore;
