import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../lib/api';

const PaymentCoordination = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/care-agent/fund-wallet', {
        patient_id: patientId,
        amount: parseFloat(amount)
      });
      toast.success('Funds successfully added to patient wallet');
      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-12 bg-white rounded-3xl shadow-xl border border-gray-100 text-center space-y-8 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payment Successful</h2>
          <p className="text-gray-500 mt-2 text-lg">₦{amount} has been added to the patient's wallet.</p>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button 
            onClick={() => { setIsSuccess(false); setAmount(''); setPatientId(''); }} 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold transition-all"
          >
            New Payment
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-black">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors text-black leading-none">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Coordination</h1>
          <p className="text-gray-500">Fund patient wallets for care continuity in the field.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6 text-black">
              <div className="flex flex-col gap-1.5 text-black">
                <label className="text-sm font-semibold text-gray-700">Patient Search / UUID</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={patientId} 
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Enter Patient ID"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-black">
                <label className="text-sm font-semibold text-gray-700">Amount (NGN)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">₦</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex gap-3">
                  <AlertCircle className="text-indigo-600 shrink-0" size={20} />
                  <p className="text-sm text-indigo-900 leading-relaxed">
                    By finalizing this payment, you confirm that you have collected the equivalent physical cash or bank transfer from the patient and are now crediting their digital Curexal wallet.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Process Funding</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="text-sm text-gray-500">Today's Total</span>
                <span className="font-bold text-gray-900">₦0.00</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="text-sm text-gray-500">Processed Today</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <History size={18} className="text-indigo-600" />
              Recent Records
            </h3>
            <div className="text-center py-6">
              <p className="text-sm text-gray-400">No recent payments processed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCoordination;
