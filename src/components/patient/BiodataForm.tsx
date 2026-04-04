import { useState } from "react";
import { 
  Calendar, 
  User, 
  Phone, 
  Clipboard, 
  MapPin, 
  HeartPulse, 
  AlertCircle 
} from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface BiodataFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  loading?: boolean;
}

export const BiodataForm = ({ initialData, onSubmit, loading }: BiodataFormProps) => {
  const [formData, setFormData] = useState({
    date_of_birth: (initialData?.date_of_birth as string)?.split('T')[0] || "",
    gender: (initialData?.gender as string) || "",
    phone_number: (initialData?.phone_number as string) || "",
    blood_group: (initialData?.blood_group as string) || "",
    genotype: (initialData?.genotype as string) || "",
    allergies: (initialData?.allergies as string) || "",
    medical_history: (initialData?.medical_history as string) || "",
    address: (initialData?.address as string) || "",
    emergency_name: (initialData?.emergency_name as string) || "",
    emergency_phone: (initialData?.emergency_phone as string) || "",
    institutional_account_id: (initialData?.institutional_account_id as string) || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "bg-white/50 backdrop-blur-sm border-slate-200 focus:bg-white transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 mb-2">
          <div className="p-1.5 bg-primary-100 text-primary-700 rounded-md">
            <User size={18} />
          </div>
          <h3 className="font-bold text-lg">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Date of Birth *</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                <Calendar size={18} />
              </div>
              <Input 
                type="date" 
                required 
                className={cn(inputClasses, "pl-10")} 
                value={formData.date_of_birth} 
                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Gender *</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                <User size={18} />
              </div>
              <select 
                required 
                value={formData.gender} 
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className={cn(
                  "block w-full border border-slate-200 rounded-xl px-10 py-2.5 bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all outline-none appearance-none",
                  !formData.gender && "text-slate-400"
                )}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number *</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                <Phone size={18} />
              </div>
              <Input 
                type="tel" 
                required 
                placeholder="+234..." 
                className={cn(inputClasses, "pl-10")} 
                value={formData.phone_number} 
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Health Metrics Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 mb-2">
          <div className="p-1.5 bg-rose-100 text-rose-700 rounded-md">
            <HeartPulse size={18} />
          </div>
          <h3 className="font-bold text-lg">Health Records</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="space-y-1.5">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Blood Group</label>
             <div className="relative">
                <Input 
                  placeholder="O+" 
                  className={cn(inputClasses, "text-center")} 
                  value={formData.blood_group} 
                  onChange={(e) => setFormData({...formData, blood_group: e.target.value})} 
                />
             </div>
           </div>
           <div className="space-y-1.5">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Genotype</label>
             <div className="relative">
                <Input 
                  placeholder="AA" 
                  className={cn(inputClasses, "text-center")} 
                  value={formData.genotype} 
                  onChange={(e) => setFormData({...formData, genotype: e.target.value})} 
                />
             </div>
           </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-500" />
              Allergies
            </label>
            <textarea 
              placeholder="List any known allergies (e.g., Peanuts, Penicillin)..."
              className={cn(inputClasses, "w-full min-h-[80px] rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary-500")}
              value={formData.allergies}
              onChange={(e) => setFormData({...formData, allergies: e.target.value})}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
              <Clipboard size={14} className="text-slate-500" />
              Medical History
            </label>
            <textarea 
              placeholder="Existing medical conditions, past surgeries, etc."
              className={cn(inputClasses, "w-full min-h-[80px] rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary-500")}
              value={formData.medical_history}
              onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
            />
          </div>
        </div>
      </section>

      {/* Emergency & Address Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 mb-2">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
            <MapPin size={18} />
          </div>
          <h3 className="font-bold text-lg">Emergency & Address</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">Home Address</label>
          <Input 
            placeholder="No. 12, Example Street, City Name..." 
            className={inputClasses} 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
           <div className="space-y-1.5">
             <label className="text-sm font-semibold text-slate-700 ml-1">Emergency Name</label>
             <Input 
               placeholder="Next of kin name" 
               className={inputClasses} 
               value={formData.emergency_name} 
               onChange={(e) => setFormData({...formData, emergency_name: e.target.value})} 
             />
           </div>
           <div className="space-y-1.5">
             <label className="text-sm font-semibold text-slate-700 ml-1">Emergency Phone</label>
             <Input 
               placeholder="+234..." 
               className={inputClasses} 
               value={formData.emergency_phone} 
               onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})} 
             />
           </div>
        </div>
      </section>

      <div className="pt-6">
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary-500/20" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving Profile...
            </div>
          ) : "Save Patient Profile"}
        </Button>
      </div>
    </form>
  );
};
