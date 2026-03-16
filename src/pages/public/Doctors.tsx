import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Filter,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const Doctors = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const doctors = [
    {
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 128,
      location: "San Francisco, CA",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
      experience: "12 years",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 4.8,
      reviews: 95,
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
      experience: "8 years",
    },
    {
      name: "Dr. Elena Rodriguez",
      specialty: "Pediatrician",
      rating: 5.0,
      reviews: 210,
      location: "Austin, TX",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
      experience: "15 years",
    },
    {
      name: "Dr. James Wilson",
      specialty: "Dermatologist",
      rating: 4.7,
      reviews: 78,
      location: "Chicago, IL",
      image:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
      experience: "10 years",
    },
    {
      name: "Dr. Aisha Khan",
      specialty: "General Physician",
      rating: 4.9,
      reviews: 156,
      location: "Seattle, WA",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200",
      experience: "7 years",
    },
    {
      name: "Dr. Robert Taylor",
      specialty: "Orthopedic Surgeon",
      rating: 4.8,
      reviews: 89,
      location: "Miami, FL",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=200&h=200",
      experience: "14 years",
    },
  ];

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-100 pb-32">
      <Navbar />

      {/* Hero / Header Section */}
      <section className="pt-32 pb-12 lg:pt-48 lg:pb-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-primary-900/40 to-slate-900 z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 uppercase">
              World-Class <span className="text-primary-400">Experts</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg font-medium">
              Find and book consultations with the most trusted medical
              professionals in the industry. Verified by Curexal.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white p-2 rounded-3xl shadow-2xl flex items-center gap-2 border border-white/10"
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, specialty, or condition..."
                className="w-full py-4 text-sm font-medium focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="hidden sm:flex h-14 px-8 bg-primary-600 text-white font-bold rounded-2xl items-center justify-center gap-2 hover:bg-primary-500 transition-all active:scale-95 shadow-lg">
              <Filter size={18} />
              Filters
            </button>
          </motion.div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {searchQuery
                ? `Search Results (${filteredDoctors.length})`
                : "Featured Specialists"}
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:underline">
              View all specialists <ArrowRight size={14} />
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDoctors.map((doc, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-6 rounded-[32px] bg-white border border-slate-100 hover:border-primary-100 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(99,102,241,0.06)] flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute -inset-1 bg-linear-to-tr from-primary-600 to-indigo-600 rounded-[28px] opacity-0 group-hover:opacity-20 transition-opacity blur-lg" />
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="relative h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                    <ShieldCheck size={14} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 mb-4 transition-colors group-hover:bg-primary-50">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-slate-600">
                    {doc.rating} ({doc.reviews} Reviews)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-1">
                  {doc.name}
                </h3>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  {doc.specialty}
                </span>

                <div className="w-full pt-6 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <MapPin size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {doc.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Award size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {doc.experience} Experience
                      </span>
                    </div>
                  </div>
                  <Link
                    to={user ? "/dashboard" : "/login"}
                    className="h-10 px-4 bg-slate-900 text-white text-[10px] font-bold rounded-xl flex items-center gap-2 hover:bg-primary-600 transition-all active:scale-95"
                  >
                    <Calendar size={14} />
                    {user ? "Book Consultation" : "Book"}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;
