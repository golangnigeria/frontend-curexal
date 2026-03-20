import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  role_name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  hasHydrated: boolean; // 👈 ADD THIS

  setAuth: (user: User, requiresOnboarding?: boolean) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void; // 👈 ADD
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      requiresOnboarding: false,
      hasHydrated: false,

      setAuth: (user, requiresOnboarding = false) =>
        set({
          user,
          isAuthenticated: true,
          requiresOnboarding,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          requiresOnboarding: false,
        }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // 👈 MARK HYDRATED
      },
    }
  )
);