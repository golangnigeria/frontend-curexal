import { motion } from "framer-motion";
import { ShieldCheck, Clock, FileText, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import logoUrl from "../../assets/img/logo.jpg";

const VerificationPending = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Header / Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex items-center gap-3"
      >
        <img src={logoUrl} alt="curexal" className="h-10 w-10 rounded-xl" />
        <span className="text-2xl font-black tracking-tight text-slate-900 italic">curexal</span>
      </motion.div>

      <div className="max-w-2xl w-full bg-white rounded-[3rem] border border-slate-200 p-12 shadow-2xl relative overflow-hidden text-left">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <ShieldCheck size={180} />
        </div>

        <div className="relative z-10 space-y-8">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                 <Clock size={32} className="animate-pulse" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Under Review</h1>
                 <p className="text-slate-500 font-medium">Welcome, Dr. {user?.name.split(" ")[0]}</p>
              </div>
           </div>

           <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex gap-4">
              <AlertCircle className="text-amber-500 shrink-0" size={24} />
              <div className="space-y-2">
                 <p className="text-sm font-bold text-slate-900 italic">Your medical credentials are currently being verified by our administrative board.</p>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">To maintain the highest standard of care, every provider must undergo a manual verification process before access to patient data and clinical tools is granted.</p>
              </div>
           </div>

           <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">What happens next?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Step 
                   icon={<FileText size={18} />}
                   title="Document Review"
                   desc="We are verifying your license and certificates."
                   active
                 />
                 <Step 
                   icon={<ShieldCheck size={18} />}
                   title="Final Approval"
                   desc="Access is granted after background check."
                 />
              </div>
           </div>

           <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
                 <CheckCircle2 size={14} className="text-green-500" />
                 Typical turnaround: 24 - 48 hours
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm shadow-xl"
                 >
                   Refresh Status
                 </button>
                 <button 
                  onClick={() => logout()}
                  className="px-4 py-3 text-slate-500 hover:text-slate-900 font-bold transition-all flex items-center gap-2 text-sm"
                 >
                   <LogOut size={18} /> Logout
                 </button>
              </div>
           </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400 font-medium">
        Need help? Contact our provider support at <Link to="#" className="text-primary-600 font-black">support@curexal.com</Link>
      </p>
    </div>
  );
};

const Step = ({ icon, title, desc, active = false }: { icon: any, title: string, desc: string, active?: boolean }) => (
  <div className={`p-4 rounded-2xl border transition-all ${active ? 'bg-primary-50/30 border-primary-100 ring-4 ring-primary-500/5' : 'bg-white border-slate-100 opacity-60'}`}>
     <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
     </div>
     <h3 className={`text-sm font-black ${active ? 'text-slate-900' : 'text-slate-400'}`}>{title}</h3>
     <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">{desc}</p>
  </div>
);

export default VerificationPending;
