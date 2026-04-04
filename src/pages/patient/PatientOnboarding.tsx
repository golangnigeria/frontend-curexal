import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  Heart, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import { BiodataForm } from "../../components/patient/BiodataForm";

const PatientOnboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      // The backend now handles upsert, so a single PUT to /profile works for both new and existing
      await api.put("/patients/profile", formData);
      toast.success("Profile setup complete! Welcome to curexal.");
      navigate("/dashboard");
    } catch (err: unknown) {
      let errorMsg = "Failed to save profile. Please check your connection.";
      if (isAxiosError(err)) {
        errorMsg = err.response?.data?.detail || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -left-24 w-48 h-48 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-primary-500/10 mb-6 border border-slate-100"
          >
            <Heart className="text-rose-500 h-8 w-8 fill-rose-50" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to <span className="text-primary-600">curexal</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">
            Let's set up your secure health profile to get you started with personalized care.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-6 md:p-10 mb-12">
          <div className="flex items-center gap-3 p-4 bg-primary-50/50 rounded-2xl border border-primary-100 mb-8">
            <div className="h-10 w-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-900">Health Data Privacy</p>
              <p className="text-xs text-primary-700">Your data is encrypted and only visible to authorized doctors.</p>
            </div>
          </div>

          <BiodataForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Footer/Trust Indicators */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <div className="flex items-center gap-4 text-slate-400 grayscale opacity-60">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Trusted by Medical Centers</span>
          </div>
          <button 
             onClick={() => navigate('/dashboard')}
             className="text-slate-500 hover:text-slate-900 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Skip for now (some features will be locked) <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientOnboarding;
