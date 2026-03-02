import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, Menu as MenuIcon, X } from "lucide-react";
import logoUrl from "../../assets/img/logo.jpg";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Doctors", path: "/doctors" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
        }}
        className={cn(
          "w-full max-w-7xl h-14 sm:h-16 px-4 sm:px-6 rounded-2xl flex items-center justify-between transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
            : "bg-transparent",
        )}
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-all group-hover:scale-110">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tighter text-slate-900">
            CURE<span className="text-primary-600 font-black">XAL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                  isActive
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50",
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="h-10 px-5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="h-10 px-5 bg-primary-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-20 left-4 right-4 z-40 p-4 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl md:hidden"
          >
            <div className="grid gap-2 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="grid gap-2 border-t border-slate-100 pt-4">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-12 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold rounded-xl"
                >
                  <LayoutDashboard size={16} />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-12 flex items-center justify-center text-slate-600 font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-12 flex items-center justify-center gap-2 bg-primary-600 text-white font-bold rounded-xl"
                  >
                    Create Account
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
