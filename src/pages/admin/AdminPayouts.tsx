import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Search,
  Banknote,
  Navigation,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface PayoutRequest {
  id: string;
  provider_id: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  admin_notes?: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

const AdminPayouts = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null);
  const [processing, setProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/finances/payouts");
      setRequests(res.data.requests || []);
    } catch {
      toast.error("Failed to load payout requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: "paid" | "rejected") => {
    if (!selectedRequest) return;
    
    setProcessing(true);
    try {
      await api.put(`/admin/finances/payouts/${selectedRequest.id}`, {
        status,
        admin_notes: adminNotes
      });
      toast.success(`Request marked as ${status}`);
      setSelectedRequest(null);
      setAdminNotes("");
      fetchRequests();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
             <CreditCard className="text-primary-600" />
             Payout Management
           </h1>
           <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Financial Reconciliation System</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search provider name..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all w-full md:w-64 shadow-sm"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-4">
           {requests.map((req) => (
             <motion.div 
               key={req.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               onClick={() => setSelectedRequest(req)}
               className={cn(
                 "p-6 bg-white rounded-3xl border transition-all cursor-pointer group shadow-sm hover:shadow-xl",
                 selectedRequest?.id === req.id 
                   ? "border-primary-500 ring-4 ring-primary-500/5 shadow-2xl scale-[1.02]" 
                   : "border-slate-200 hover:border-primary-200"
               )}
             >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                         {req.user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                         <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{req.user?.name}</h3>
                         <p className="text-xs text-slate-400 font-medium">{req.user?.email}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black text-slate-900">₦{req.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(req.created_at).toLocaleDateString('en-GB')}</p>
                   </div>
                </div>
             </motion.div>
           ))}

           {requests.length === 0 && (
             <div className="p-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <Banknote size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold italic">No pending payout requests found</p>
             </div>
           )}
        </div>

        {/* Selected Request Detail / Action Panel */}
        <div className="lg:col-span-1">
           <AnimatePresence mode="wait">
             {selectedRequest ? (
               <motion.div 
                 key="detail"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-white rounded-[3rem] border border-slate-200 p-8 shadow-2xl sticky top-8 text-left"
               >
                  <div className="flex items-center justify-between mb-8">
                     <span className="px-4 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100 flex items-center gap-2">
                       <Clock size={12} /> Pending Transfer
                     </span>
                     <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <XCircle size={24} />
                     </button>
                  </div>

                  <div className="space-y-6">
                     <div className="pb-6 border-b border-slate-50 mb-6">
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2">Request Information</p>
                        <h2 className="text-3xl font-black text-slate-900 mb-1">₦{selectedRequest.amount.toLocaleString()}</h2>
                        <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                          <Navigation size={12} /> ID: {selectedRequest.id.slice(0, 16)}...
                        </p>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Internal Admin Notes</p>
                           <textarea 
                             rows={3}
                             placeholder="Add transfer reference or notes..."
                             value={adminNotes}
                             onChange={(e) => setAdminNotes(e.target.value)}
                             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                           />
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                           <button 
                             onClick={() => handleUpdateStatus("paid")}
                             disabled={processing}
                             className="w-full py-4 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 shadow-xl transition-all flex items-center justify-center gap-2 group"
                           >
                              {processing ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                  <CheckCircle2 size={18} className="text-green-400" /> 
                                  Mark as Transferred
                                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                           </button>
                           <button 
                             onClick={() => handleUpdateStatus("rejected")}
                             disabled={processing}
                             className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-[1.5rem] hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                           >
                              {processing ? <Loader2 className="animate-spin" size={18} /> : <><XCircle size={18} /> Reject Request</>}
                           </button>
                        </div>
                     </div>

                     <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                           <Banknote size={64} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Security Protocol</p>
                        <p className="text-xs font-medium leading-relaxed">
                          Only mark as <span className="text-green-400 font-bold">transferred</span> after you have completed the manual bank transfer to the provider's account. This action is final and will reconcile the balance.
                        </p>
                     </div>
                  </div>
               </motion.div>
             ) : (
               <div className="h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                  <Navigation size={48} className="text-slate-200 animate-bounce mb-4" />
                  <p className="text-slate-400 font-bold italic text-sm">Select a request to process</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPayouts;
