import { useState } from "react";
import { Search, CreditCard, Beaker, ShieldCheck, MapPin, Receipt, Activity, AlertCircle } from "lucide-react";
import axios from "axios";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";

interface PrescriptionData {
  prescription: {
    id: string;
    code: string;
    status: string;
    doctor: {
      name: string;
    };
    laboratory: {
      name: string;
      address: string;
    };
    investigations: Array<{
      id: string;
      name: string;
      base_price: number;
    }>;
  };
  pricing: {
    base_total: number;
    platform_fee: number;
    grand_total: number;
  };
}

const PatientRedeemPrescription = () => {
  const [code, setCode] = useState("");
  const [data, setData] = useState<PrescriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setData(null);
    try {
      const response = await api.get(`/investigations/lookup?code=${code.toUpperCase()}`);
      setData(response.data);
    } catch (err: unknown) {
      let detail = "Invalid or expired code";
      if (axios.isAxiosError(err)) {
        detail = err.response?.data?.detail || detail;
      }
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!data) return;

    setIsPaying(true);
    try {
      const response = await api.post("/investigations/pay", { code: data.prescription.code });
      const { authorization_url } = response.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        toast.error("Failed to initialize payment gateway");
      }
    } catch (err) {
      toast.error("Payment initialization failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Redeem Investigation Code</h1>
        <p className="text-slate-500 mt-2">Enter the retrieval code issued by your doctor to proceed with clinical testing.</p>
      </div>

      <Card className="p-6 overflow-visible shadow-xl border-primary-100 bg-white">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input 
              placeholder="Enter 10-character code (e.g. ABC123XYZ0)" 
              className="pl-12 h-14 text-lg font-bold tracking-widest border-slate-200 focus:border-primary-500"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={10}
            />
          </div>
          <Button 
            type="submit" 
            className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold"
            disabled={isLoading || code.length < 5}
          >
            {isLoading ? "Validating..." : "Retrieve Order"}
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Prescription Details */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-emerald-100 text-emerald-700 mb-2">Verified Order</Badge>
                    <h3 className="text-xl font-bold font-accent-500 text-slate-900 uppercase tracking-tight">
                       Clinical Request: {data.prescription.code}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                    <Beaker size={24} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prescribing Doctor</p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                       <ShieldCheck className="text-primary-500" size={16} /> Dr. {data.prescription.doctor.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Laboratory</p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                       <MapPin className="text-primary-500" size={16} /> {data.prescription.laboratory.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic pl-6">{data.prescription.laboratory.address}</p>
                  </div>
                </div>

                <div className="mt-6">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Diagnostic Investigations</p>
                   <div className="space-y-3">
                      {data.prescription.investigations.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                           <div className="flex items-center gap-3">
                              <Activity className="text-primary-600" size={18} />
                              <span className="font-semibold text-slate-700 text-sm">{inv.name}</span>
                           </div>
                           <span className="text-xs font-bold text-slate-500">₦{inv.base_price.toLocaleString()}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </Card>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                 <AlertCircle className="text-amber-600 shrink-0" size={24} />
                 <div>
                    <h4 className="font-bold text-amber-900 text-sm">Action Required</h4>
                    <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                      This order must be paid for before arriving at the laboratory. Your receipt will be automatically transmitted to the facility.
                    </p>
                 </div>
              </div>
            </div>

            {/* Payment Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-2xl bg-white sticky top-24 ring-1 ring-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Receipt className="text-primary-600" size={20} />
                   Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal (Clinical)</span>
                      <span className="font-bold text-slate-900">₦{data.pricing.base_total.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Platform Fee (3%)</span>
                      <span className="font-bold text-slate-900">₦{data.pricing.platform_fee.toLocaleString()}</span>
                   </div>
                   <div className="h-px bg-slate-100 my-4" />
                   <div className="flex justify-between text-base">
                      <span className="font-extrabold text-slate-900">Grand Total</span>
                      <span className="font-extrabold text-primary-700 text-lg">₦{data.pricing.grand_total.toLocaleString()}</span>
                   </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                   {isPaying ? "Diverting to Secure Gate..." : (
                     <>
                        <CreditCard size={18} />
                        Pay via Paystack
                     </>
                   )}
                </button>

                <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
                   <div className="flex gap-2">
                       <div className="h-2 w-8 bg-slate-200 rounded-full" />
                       <div className="h-2 w-8 bg-slate-200 rounded-full" />
                       <div className="h-2 w-8 bg-slate-200 rounded-full" />
                   </div>
                   <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                      Fully Encrypted 256-bit SSL Security
                   </p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientRedeemPrescription;
