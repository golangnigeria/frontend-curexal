import { motion } from "framer-motion";
import {
  FlaskConical,
  MessageSquare,
  Zap,
  ShieldCheck,
  Cpu,
  Clock,
  Globe,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Features = () => {
  const { user } = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const features = [
    {
      title: "Smart Appointments",
      description:
        "Schedule consultations with leading specialists in seconds. Real-time availability and automated reminders.",
      icon: <Clock className="text-primary-600" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "AI-Powered Diagnostics",
      description:
        "Advanced algorithms assist in early detection and personalized health insights based on your medical history.",
      icon: <Cpu className="text-indigo-600" size={24} />,
      color: "bg-indigo-50",
    },
    {
      title: "Unified Health Records",
      description:
        "Access your entire medical history, lab results, and prescriptions in one secure, digital vault.",
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
      color: "bg-emerald-50",
    },
    {
      title: "Telemedicine Hub",
      description:
        "Connect with doctors via high-definition video calls from the comfort of your home, anywhere in the world.",
      icon: <Globe className="text-violet-600" size={24} />,
      color: "bg-violet-50",
    },
    {
      title: "Laboratory Integration",
      description:
        "Book tests and receive certified results directly in your app. Fast, efficient, and 100% paperless.",
      icon: <FlaskConical className="text-rose-600" size={24} />,
      color: "bg-rose-50",
    },
    {
      title: "Instant Consultations",
      description:
        "Get immediate answers to health queries with our 24/7 AI-assisted chat and rapid doctor response system.",
      icon: <MessageSquare className="text-amber-600" size={24} />,
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute inset-0 -z-10 bg-ai-mesh opacity-20" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-wider mb-8 border border-primary-200"
          >
            <Zap size={12} />
            The Future of Healthcare
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-tight"
          >
            Capabilities that <br />
            <span className="text-primary-600 uppercase">Power Care</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg text-slate-500 mx-auto leading-relaxed font-medium"
          >
            Curexal is more than just a platform; it's a comprehensive operating
            system designed to streamline every facet of the medical journey.
          </motion.p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] active:scale-[0.98] cursor-pointer"
              >
                <div
                  className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  Read more <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white rounded-[40px] m-4 sm:m-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/20 blur-[120px] -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
            Ready to experience the <br />
            <span className="text-primary-400">new standard</span> in care?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="h-14 px-10 bg-white text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="h-14 px-10 bg-white text-slate-900 font-bold rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/login"
                  className="h-14 px-10 bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center border border-white/10 hover:bg-slate-700 transition-all active:scale-95"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Curexal Corporation. All rights reserved.
      </footer>
    </div>
  );
};

export default Features;
