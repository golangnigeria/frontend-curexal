import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  ChevronRight,
  LogOut,
  Edit2,
  CheckCircle2,
  XCircle,
  Hash,
  Camera,
  Loader2,
  Calendar,
  Phone,
  Droplet,
  MapPin,
  Clipboard,
  Briefcase,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BiodataForm } from "../../components/patient/BiodataForm";
import { ProviderEarnings } from "../../components/profile/ProviderEarnings";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../lib/utils";

interface ProfileData {
  id: string;
  user_id: string;
  registration_number?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  avatar_url?: string;
  genotype?: string;
  allergies?: string;
  medical_history?: string;
  address?: string;
  phone_number?: string;
  emergency_name?: string;
  emergency_phone?: string;
  // Doctor/Agent specific
  specialty?: string;
  license_number?: string;
  years_of_experience?: number;
  bio?: string;
  medical_school?: string;
  clinic_address?: string;
  languages_spoken?: string;
  [key: string]: unknown;
}

const ProfileSettings = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "medical" | "professional" | "finances">("personal");

  const isPatient = user?.role_name === "patient";
  const isProvider = user?.role_name === "doctor" || user?.role_name === "care_agent";
  const isAdmin = user?.role_name === "admin";

  useEffect(() => {
    fetchProfile();
    // Set default tab based on role
    if (isPatient) setActiveTab("medical");
    else if (isProvider) setActiveTab("professional");
    else setActiveTab("personal");
  }, [user?.role_name]);

  const fetchProfile = async () => {
    try {
      let endpoint = "/patients/profile";
      if (user?.role_name === "doctor") endpoint = "/doctors/profile"; // We might need to add this endpoint or handle it
      // For now, let's assume we can fetch what we need
      const res = await api.get(endpoint);
      setProfile(res.data.profile || res.data.doctor_profile);
    } catch {
      // If it fails, maybe the profile isn't created yet (e.g. for new docs)
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData: Record<string, string>) => {
    setSaving(true);
    try {
      let endpoint = "/patients/profile";
      if (user?.role_name === "doctor") endpoint = "/doctors/profile";
      
      const res = await api.put(endpoint, formData);
      setProfile(res.data.profile || res.data.doctor_profile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || "Update failed";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const newAvatarUrl = res.data.avatar_url;
      updateUser({ avatar_url: newAvatarUrl });
      toast.success("Avatar updated successfully");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Loading secure profile...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-12 text-left">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm mb-8"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-600 to-primary-400" />
        
        <div className="relative pt-16 pb-8 px-6 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-xl overflow-hidden group relative">
               {uploadingAvatar && (
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <Loader2 className="text-white animate-spin" size={32} />
                 </div>
               )}
               
               {user?.avatar_url ? (
                 <img src={user.avatar_url} className="h-full w-full object-cover" />
               ) : (
                 <User size={64} className="text-slate-300 group-hover:scale-110 transition-transform duration-300" />
               )}
               
               <label className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Camera className="text-white drop-shadow-md" size={32} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
               </label>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
             <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100">
                  <CheckCircle2 size={12} /> {user?.role_name?.replace('_', ' ')}
                </span>
                {profile?.registration_number && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full border border-primary-100">
                    <Hash size={12} /> {profile.registration_number}
                  </span>
                )}
             </div>
          </div>

          {!isAdmin && (
            <div className="hidden md:block">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all duration-300",
                  isEditing 
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100" 
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10"
                )}
              >
                {isEditing ? <XCircle size={18} /> : <Edit2 size={18} />}
                {isEditing ? "Cancel" : "Edit Details"}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Navigation Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col gap-1">
             {isPatient && (
               <TabButton 
                 active={activeTab === "medical"} 
                 onClick={() => setActiveTab("medical")}
                 icon={<Clipboard size={18} />}
                 label="Medical Records"
               />
             )}
             
             {isProvider && (
               <TabButton 
                 active={activeTab === "professional"} 
                 onClick={() => setActiveTab("professional")}
                 icon={<Briefcase size={18} />}
                 label="Professional Profile"
               />
             )}

             {isProvider && (
               <TabButton 
                 active={activeTab === "finances"} 
                 onClick={() => setActiveTab("finances")}
                 icon={<Wallet size={18} />}
                 label="Earnings & Payouts"
               />
             )}

             <TabButton 
               active={activeTab === "personal"} 
               onClick={() => setActiveTab("personal")}
               icon={<User size={18} />}
               label="Account Security"
             />

             <button 
               onClick={logout}
               className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-50 transition-colors mt-4"
             >
               <LogOut size={18} /> Logout Securely
             </button>
          </div>

          {/* Quick Stats for Providers */}
          {isProvider && profile?.wallet && (
             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Balance</p>
               <p className="text-2xl font-bold">₦{profile.wallet.balance.toLocaleString()}</p>
             </div>
          )}
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === "medical" && isPatient && (
              <motion.div 
                key="medical"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-bold text-slate-900">Medical Biodata</h3>
                   <button onClick={() => setIsEditing(true)} className="md:hidden p-2 bg-slate-100 text-slate-600 rounded-xl">
                     <Edit2 size={18} />
                   </button>
                </div>
                
                {isEditing ? (
                  <BiodataForm initialData={profile || undefined} onSubmit={handleUpdate} loading={saving} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <InfoItem label="Date of Birth" value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-GB') : 'Not Set'} icon={<Calendar size={16}/>}/>
                    <InfoItem label="Gender" value={profile?.gender || 'Not Set'} icon={<User size={16}/>}/>
                    <InfoItem label="Phone" value={profile?.phone_number || 'Not Set'} icon={<Phone size={16}/>}/>
                    <InfoItem label="Blood Group" value={profile?.blood_group || 'Not Set'} icon={<Droplet size={16}/>}/>
                    <InfoItem label="Genotype" value={profile?.genotype || 'Not Set'} icon={<Settings size={16}/>}/>
                    <InfoItem label="Address" value={profile?.address || 'Not Set'} icon={<MapPin size={16}/>} className="md:col-span-2"/>
                    <InfoItem label="Allergies" value={profile?.allergies || 'None recorded'} icon={<Shield size={16}/>} className="md:col-span-2"/>
                    <InfoItem label="Medical History" value={profile?.medical_history || 'No recorded history'} icon={<Clipboard size={16}/>} className="md:col-span-2"/>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "professional" && isProvider && (
              <motion.div 
                key="professional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
              >
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-bold text-slate-900">Professional Profile</h3>
                   <button onClick={() => setIsEditing(true)} className="md:hidden p-2 bg-slate-100 text-slate-600 rounded-xl">
                     <Edit2 size={18} />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <InfoItem label="Specialty" value={profile?.specialty || 'Not Set'} icon={<Briefcase size={16}/>}/>
                  <InfoItem label="License Number" value={profile?.license_number || 'Not Set'} icon={<Shield size={16}/>}/>
                  <InfoItem label="Experience" value={`${profile?.years_of_experience || 0} Years`} icon={<Calendar size={16}/>}/>
                  <InfoItem label="Medical School" value={profile?.medical_school || 'Not Set'} icon={<Clipboard size={16}/>}/>
                  <InfoItem label="Languages" value={profile?.languages_spoken || 'Not Set'} icon={<Hash size={16}/>}/>
                  <InfoItem label="Clinic Address" value={profile?.clinic_address || 'Not Set'} icon={<MapPin size={16}/>} className="md:col-span-2"/>
                  <InfoItem label="Bio / About" value={profile?.bio || 'No bio provided'} icon={<Edit2 size={16}/>} className="md:col-span-2"/>
                </div>
              </motion.div>
            )}

            {activeTab === "finances" && isProvider && (
              <motion.div 
                key="finances"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ProviderEarnings />
              </motion.div>
            )}

            {activeTab === "personal" && (
              <motion.div 
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Security & Login</h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">Email Address</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Primary</span>
                   </div>

                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">Password</p>
                        <p className="text-sm text-slate-500">••••••••••••</p>
                      </div>
                      <button className="text-sm font-bold text-primary-600 hover:underline">Change Password</button>
                   </div>

                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Secure your account with 2FA</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Enable</button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
      active 
        ? "bg-primary-50 text-primary-700 shadow-sm shadow-primary-500/5" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <span className={cn("transition-colors", active ? "text-primary-600" : "text-slate-400")}>
      {icon}
    </span>
    {label}
  </button>
);

const InfoItem = ({ label, value, icon, className }: { label: string, value: string, icon: ReactNode, className?: string }) => (
  <div className={cn("space-y-1.5", className)}>
    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
       {icon} {label}
    </p>
    <p className="text-slate-900 font-semibold bg-slate-50/50 px-4 py-2.5 rounded-xl border border-slate-100">{value}</p>
  </div>
);

export default ProfileSettings;
