import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const PublicRoute = () => {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  // Redirect authenticated users away from public pages
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
