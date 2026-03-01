import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import logoUrl from "../../assets/img/logo.jpg";
import { useAuthStore } from "../../store/useAuthStore";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-primary-400" : "text-slate-300 hover:text-primary-400"
    }`;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-md shadow-md border-b border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img
              src={logoUrl}
              alt="Curexal Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover shadow-sm border border-slate-800"
            />
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-400 to-primary-300 tracking-tight">
              Curexal
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/features" className={navLinkClasses}>
              Features
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
              >
                <LayoutDashboard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Link
                    to="/login"
                    className="hidden xs:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-primary-300 bg-primary-900/40 hover:bg-primary-900/60 rounded-full transition-all"
                  >
                    Sign In
                  </Link>
                )}

                {location.pathname !== "/register" && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
