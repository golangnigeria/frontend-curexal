import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;      // UUID as string
  role_name: string; // Now required for routing logic
  avatar_url?: string;
  is_verified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  hasHydrated: boolean; // 👈 ADD THIS

  setAuth: (user: User, token: string, requiresOnboarding?: boolean) => void;
  setToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void; // 👈 ADD
  logout: () => void;
  setHasHydrated: (state: boolean) => void; // 👈 ADD
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      requiresOnboarding: false,
      hasHydrated: false,

      setAuth: (user, token, requiresOnboarding = false) =>
        set({
          user,
          token,
          isAuthenticated: true,
          requiresOnboarding,
        }),

      setToken: (token) => set({ token, isAuthenticated: !!token }),
      updateUser: (newUser: Partial<User>) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...newUser } : null,
        })),

      logout: () => {
        sessionStorage.removeItem("doctor_status");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          requiresOnboarding: false,
        });
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        requiresOnboarding: state.requiresOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // 👈 MARK HYDRATED
      },
    }
  )
);