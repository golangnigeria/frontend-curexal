import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  RefreshCcw, Lock, CheckCircle2, Filter, 
  TrendingUp, TrendingDown, X, Delete
} from "lucide-react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  created_at: string;
  reference: string;
}

interface WalletData {
  id: string;
  balance: number;
  pending_balance: number;
  currency: string;
}

export const FinanceDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterType, setFilterType] = useState<string>("all");
  const [calculatorAmount, setCalculatorAmount] = useState<string>("0");

  const fetchFinances = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/finance/transactions");
      if (res.status === 200) {
        const data = res.data;
        setTransactions(data.transactions || []);
        setWallet(data.wallet || null);
      }
    } catch (err) {
      console.error("Failed to load finances", err);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchFinances();
    }
  }, [user, fetchFinances]);

  // Handle Paystack Redirect & Auto-Verification
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      const verifyPayment = async () => {
        try {
          toast.info("Verifying payment...", { autoClose: 2000 });
          const res = await api.post("/finance/verify", { payment_reference: reference });
          if (res.status === 200) {
            toast.success("Wallet funded successfully!");
            fetchFinances();
          }
        } catch (err) {
          console.error("Verification failed", err);
          toast.error("Payment verification failed. Please contact support.");
        } finally {
          // Remove reference from URL
          searchParams.delete("reference");
          setSearchParams(searchParams);
        }
      };
      verifyPayment();
    }
  }, [searchParams, setSearchParams, fetchFinances]);

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return transactions;
    return transactions.filter(tx => tx.type === filterType || tx.category === filterType);
  }, [transactions, filterType]);

  const handleDeposit = async () => {
    const finalAmount = Number(calculatorAmount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 100) {
        toast.warning("Minimum deposit is ₦100");
        return;
    }
    setActionLoading(true);
    
    try {
      const res = await api.post("/finance/initialize", { amount: finalAmount });

      if (res.status !== 200) throw new Error("Could not initialize payment");
      const data = res.data;

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (err) {
      console.error("Deposit failed", err);
      toast.error("Could not start payment process");
    } finally {
      setActionLoading(false);
    }
  };

  const handleKeyPress = (val: string) => {
    if (val === "C") {
      setCalculatorAmount("0");
    } else if (val === "delete") {
      setCalculatorAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
    } else {
      setCalculatorAmount(prev => {
        if (prev === "0") return val;
        if (val === "." && prev.includes(".")) return prev;
        return prev + val;
      });
    }
  };


  // Role Checks
  const isPatient = user?.role === 2;
  const isDoctor = user?.role === 3;
  const isCareAgent = user?.role === 7;

  const canDeposit = isPatient || isCareAgent;
  const canWithdraw = (wallet?.balance || 0) > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Context */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Wallet</h2>
          <p className="text-sm text-slate-500 font-medium">
            {isPatient ? "Manage your consultation funds" : 
             isDoctor ? "Track your earnings & escrow" : 
             "Manage system proxy payments"}
          </p>
        </div>
        <button 
          onClick={fetchFinances} 
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all text-slate-400 active:scale-95"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Available Balance Card */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">Available</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Curexal Balance</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₦ {(wallet?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-5 flex gap-2">
            {canDeposit && (
               <button 
                onClick={() => { setShowDeposit(true); setShowWithdraw(false); }}
                className="flex-1 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg transition-all"
               >
                 Add Funds
               </button>
            )}
             <button 
                onClick={() => { setShowWithdraw(true); setShowDeposit(false); }}
                disabled={!canWithdraw}
                className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all disabled:opacity-30"
              >
                Withdraw
             </button>
          </div>
        </div>

        {/* Escrow Balance Card (Primarily for Doctors/Providers) */}
        {(isDoctor || (wallet?.pending_balance || 0) > 0) && (
          <div className="md:col-span-4 bg-slate-50/50 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Lock size={18} />
              </div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md">Held</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Escrow Funds</p>
              <h3 className="text-2xl font-black text-slate-700 tracking-tight">
                ₦ {(wallet?.pending_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-4 leading-tight">
              Released upon appointment completion
            </p>
          </div>
        )}

        {/* Role-Specific Stats / Info */}
        <div className="md:col-span-4 bg-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between">
           <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Quick Info</h4>
              {isPatient && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Refunds Processed</span>
                    <span className="font-bold">₦ 0.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Consultation Spend</span>
                    <span className="font-bold">₦ 0.00</span>
                  </div>
                </div>
              )}
              {isDoctor && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Lifetime Earnings</span>
                    <span className="font-bold">₦ 25,000.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Active Escrows</span>
                    <span className="font-bold">3 appointments</span>
                  </div>
                </div>
              )}
           </div>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary-400">
              <CheckCircle2 size={12}/> Verified Node
           </div>
        </div>
      </div>

      {/* Modern Calculator Modal for Deposits */}
      <AnimatePresence>
        {showDeposit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeposit(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-slate-900 text-white flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Add Wallet Funds</span>
                  <button onClick={() => setShowDeposit(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="w-full flex items-baseline justify-end gap-2 overflow-hidden">
                  <span className="text-2xl font-bold text-primary-400 italic">₦</span>
                  <span className="text-5xl font-black tracking-tighter truncate leading-tight">
                    {Number(calculatorAmount).toLocaleString()}
                  </span>
                </div>
                <div className="w-full mt-2 h-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <div className="p-6 bg-slate-50 grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map(n => (
                  <button
                    key={n}
                    onClick={() => handleKeyPress(n.toString())}
                    className="h-16 rounded-2xl bg-white hover:bg-primary-50 active:scale-95 transition-all text-xl font-bold text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => handleKeyPress("delete")}
                  className="h-16 rounded-2xl bg-white hover:bg-rose-50 active:scale-95 transition-all text-xl font-bold text-rose-500 shadow-sm border border-slate-100 flex items-center justify-center"
                >
                  <Delete size={24} />
                </button>

                <button
                  onClick={() => setCalculatorAmount("0")}
                  className="col-span-1 h-16 rounded-2xl bg-slate-200 hover:bg-slate-300 active:scale-95 transition-all text-sm font-black uppercase tracking-widest text-slate-600 shadow-sm flex items-center justify-center"
                >
                  Clear
                </button>

                <button
                  onClick={handleDeposit}
                  disabled={actionLoading || Number(calculatorAmount) < 100}
                  className="col-span-2 h-16 rounded-2xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200 active:scale-95 transition-all text-sm font-black uppercase tracking-[.2em] text-white flex items-center justify-center disabled:opacity-50 disabled:grayscale"
                >
                  {actionLoading ? "Initializing..." : "Pay Now"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showWithdraw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdraw(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
               <div className="mb-6 mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Lock size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Request Payout</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6"> Payout automation is currently under maintenance. Please contact Curexal financial support to process manual withdrawals.</p>
               <button 
                onClick={() => setShowWithdraw(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
               >
                 Close Window
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transactions Section */}
      <div className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-base font-bold text-slate-900">Activity</h3>
          
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <Filter size={14} className="text-slate-400 ml-1 shrink-0" />
            {['all', 'deposit', 'withdrawal', 'escrow_hold', 'escrow_release'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                  ${filterType === tab ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-tighter sm:tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-6 py-4">Status & Type</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && filteredTransactions.length === 0 ? (
                <tr>
                   <td colSpan={3} className="px-6 py-12 text-center text-slate-300 font-bold text-xs animate-pulse">Syncing transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <p className="text-slate-400 font-medium text-xs">No records found for this filter.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md 
                          ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                          {tx.type === 'credit' ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 capitalize leading-tight">{tx.category.replace('_', ' ')}</p>
                          <p className="text-[9px] font-medium text-slate-400 mt-0.5">{format(new Date(tx.created_at), "MMM d, HH:mm")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter
                        ${tx.status === 'successful' ? 'bg-green-50 text-green-600' : 
                          tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.status}
                      </span>
                      <span className="ml-2 text-[9px] font-medium text-slate-300">#{tx.reference.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[13px] font-bold ${tx.type === 'credit' ? "text-green-600" : "text-slate-900"}`}>
                        {tx.type === 'credit' ? "+" : "-"} ₦{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
