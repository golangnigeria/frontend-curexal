import { motion } from "framer-motion";
import { Heart, Target, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import { Link } from "react-router-dom";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const values = [
    {
      title: "Patient First",
      description:
        "Everything we build starts with the human experience. Empathetic care is our true north.",
      icon: <Heart className="text-rose-600" size={24} />,
    },
    {
      title: "Radical Innovation",
      description:
        "We don't just follow trends; we set the standard for what's possible in medical technology.",
      icon: <Cpu className="text-primary-600" size={24} />,
    },
    {
      title: "Universal Trust",
      description:
        "Security and data integrity are the foundations of the Curexal ecosystem.",
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
    },
  ];

  const team = [
    {
      name: "Dr. Jonathan Ross",
      role: "Chief Medical Officer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "Sophia Chen",
      role: "VP of Engineering",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "David Miller",
      role: "Head of Product",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-100 pb-32">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-56 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-ai-mesh opacity-10" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-100 text-primary-600 mb-8"
          >
            <Target size={24} />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]"
          >
            Building the <br />
            <span className="text-primary-600 uppercase">Health OS.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
          >
            Curexal was founded with a single mission: to bridge the gap between
            complex medical bureaucracy and high-quality, human-centric care.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Values Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm"
              >
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
                Our legacy of <br />
                <span className="text-primary-600">innovation.</span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    year: "2023",
                    title: "Curexal Inception",
                    desc: "Founded with the vision to unify global healthcare.",
                  },
                  {
                    year: "2024",
                    title: "AI Integration",
                    desc: "Launched our first diagnostic assistant module.",
                  },
                  {
                    year: "2025",
                    title: "Global Expansion",
                    desc: "Serving over 250,000 active patients worldwide.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-primary-600" />
                      {i < 2 && (
                        <div className="w-0.5 h-full bg-slate-100 mt-2" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-black text-primary-600 mb-1 block tracking-widest">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-sm font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-linear-to-b from-primary-900/40 to-slate-900 z-0" />
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                alt="Modern Healthcare Facility"
                className="w-full h-auto rounded-[40px] shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-900 text-white rounded-[60px] m-4 sm:m-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-20 tracking-tight">
            The visionary <br />
            <span className="text-primary-400">Leadership Team.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-32 w-32 rounded-[32px] object-cover border-4 border-slate-800 mb-6 shadow-xl"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {member.role}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pt-32 text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-3 text-primary-600 text-sm font-black uppercase tracking-[0.3em] hover:gap-6 transition-all"
        >
          Join our mission <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default About;
