import { Link } from "react-router-dom";
import {
  ArrowRight,
  Stethoscope,
  HeartPulse,
  LayoutDashboard,
  ShieldCheck,
  Zap,
} from "lucide-react";
import logoUrl from "../assets/img/logo.jpg";
import Navbar from "../components/ui/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

const Landing = () => {
  const { user } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans selection:bg-primary-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
          <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary-100/40 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-100/30 blur-[100px]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 relative z-10 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-8 border border-slate-200"
          >
            <Zap size={12} className="text-primary-600" />
            Empowering Modern Healthcare
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]"
          >
            Digital care <br />
            <span className="text-primary-600">redefined.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg md:text-xl text-slate-500 mx-auto mb-12 leading-relaxed font-medium"
          >
            Curexal is the unified operating system for healthcare. Connecting
            patients, doctors, and labs in one intelligent ecosystem.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="h-14 px-8 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
              >
                <LayoutDashboard size={20} />
                Manage Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="h-14 px-10 bg-primary-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
                >
                  Start Your Journey
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/about"
                  className="h-14 px-10 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95"
                >
                  Learn More
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Active Patents", value: "250K+" },
              { label: "Specialist Doctors", value: "5.4K" },
              { label: "Partner Labs", value: "890" },
              { label: "Reliability", value: "99.9%" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 font-mono tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center justify-center lg:justify-start gap-2">
                <span className="w-8 h-px bg-primary-600/30" />
                The Protocol
              </h2>
              <p className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Designed for the <br />
                modern provider.
              </p>
            </div>
            <p className="max-w-md text-slate-500 text-lg leading-relaxed text-center lg:text-left">
              Our platform streamlines every clinical touchpoint, from
              scheduling to pharmacy routing, using high-compliance AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Stethoscope className="text-primary-600" />,
                title: "Unified Telehealth",
                desc: "Secure, high-fidelity video consultations with integrated patient history and charting.",
              },
              {
                icon: <ShieldCheck className="text-indigo-600" />,
                title: "End-to-End Safety",
                desc: "Bank-grade encryption for all medical records and pharmacy transmissions.",
              },
              {
                icon: <HeartPulse className="text-rose-500" />,
                title: "Smart Monitoring",
                desc: "Real-time vitals tracking and AI-driven alerts for immediate intervention.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
              <img
                src={logoUrl}
                className="h-10 w-10 rounded-xl contrast-125"
                alt="Curexal"
              />
              <span className="text-2xl font-black text-white tracking-tighter">
                CUREXAL
              </span>
            </div>

            <div className="flex gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-primary-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                API
              </a>
            </div>

            <p className="text-slate-500 text-xs font-bold">
              &copy; {new Date().getFullYear()} CUREXAL LABS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
