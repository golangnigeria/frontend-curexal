import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Calendar,
  MessageSquare,
  FileText
} from "lucide-react";
import logoUrl from "../assets/img/logo.jpg";
import Navbar from "../components/ui/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

const Landing = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Soft Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-primary-100/50 blur-[120px]" />
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              Secure Healthcare Infrastructure
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              A unified operating system <br className="hidden md:block" />
              for modern <span className="text-primary-600">healthcare.</span>
            </h1>

            <p className="max-w-2xl text-lg text-slate-600 mx-auto mb-10 leading-relaxed">
              Curexal connects patients, providers, and facilities in a single, secure environment. Experience seamless consultations, integrated records, and end-to-end clinical workflows.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" className="h-14 px-8 shadow-lg shadow-primary-500/20">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg" className="h-14 px-8 shadow-lg shadow-primary-500/20">
                      Get Started Today
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="secondary" size="lg" className="h-14 px-8 bg-white border shadow-sm">
                      How It Works
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-slate-100">
            {[
              { label: "Providers Network", value: "2,500+" },
              { label: "Secure Sessions", value: "1M+" },
              { label: "Partner Facilities", value: "150+" },
              { label: "HIPAA Compliant", value: "100%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={i !== 0 ? "pl-8 md:pl-12" : ""}
              >
                <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
              Platform Features
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              Everything you need to deliver and receive extraordinary care.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="h-6 w-6 text-primary-600" />,
                title: "Live Consultations",
                desc: "Secure, persistent chat and video sessions that meet compliance standards.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-slate-700" />,
                title: "Role-Based Access",
                desc: "Strict permissions ensuring data is only accessible to authorized clinical staff.",
              },
              {
                icon: <Activity className="h-6 w-6 text-emerald-600" />,
                title: "Vitals Tracking",
                desc: "Real-time monitoring and logging of essential patient health metrics.",
              },
              {
                icon: <Calendar className="h-6 w-6 text-indigo-600" />,
                title: "Intelligent Scheduling",
                desc: "Frictionless booking flows for patients, eliminating administrative overhead.",
              },
              {
                icon: <FileText className="h-6 w-6 text-amber-600" />,
                title: "Digital Prescriptions",
                desc: "Direct routing of orders to partner pharmacies for seamless fulfillment.",
              },
              {
                icon: <Stethoscope className="h-6 w-6 text-rose-600" />,
                title: "Emergency SOS",
                desc: "One-tap emergency triggers alerting dedicated care agents in the field.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <img src={logoUrl} className="h-6 w-6 object-contain rounded-md" alt="Curexal" />
               <span className="text-lg font-bold text-slate-900 tracking-tight">
                 curexal
               </span>
            </div>

            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
            </div>

            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Curexal Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
