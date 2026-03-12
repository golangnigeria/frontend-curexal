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
  ChevronRight,
  Search,
} from "lucide-react";
import api from "../lib/api";
import { AIChatWidget } from "../components/AIChatWidget";
import NotificationDropdown from "../components/layout/NotificationDropdown";
import logoUrl from "../assets/img/logo.jpg";
import { NAVIGATION_CONFIG } from "../utils/navigationConfig";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
    } catch (err) {
      console.error("Logout failed on the backend:", err);
    } finally {
      logout();
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-70 w-72 m-4 rounded-3xl bg-slate-900 text-white shadow-2xl transition-transform duration-500 ease-[0.16, 1, 0.3, 1] lg:relative lg:translate-x-0 lg:m-6 lg:mr-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-[120%] lg:translate-x-0",
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white p-1.5 shadow-xl sm:rotate-3">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
              <span className="text-xl font-black tracking-tighter">
                CUREXAL
              </span>
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
            <NavLink
              to={ROLE_REDIRECT[user.role] ?? "/dashboard"}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                )
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Dashboard</span>
              <ChevronRight
                size={14}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </NavLink>

            <div className="py-4">
              <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Menu
              </span>
            </div>

            {NAVIGATION_CONFIG[user.role]?.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="py-4 mt-4 border-t border-white/5">
              <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Account
              </span>
            </div>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                )
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserIcon size={18} />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                )
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-primary-400">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">{user.name}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {user.role_name}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative">
        <header className="h-20 lg:h-24 px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <button
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none text-sm focus:outline-none w-full font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <NotificationDropdown />
            <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs border-2 border-slate-200 shadow-xl lg:rotate-3 transition-transform hover:rotate-0 cursor-pointer">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar px-6 lg:px-10 pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <div className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2 uppercase">
                  {location.pathname === "/dashboard"
                    ? "Overview"
                    : location.pathname.split("/").pop()?.replace("-", " ")}
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-8 h-px bg-slate-200" />
                  Dashboard Control
                </p>
              </div>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
};

export default DashboardLayout;
