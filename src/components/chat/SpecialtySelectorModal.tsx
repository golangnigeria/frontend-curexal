import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronRight } from "lucide-react";

interface SpecialtySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (specialty: string) => void;
  isLoading: boolean;
}

const specialties = [
  {
    id: "general",
    name: "General Practice",
    icon: "👨‍⚕️",
    desc: "Common illnesses, checkups",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: "👶",
    desc: "Child health and development",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "🫀",
    desc: "Heart and blood vessels",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "🧴",
    desc: "Skin, hair, and nails",
  },
  {
    id: "psychiatry",
    name: "Psychiatry",
    icon: "🧠",
    desc: "Mental health and therapy",
  },
  { id: "gynecology", name: "Gynecology", icon: "🤰", desc: "Women's health" },
];

const SpecialtySelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  isLoading,
}: SpecialtySelectorModalProps) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = specialties.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Choose Specialty
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Who would you like to speak with?
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 px-6 bg-slate-50/50 border-b border-slate-100">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search specialists or symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 px-6 space-y-2">
            {filtered.map((spec) => (
              <button
                key={spec.id}
                onClick={() => !isLoading && onSelect(spec.id)}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-primary-200 hover:shadow-md rounded-2xl group transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {spec.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {spec.desc}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                No specialties found matching "{search}"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpecialtySelectorModal;
