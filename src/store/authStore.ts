import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  country: string;
  country_code: string;
  preferred_currency: string;
  phone_number: string;
  avatar: string | null;
  role: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  kyc_verified_at: string | null;
  is_active: number;
  last_login: string | null;
  is_password_changed: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profile: any;
  total_spoils_created: any;
  followers_count: any;
  verification_status:number
}

interface AuthState {
  user: User | null;
  token: string | null;
  createdSpoilId?: number | null;
  setAuth: (auth: { user: User; token: string }) => void;
  logout: () => void;
  setCreatedSpoilId?: (id: number | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      createdSpoilId: null,
      setAuth: ({ user, token }) => set({ user, token }),
      setCreatedSpoilId: (id: number | null) => set({ createdSpoilId: id }),
      logout: () => {
        set({ user: null, token: null, createdSpoilId: null });
        try {
          // Remove app-specific persisted stores and KYC-related localStorage items
          const keysToRemove = [
            "bankDetails",
            "countryCode",
            "kycActiveStep",
            "phoneNumber",
            "selectedCountry",
            "advanced-spoil-draft",
            "spoilert-web&site#",
          ];
          keysToRemove.forEach((k) => localStorage.removeItem(k));
        } catch  {
          // ignore if localStorage is unavailable
        }
      },
    }),
    {
      name: "spoilert-web&site#", // key in localStorage
    }
  )
);
