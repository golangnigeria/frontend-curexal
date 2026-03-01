import { useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  Home,
  Settings,
  User as UserIcon,
  Menu,
  X,
} from "lucide-react";
import api from "../lib/api";
import { AIChatWidget } from "../components/AIChatWidget";
import logoUrl from "../assets/img/logo.jpg";
import { NAVIGATION_CONFIG } from "../utils/navigationConfig";
import { ROLE_REDIRECT } from "../utils/roleRedirect";

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout failed on the backend:", err);
    } finally {
      logout();
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Base navigation styling class
  const getNavClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
      isActive
        ? "text-primary-700 bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="flex h-screen bg-surface dark:bg-slate-900 border-border dark:border-slate-800 text-foreground dark:text-slate-200 transition-colors duration-300 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background dark:bg-slate-950 border-r border-border dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border dark:border-slate-800">
          <Link
            to="/"
            className="flex items-center text-primary-600 dark:text-primary-400 font-bold text-xl gap-3"
          >
            <img
              src={logoUrl}
              alt="Curexal Logo"
              className="h-8 w-8 rounded-md object-cover"
            />
            Curexal
          </Link>
          <button
            className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Dashboard Home - applies to all roles */}
          <NavLink
            to={ROLE_REDIRECT[user.role] ?? "/dashboard"}
            end
            className={({ isActive }) => getNavClass(isActive)}
          >
            <Home size={20} />
            Dashboard
          </NavLink>

          {/* Dynamic Navigation Based on Role Config */}
          {NAVIGATION_CONFIG[user.role]?.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => getNavClass(isActive)}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* User Settings - applies to all roles */}
          <div className="pt-4 mt-4 border-t border-border dark:border-slate-800">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => getNavClass(isActive)}
            >
              <UserIcon size={20} /> Profile
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => getNavClass(isActive)}
            >
              <Settings size={20} /> Settings
            </NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-border dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-10 w-10 bg-accent-100 dark:bg-accent-900/50 rounded-full flex justify-center items-center text-accent-700 dark:text-accent-400 font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate w-32 dark:text-slate-200">
                {user.name || "User"}
              </span>
              <span className="text-xs text-slate-500 truncate w-32">
                {user.role_name || "Role"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border dark:border-slate-700 shadow-sm text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-background dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface dark:bg-slate-900 min-w-0">
        <header className="bg-background dark:bg-slate-950 shadow-sm h-16 flex items-center justify-between px-4 sm:px-8 border-b border-border dark:border-slate-800 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">
              {location.pathname === "/dashboard"
                ? `Welcome back, ${user.name?.split(" ")[0] || "User"}`
                : location.pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8 relative">
          {/* Rendering Nested Routes */}
          <Outlet />
        </div>
      </main>

      {/* Floating AI Assistant Widget */}
      <AIChatWidget />
    </div>
  );
};

export default DashboardLayout;
