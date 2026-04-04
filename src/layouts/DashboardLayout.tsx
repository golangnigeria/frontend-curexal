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
  Bell,
  /* Search, */
} from "lucide-react";
import api from "../lib/api";
import { AIChatWidget } from "../components/AIChatWidget";
import { GlobalSearch } from "../components/GlobalSearch";
import DashboardFooter from "../components/layout/DashboardFooter";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import logoUrl from "../assets/img/logo.jpg";
import { NAVIGATION_CONFIG } from "../utils/navigationConfig";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout failed on the backend:", err);
    } finally {
      logout();
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col pt-6 pb-4">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 mb-8 group">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <img src={logoUrl} alt="curexal" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">curexal</span>
            </Link>
            <button
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar">
            <NavLink
              to={ROLE_REDIRECT[user.role_name] ?? "/dashboard"}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Overview</span>
            </NavLink>

            <div className="pt-6 pb-2">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Management
              </span>
            </div>

            {NAVIGATION_CONFIG[user.role_name]?.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-6 pb-2 border-t border-slate-100 mt-6">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Identity
              </span>
            </div>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </nav>

          {/* User Profile Footer */}
          <div className="mt-auto pt-4 px-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-slate-100 bg-slate-50 mb-4">
               <div className="h-9 w-9 bg-primary-100 text-primary-700 rounded-md flex items-center justify-center font-bold text-sm overflow-hidden border border-slate-200/50">
                 {user.avatar_url ? (
                   <img src={user.avatar_url} className="h-full w-full object-cover" />
                 ) : (
                   user.name?.charAt(0).toUpperCase()
                 )}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate text-slate-900">{user.name}</p>
                 <p className="text-xs text-slate-500 capitalize">{user.role_name}</p>
               </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 px-6 lg:px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 sticky top-0 z-20 transition-all duration-300">
          <AnimatePresence mode="wait">
            {isMobileSearchOpen ? (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 w-full lg:hidden"
              >
                <div className="flex-1">
                  <GlobalSearch />
                </div>
                <button 
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 font-medium text-sm"
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors -ml-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu size={24} />
                  </button>
                  <div className="flex-1 max-w-lg hidden lg:block">
                    <GlobalSearch />
                  </div>
                  {/* Mobile Logo for app-like feel */}
                  <div className="lg:hidden flex items-center gap-2">
                     <div className="bg-slate-50 border border-slate-200 p-1 rounded-md">
                        <img src={logoUrl} alt="curexal" className="h-5 w-5 object-contain" />
                     </div>
                     <span className="font-bold text-slate-900 tracking-tight text-lg">curexal</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 h-2 w-2 bg-rose-500 border-2 border-white rounded-full box-content" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full custom-scrollbar flex flex-col">
          <div className="px-6 lg:px-12 py-8 max-w-7xl mx-auto w-full flex-1 mb-20 lg:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          <DashboardFooter />
        </div>
      </main>

      <MobileBottomNav 
         onMenuClick={() => setIsMobileMenuOpen(true)}
         onAIChatClick={() => {
           const botBtn = document.querySelector('[aria-label="Open AI Assistant"]') as HTMLButtonElement;
           if (botBtn) botBtn.click();
         }}
         onSearchClick={() => {
           setIsMobileSearchOpen(true);
           // Delay to allow animation before focus
           setTimeout(() => {
              const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
              if (searchInput) searchInput.focus();
           }, 300);
         }}
      />
      
      <AIChatWidget />
    </div>
  );
};

export default DashboardLayout;
