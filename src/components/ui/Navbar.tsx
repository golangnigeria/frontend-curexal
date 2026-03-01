import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logoUrl from '../../assets/img/logo.jpg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-colors ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md border-b border-border dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Curexal Logo"
              className="h-10 w-10 rounded-lg object-cover shadow-sm border border-slate-200 dark:border-slate-800"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 tracking-tight">
              Curexal
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
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
          <div className="flex items-center gap-4">
            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-900/60 rounded-full transition-all"
              >
                Sign In
              </Link>
            )}

            {location.pathname !== '/register' && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;