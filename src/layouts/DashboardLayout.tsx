import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
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
    return (
      <div className="flex items-center justify-center h-screen bg-surface dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Base navigation styling class
  const getNavClass = (isActive: boolean) =>
    `flex items-center gap-2 px-2 py-1.5 rounded-md font-medium transition-colors ${
      isActive
        ? "text-primary-300 bg-primary-900/40"
        : "text-slate-400 hover:bg-slate-800"
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Dashboard Home - applies to all roles */}
          <NavLink
            to={ROLE_REDIRECT[user.role] ?? "/dashboard"}
            end
            className={({ isActive }) => getNavClass(isActive)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home size={18} />
            <span className="text-sm">Dashboard</span>
          </NavLink>

          {/* Dynamic Navigation Based on Role Config */}
          {NAVIGATION_CONFIG[user.role]?.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => getNavClass(isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3 text-sm">
                {item.icon}
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* User Settings - applies to all roles */}
          <div className="pt-2 mt-2 border-t border-border dark:border-slate-800">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => getNavClass(isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserIcon size={18} /> <span className="text-sm">Profile</span>
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => getNavClass(isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings size={18} /> <span className="text-sm">Settings</span>
            </NavLink>
          </div>
        </nav>

        <div className="p-3 border-t border-border dark:border-slate-800">
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <div className="h-8 w-8 bg-accent-900/50 rounded-full flex justify-center items-center text-accent-400 font-bold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate w-24 text-slate-200">
                {user.name || "User"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-700 shadow-sm text-xs font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface dark:bg-slate-900 min-w-0">
        <header className="bg-background dark:bg-slate-950 shadow-sm h-12 sm:h-16 flex items-center justify-between px-3 sm:px-8 border-b border-border dark:border-slate-800 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-200 rounded-md focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm sm:text-xl font-semibold text-slate-200 capitalize truncate max-w-[150px] sm:max-w-none">
              {location.pathname === "/dashboard"
                ? `Hi, ${user.name?.split(" ")[0] || "User"}`
                : location.pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-2 sm:p-8 relative">
          {/* Rendering Nested Routes */}
          <Outlet />
        </div>
      </main>

      {/* Floating AI Assistant Widget - Simplified for compactness */}
      <AIChatWidget />
    </div>
  );
};

export default DashboardLayout;
