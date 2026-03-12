import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../lib/api';

const ProxyRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '', // Optional
    date_of_birth: '',
    gender: 'Other',
    address: '',
    blood_group: '',
    genotype: '',
    allergies: '',
    medical_history: '',
    emergency_name: '',
    emergency_phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/care-agent/register-patient', formData);
      toast.success('Patient registered successfully!');
      setIsSuccess(true);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.detail || 'Failed to register patient');
      } else {
        toast.error('An unexpected error occurred');
      }
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
          <h2 className="text-3xl font-bold text-gray-900">Registration Complete!</h2>
          <p className="text-gray-500 mt-2 text-lg">The patient has been onboarded and their profile is now live.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl text-left border border-gray-100">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-500">Name:</span>
            <span className="font-semibold">{formData.name}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">ID:</span>
            <span className="font-mono text-indigo-600">Generated</span>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button 
            onClick={() => window.location.reload()} 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold transition-all"
          >
            Register Another
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all"
          >
            Back to Command Center
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
          <h1 className="text-2xl font-bold text-gray-900">Patient Proxy Registration</h1>
          <p className="text-gray-500">Register elderly or phone-less patients under your supervision.</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between px-4 max-w-lg mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
              step === s ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 
              step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
            {s < 3 && <div className={`w-20 h-1 mx-2 rounded-full ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 text-black">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. Samuel Okon"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="tel" name="phone_number" required value={formData.phone_number} onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="080 0000 0000"
                      />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="date" name="date_of_birth" required value={formData.date_of_birth} onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                    <select 
                      name="gender" value={formData.gender} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Blood Group</label>
                    <input 
                      type="text" name="blood_group" value={formData.blood_group} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="A+"
                    />
                </div>
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Genotype</label>
                    <input 
                      type="text" name="genotype" value={formData.genotype} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="AA"
                    />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Residential Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                      <textarea 
                        name="address" value={formData.address} onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24"
                        placeholder="Street, City, State"
                      />
                    </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                    <input 
                      type="text" name="emergency_name" value={formData.emergency_name} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Emergency Contact Phone</label>
                    <input 
                      type="tel" name="emergency_phone" value={formData.emergency_phone} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5 text-black">
                    <label className="text-sm font-semibold text-gray-700">Medical History / Notes</label>
                    <textarea 
                      name="medical_history" value={formData.medical_history} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
                      placeholder="Previous surgeries, chronic conditions, etc."
                    />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button 
            type="button" 
            onClick={step === 1 ? () => navigate(-1) : prevStep}
            className="text-gray-600 font-bold hover:text-gray-900 transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Previous Step'}
          </button>
          
          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <span>Next Step</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Finalize Registration</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProxyRegistration;
