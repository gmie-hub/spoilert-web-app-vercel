import { create } from "zustand";
import { persist } from "zustand/middleware";

// localStorage key the auth state is persisted under. Shared so the axios
// interceptor and the certificate deep-link bootstrap read/write the exact same
// entry instead of duplicating the magic string.
export const AUTH_STORAGE_KEY = "spoilert-web&site#";

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
  verification_status:number | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  createdSpoilId?: number | null;
  // indicates whether the store has been rehydrated from storage
  hasHydrated?: boolean;
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
      hasHydrated: false,
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
            AUTH_STORAGE_KEY,
          ];
          keysToRemove.forEach((k) => localStorage.removeItem(k));
        } catch  {
          // ignore if localStorage is unavailable
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY, // key in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
