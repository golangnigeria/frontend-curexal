import { Link } from "react-router-dom";
import {
  ArrowRight,
  Stethoscope,
  Activity,
  HeartPulse,
  LayoutDashboard,
} from "lucide-react";
import logoUrl from "../assets/img/logo.jpg";
import Navbar from "../components/ui/Navbar";
import { useAuthStore } from "../store/useAuthStore";

const Landing = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 transition-colors duration-300 font-sans selection:bg-primary-900">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-900/20 blur-3xl" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-900/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-900/30 text-accent-300 text-xs font-medium mb-6 border border-accent-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
            </span>
            Next-Gen Health System Now Live
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
              Intelligent Healthcare
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-base md:text-xl text-slate-400 mx-auto mb-8 leading-relaxed">
            Curexal unites patients, doctors, labs, and pharmacies into one
            seamless, AI-integrated digital ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-full shadow-xl shadow-primary-500/20 transition-all hover:scale-105"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-full shadow-xl shadow-primary-500/20 transition-all hover:scale-105"
                >
                  Join as a Patient
                </Link>
                <Link
                  to="/register?role=doctor"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-200 bg-slate-900 border border-slate-700 hover:border-primary-500 hover:text-primary-400 rounded-full transition-all"
                >
                  Partner with Us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-800 bg-slate-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-2xl md:text-4xl font-extrabold text-primary-400">
                24/7
              </div>
              <div className="mt-1 text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">
                AI Support
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-extrabold text-primary-400">
                1M+
              </div>
              <div className="mt-1 text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">
                Patients Saved
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-extrabold text-primary-400">
                5k+
              </div>
              <div className="mt-1 text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">
                Verified Doctors
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-extrabold text-primary-400">
                99.9%
              </div>
              <div className="mt-1 text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">
                Reliability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-primary-400 font-semibold tracking-wide uppercase text-xs">
              Core Ecosystem
            </h2>
            <p className="mt-1 text-2xl font-extrabold text-white sm:text-4xl">
              Everything in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center md:text-left">
              <div className="w-10 h-10 bg-primary-900/50 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Stethoscope className="text-primary-400" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Telemedicine
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect with verified doctors instantly. Book appointments with
                real-time tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center md:text-left">
              <div className="w-10 h-10 bg-accent-900/50 rounded-lg flex items-center justify-center mb-4 mx-auto md:md:mx-0">
                <Activity className="text-accent-400" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Lab & Pharmacy
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Direct routing to partners. Book tests and get results on your
                dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center md:text-left">
              <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0">
                <HeartPulse className="text-red-400" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Emergency SOS
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                One-tap trigger alerts nearby care and emergency contacts
                immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl mb-4">
            Ready to start?
          </h2>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-primary-600 bg-white hover:bg-slate-50 rounded-full shadow-2xl transition-all hover:scale-105"
            >
              Back to Dashboard
              <LayoutDashboard className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-primary-600 bg-white hover:bg-slate-50 rounded-full shadow-2xl transition-all hover:scale-105"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <img
                src={logoUrl}
                alt="Curexal Logo"
                className="h-6 w-6 rounded-md grayscale opacity-50"
              />
              <span className="text-lg font-bold text-slate-600">Curexal</span>
            </div>
            <p className="text-slate-500 text-xs text-center">
              &copy; {new Date().getFullYear()} Curexal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
