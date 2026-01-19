import { create } from "zustand";

import { AlertState } from "./type";

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    setOpen: () => set(() => ({ isOpen: true })),
    setClose: () => set(() => ({ isOpen: false })),
}))