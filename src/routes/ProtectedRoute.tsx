import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  // ⛔ Wait until Zustand finishes hydrating
  if (!hasHydrated) {
    return null; // or loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};