import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  Home,
  Settings,
  User as UserIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import api from "../lib/api";
import { AIChatWidget } from "../components/AIChatWidget";
import NotificationDropdown from "../components/layout/NotificationDropdown";
import MessengerDropdown from "../components/layout/MessengerDropdown";
import logoUrl from "../assets/img/logo.jpg";
import { NAVIGATION_CONFIG } from "../utils/navigationConfig";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";


const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const { connectNotifySocket, disconnectNotifySocket } = useChatStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<{ label: string; rect: DOMRect; isRose?: boolean } | null>(null);


  useEffect(() => {
    if (user) {
      connectNotifySocket();
    }
    return () => {
      disconnectNotifySocket();
    };
  }, [user, connectNotifySocket, disconnectNotifySocket]);

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
          "fixed inset-y-0 left-0 z-70 m-4 rounded-3xl bg-slate-900 text-white shadow-2xl transition-all duration-500 ease-[0.16, 1, 0.3, 1] lg:relative lg:translate-x-0 lg:m-6 lg:mr-0",
          isSidebarCollapsed ? "lg:w-20" : "lg:w-72",
          isMobileMenuOpen
            ? "translate-x-0 w-72"
            : "-translate-x-[120%] lg:translate-x-0",
        )}
      >
        <div className={cn("h-full flex flex-col p-6", isSidebarCollapsed && "lg:p-4 lg:items-center")}>


          <div className="flex items-center justify-between mb-10 px-2 w-full">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-white p-1.5 shadow-xl sm:rotate-3">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xl font-black tracking-tighter whitespace-nowrap"
                  >
                    CUREXAL
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-xl transition-colors ml-auto translate-x-3"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className={cn("flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2 w-full", isSidebarCollapsed && "lg:pr-0")} onScroll={() => setHoveredItem(null)}>
            <NavLink
              to={ROLE_REDIRECT[user.role] ?? "/dashboard"}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                  isSidebarCollapsed && "lg:justify-center lg:px-0 lg:w-12 lg:mx-auto"
                )
              }
              onMouseEnter={(e) => isSidebarCollapsed && setHoveredItem({ label: "Dashboard", rect: e.currentTarget.getBoundingClientRect() })}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
              {!isSidebarCollapsed && (
                <ChevronRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </NavLink>

            <div className="py-4 overflow-hidden h-12 flex items-center">
              {!isSidebarCollapsed ? (
                <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                  Menu
                </span>
              ) : (
                <div className="w-8 h-px bg-slate-800 mx-auto" />
              )}
            </div>

            {NAVIGATION_CONFIG[user.role]?.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative",
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                    isSidebarCollapsed && "lg:justify-center lg:px-0 lg:w-12 lg:mx-auto"
                  )
                }
                onMouseEnter={(e) => isSidebarCollapsed && setHoveredItem({ label: item.label, rect: e.currentTarget.getBoundingClientRect() })}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            ))}

            <div className="py-4 mt-4 border-t border-white/5 overflow-hidden h-12 flex items-center">
              {!isSidebarCollapsed ? (
                <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                  Account
                </span>
              ) : (
                <div className="w-8 h-px bg-slate-800 mx-auto" />
              )}
            </div>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                  isSidebarCollapsed && "lg:justify-center lg:px-0 lg:w-12 lg:mx-auto"
                )
              }
              onMouseEnter={(e) => isSidebarCollapsed && setHoveredItem({ label: "Profile", rect: e.currentTarget.getBoundingClientRect() })}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserIcon size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>Profile</span>}
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative",
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                  isSidebarCollapsed && "lg:justify-center lg:px-0 lg:w-12 lg:mx-auto"
                )
              }
              onMouseEnter={(e) => isSidebarCollapsed && setHoveredItem({ label: "Settings", rect: e.currentTarget.getBoundingClientRect() })}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </NavLink>
          </nav>

          <div className={cn("mt-auto pt-6 border-t border-white/5 w-full", isSidebarCollapsed && "flex flex-col items-center")}>
            <div className={cn("flex items-center gap-3 px-4 mb-6", isSidebarCollapsed && "lg:px-0 lg:justify-center")}>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center font-black text-primary-400">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold truncate">{user.name}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {user.role_name}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              onMouseEnter={(e) => isSidebarCollapsed && setHoveredItem({ label: "Sign Out", rect: e.currentTarget.getBoundingClientRect(), isRose: true })}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95 relative group",
                isSidebarCollapsed && "lg:justify-center lg:px-0 lg:w-12"
              )}
            >
              <LogOut size={18} className="shrink-0" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* PORTAL TOOLTIP */}
      {hoveredItem && createPortal(
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className={cn(
             "fixed px-3 py-2 text-white text-[11px] font-bold rounded-lg z-100 shadow-xl pointer-events-none whitespace-nowrap",
             hoveredItem.isRose ? "bg-rose-500" : "bg-slate-900 border border-white/10"
           )}
           style={{
             top: hoveredItem.rect.top + (hoveredItem.rect.height / 2),
             left: hoveredItem.rect.right + 12,
             transform: 'translateY(-50%)'
           }}
        >
          {hoveredItem.label}
        </motion.div>,
        document.body
      )}

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
            <MessengerDropdown />
            <NotificationDropdown />
            <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs border-2 border-slate-200 shadow-xl lg:rotate-3 transition-transform hover:rotate-0 cursor-pointer">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div 
          className={cn(
            "flex-1 custom-scrollbar",
            location.pathname.includes('/messenger') 
              ? "overflow-hidden px-0 pb-0" 
              : "overflow-x-hidden overflow-y-auto px-6 lg:px-10 pb-10"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={cn("h-full", location.pathname.includes('/messenger') && "flex flex-col")}
            >
              {!location.pathname.includes('/messenger') && (
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
              )}
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {!location.pathname.includes('/messenger') && <AIChatWidget />}

      {/* PORTAL TOOLTIP */}
      {hoveredItem && createPortal(
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className={cn(
             "fixed px-3 py-2 text-white text-[11px] font-bold rounded-lg z-100 shadow-xl pointer-events-none whitespace-nowrap",
             hoveredItem.isRose ? "bg-rose-500" : "bg-slate-900 border border-white/10"
           )}
           style={{
             top: hoveredItem.rect.top + (hoveredItem.rect.height / 2),
             left: hoveredItem.rect.right + 12,
             transform: 'translateY(-50%)'
           }}
        >
          {hoveredItem.label}
        </motion.div>,
        document.body
      )}
    </div>
  );
};

export default DashboardLayout;
