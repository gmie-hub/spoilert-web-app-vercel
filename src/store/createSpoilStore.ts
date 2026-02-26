import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { BasicsFormData } from "@spt/screens/main/spoils/createSpoils/types";
import type {  OutlineData } from "@spt/types";

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
  scheduledDate: "",
  scheduledTime: "",
  is_draft: 0,
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
      storage: createJSONStorage(() => window.sessionStorage),
    },
  ),
);

export default useCreateSpoilStore;
