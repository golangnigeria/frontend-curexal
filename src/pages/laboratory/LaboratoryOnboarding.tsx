import { useState } from "react";
import { Building, MapPin, Mail, Phone, FileText, Send, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { motion } from "framer-motion";

const LaboratoryOnboarding = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    license_number: "",
    license_url: "", // In a real app, this would be a file upload
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/laboratories/onboarding", formData);
      setIsFinished(true);
      toast.success("Onboarding data submitted successfully");
    } catch (err) {
      toast.error("Failed to submit laboratory data");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Onboarding Complete</h1>
        <p className="text-slate-600 text-lg">
          Your facility details have been submitted to the Curexal Clinical Board. 
          Verification typically takes 24-48 business hours.
        </p>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4 text-left max-w-md mx-auto">
          <AlertCircle className="text-amber-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Status: Pending Approval</h4>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              While pending, you will not appear in the doctor's directory for investigation routing. 
              We'll notify you once approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laboratory Onboarding</h1>
        <p className="text-slate-500 mt-2">Complete your facility profile to join the Curexal provider network.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                     <Building size={14} className="text-primary-500" /> Facility Official Name
                  </label>
                  <Input 
                    required 
                    placeholder="e.g. HealthCenter Diagnostics" 
                    className="h-12 text-base font-semibold"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                     <MapPin size={14} className="text-primary-500" /> Physical Address
                  </label>
                  <Input 
                    required 
                    placeholder="Full street address, city, state" 
                    className="h-12"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                         <Mail size={14} className="text-primary-500" /> Contact Email
                      </label>
                      <Input 
                        required 
                        type="email"
                        placeholder="lab-results@example.com"
                        className="h-12"
                        value={formData.contact_email}
                        onChange={e => setFormData({...formData, contact_email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                         <Phone size={14} className="text-primary-500" /> Contact Phone
                      </label>
                      <Input 
                        required 
                        placeholder="+234..."
                        className="h-12"
                        value={formData.contact_phone}
                        onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                     <ShieldCheck size={14} className="text-primary-500" /> Medical License Number
                  </label>
                  <Input 
                    required 
                    placeholder="e.g. MLN-2023-XXXXX" 
                    className="h-12 font-mono"
                    value={formData.license_number}
                    onChange={e => setFormData({...formData, license_number: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                     <FileText size={14} className="text-primary-500" /> Digital License URL
                  </label>
                  <Input 
                    required 
                    placeholder="Link to your scanned license (optional for demo)" 
                    className="h-12"
                    value={formData.license_url}
                    onChange={e => setFormData({...formData, license_url: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400 italic mt-1">
                    * In a production environment, this would be a secure document upload component.
                  </p>
                </div>
             </div>
          </Card>

          <Button 
            type="submit" 
            className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold shadow-xl shadow-primary-600/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting Application..." : <>
              Submit Onboarding Profile <Send className="ml-2" size={20} />
            </>}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 border-0 text-white shadow-2xl">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Board Compliance</h3>
             <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   </div>
                   <p className="text-xs text-slate-300 leading-relaxed">
                     Must provide valid medical diagnostic facility license.
                   </p>
                </li>
                <li className="flex gap-3">
                   <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   </div>
                   <p className="text-xs text-slate-300 leading-relaxed">
                     Verification status will be set to 'Pending' upon submission.
                   </p>
                </li>
             </ul>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default LaboratoryOnboarding;
