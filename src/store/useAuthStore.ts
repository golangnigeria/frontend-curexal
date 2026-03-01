import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  role_name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  setAuth: (user: User, token: string, requiresOnboarding?: boolean) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      requiresOnboarding: false,
      
      setAuth: (user, token, requiresOnboarding = false) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        requiresOnboarding 
      }),
      
      setToken: (token) => set({ token }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        requiresOnboarding: false
      }),
    }),
    {
      name: 'auth-storage', // name of item in the storage (must be unique)
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
