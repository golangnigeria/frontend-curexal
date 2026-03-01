import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Stethoscope, Activity, HeartPulse, Hospital, Clock } from 'lucide-react';
import logoUrl from '../assets/img/logo.jpg';
import Navbar from '../components/ui/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950 text-foreground dark:text-slate-200 transition-colors duration-300 font-sans selection:bg-primary-200 dark:selection:bg-primary-900">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-100/50 dark:bg-primary-900/20 blur-3xl" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-100/50 dark:bg-accent-900/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300 text-sm font-medium mb-8 border border-accent-200 dark:border-accent-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
            </span>
            Next-Gen Health System Now Live
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400">
              Intelligent Healthcare
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 mx-auto mb-10 leading-relaxed">
            Curexal unites patients, doctors, labs, and pharmacies into one seamless, AI-integrated digital ecosystem. Experience healthcare without boundaries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-full shadow-xl shadow-primary-500/20 transition-all hover:scale-105"
            >
              Join as a Patient
            </Link>
            <Link
              to="/register?role=doctor"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-primary-500 hover:text-primary-600 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:border-primary-500 rounded-full transition-all"
            >
              Partner with Us (Facilities)
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border dark:border-slate-800 bg-white dark:bg-slate-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-primary-600 dark:text-primary-400">24/7</div>
              <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Support</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-primary-600 dark:text-primary-400">1M+</div>
              <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patients Saved</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-primary-600 dark:text-primary-400">5k+</div>
              <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verified Doctors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-primary-600 dark:text-primary-400">99.9%</div>
              <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Uptime Reliability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Core Ecosystem</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Everything you need, in one place.
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto">
              Curexal connects all critical healthcare nodes securely and instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center mb-6">
                <Stethoscope className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Telemedicine & Booking</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect with verified doctors instantly. Book physical or virtual appointments with real-time status tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/50 rounded-xl flex items-center justify-center mb-6">
                <Activity className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lab & Pharmacy Link</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Prescriptions are routed directly to partner pharmacies. Lab tests are booked and results pushed back securely to your dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <HeartPulse className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Emergency SOS Response</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                One-tap emergency trigger alerts nearby care agents, administrative dispatch, and emergency contacts immediately.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Military-Grade Security</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your medical data is encrypted at rest and in transit. Strict role-based access control ensures privacy compliance.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <Hospital className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Facility Administration</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Powerful tools for clinics and hospitals to manage their staff, verify credentials, and oversee patient flow.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-6">
                <Clock className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Vitals & Reminders</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Log daily vitals for proactive care. Get automated push notifications to take medications on time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Ready to upgrade your healthcare experience?
          </h2>
          <p className="text-primary-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of patients and modern medical facilities already using Curexal. It takes less than 2 minutes to get started.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-600 bg-white hover:bg-slate-50 rounded-full shadow-2xl transition-all hover:scale-105"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-border dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-col md:flex-row gap-6">
            <div className="flex items-center gap-2">
               <img src={logoUrl} alt="Curexal Logo" className="h-8 w-8 rounded-md grayscale opacity-80" />
               <span className="text-xl font-bold text-slate-400 dark:text-slate-600">Curexal</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Curexal Health Systems. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
               <a href="#" className="hover:text-primary-600">Privacy</a>
               <a href="#" className="hover:text-primary-600">Terms</a>
               <a href="#" className="hover:text-primary-600">Security</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
