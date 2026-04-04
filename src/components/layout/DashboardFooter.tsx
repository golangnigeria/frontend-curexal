import { Link } from "react-router-dom";
import logoUrl from "../../assets/img/logo.jpg";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone 
} from "lucide-react";

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8 mt-auto hidden lg:block">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
                <img src={logoUrl} alt="curexal" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">curexal</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Modern digital health operating system designed to elevate care delivery and patient experience.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Overview</Link>
              </li>
              <li>
                <Link to="/dashboard/consultations" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Consultations</Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Medical Profile</Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Settings</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-slate-400 mt-0.5" />
                <span className="text-sm text-slate-500">support@curexal.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-slate-400 mt-0.5" />
                <span className="text-sm text-slate-500">+1 (800) CUREXAL</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} curexal health. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs font-medium text-slate-400 px-2 py-1 bg-slate-50 rounded italic">
              Health Privacy Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
