import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Plus,
  Loader2,
  TrendingUp,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface WalletData {
  id: string;
  balance: number;
  currency: string;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  created_at: string;
  admin_notes?: string;
}

export const ProviderEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await api.get("/finances/wallet");
      setWallet(res.data.wallet);
      setPayouts(res.data.payouts || []);
    } catch {
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setRequesting(true);
    try {
      await api.post("/finances/payouts", { amount });
      toast.success("Payout request submitted");
      setPayoutAmount("");
      fetchWalletData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Request failed");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet size={120} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Available for Withdrawal</p>
              <h2 className="text-5xl font-black tracking-tight">
                ₦{wallet?.balance.toLocaleString() || "0.00"}
              </h2>
            </div>

            <div className="flex gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                 <TrendingUp size={16} className="text-green-400" />
                 <span className="text-xs font-bold">1% Referral Fee Active</span>
               </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
           <div className="space-y-4">
             <h3 className="font-bold text-slate-900 flex items-center gap-2">
               <Plus size={20} className="text-primary-600" />
               Request Payout
             </h3>
             <form onSubmit={handleRequestPayout} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-bold"
                  />
                </div>
                <button 
                  disabled={requesting || !payoutAmount}
                  className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-lg shadow-primary-600/20"
                >
                  {requesting ? <Loader2 className="animate-spin mx-auto" /> : "Withdraw Funds"}
                </button>
             </form>
           </div>
           <p className="text-[10px] text-slate-400 text-center font-medium mt-4 italic">
             Payouts are processed manually via offline bank transfer within 24-48 hours.
           </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm text-left">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History size={20} className="text-primary-600" />
              Payout History
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{payouts.length} total requests</span>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Reference</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-left">
                  {payouts.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                         <p className="text-sm font-bold text-slate-900">{new Date(req.created_at).toLocaleDateString('en-GB')}</p>
                         <p className="text-[10px] text-slate-400 font-medium">{new Date(req.created_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-sm font-black text-slate-900">₦{req.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5">
                         <StatusBadge status={req.status} />
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-400">
                        {req.id.slice(0, 8).toUpperCase()}
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium italic">
                        No payout history found
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: PayoutRequest["status"] }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    paid: "bg-green-50 text-green-600 border-green-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const icons = {
    pending: <Clock size={12} />,
    paid: <CheckCircle2 size={12} />,
    rejected: <XCircle size={12} />,
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border", styles[status])}>
      {icons[status]} {status}
    </span>
  );
};
