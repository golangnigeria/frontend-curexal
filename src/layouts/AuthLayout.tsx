import { Outlet, Link } from "react-router-dom";
import logoUrl from "../assets/img/logo.jpg";
import { Quote } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 p-32 bg-primary-600/20 rounded-full blur-[100px] w-96 h-96 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 p-32 bg-accent-500/20 rounded-full blur-[100px] w-96 h-96 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white p-1.5 rounded-lg">
              <img src={logoUrl} alt="Curexal" className="h-6 w-6 object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">curexal</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <Quote className="text-primary-400 mb-6 h-10 w-10 opacity-50" />
          <blockquote className="space-y-6">
            <p className="text-3xl font-medium leading-relaxed">
              "The new standard for intelligent healthcare operations. Seamlessly connect with patients and manage your practice."
            </p>
            <footer className="text-slate-300">
              <p className="font-semibold text-lg text-white">Dr. Sarah Jenkins</p>
              <p>Chief Medical Officer</p>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative z-10 bg-slate-50 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                 <img src={logoUrl} alt="Curexal" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">curexal</span>
            </Link>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
