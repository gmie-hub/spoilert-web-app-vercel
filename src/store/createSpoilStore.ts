import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "@spt/screens/main/spoils/createSpoils/types";

interface CreateSpoilState {
  basicsData: BasicsFormData;
  setBasicsData: (v: BasicsFormData) => void;
  outlineData: OutlineData;
  setOutlineData: (v: OutlineData) => void;
  selectedType: SpoilTypeOption | null;
  setSelectedType: (v: SpoilTypeOption | null) => void;
  phase: "selection" | "wizard";
  setPhase: (p: "selection" | "wizard") => void;
  activeStep: number;
  setActiveStep: (n: number) => void;
  createdSpoilId: number | null;
  setCreatedSpoilId: (id: number | null) => void;
  reset: () => void;
}

const initialBasicsState: BasicsFormData = {
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

const initialOutlineState: OutlineData = {
  modules: [],
  preQuiz: undefined,
  postQuiz: undefined,
};

const useCreateSpoilStore = create<CreateSpoilState>()(
  persist(
    (set) => ({
      basicsData: initialBasicsState,
      setBasicsData: (v) => set({ basicsData: v }),
      outlineData: initialOutlineState,
      setOutlineData: (v) => set({ outlineData: v }),
      selectedType: null,
      setSelectedType: (v) => set({ selectedType: v }),
      phase: "selection",
      setPhase: (p) => set({ phase: p }),
      activeStep: 0,
      setActiveStep: (n) => set({ activeStep: n }),
      createdSpoilId: null,
      setCreatedSpoilId: (id) => set({ createdSpoilId: id }),
      reset: () =>
        set({
          basicsData: initialBasicsState,
          outlineData: initialOutlineState,
          selectedType: null,
          phase: "selection",
          activeStep: 0,
          createdSpoilId: null,
        }),
    }),
    {
      name: "create-spoil-draft-v1",
    },
  ),
);

export default useCreateSpoilStore;
