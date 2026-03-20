import React, { useState, useEffect } from "react";
import api from "../../lib/api";

import { 
  Calendar, Video, X, User, ChevronRight, CheckCircle, ChevronLeft, Search, Filter 
} from "lucide-react";
import { SPECIALTIES } from "../../constants/specialties";

interface Doctor {
  user_id: string;
  specialty: string;
  name?: string; 
}

interface WizardProps {
  onClose: () => void;
}

interface DoctorService {
  service_type: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

const DEFAULT_APPT_TYPES = [
  { id: "video", title: "Video Consultation", icon: <Video className="w-5 h-5" />, price: 10000, desc: "Standard 30min video call" },
  { id: "voice", title: "Voice Call Only", icon: <Calendar className="w-5 h-5" />, price: 5000, desc: "Audio consultation" },
];

export const BookAppointmentWizard: React.FC<WizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Dynamic Services
  const [loadingServices, setLoadingServices] = useState(false);
  const [availableTypes, setAvailableTypes] = useState(DEFAULT_APPT_TYPES);
  
  const [appointmentType, setAppointmentType] = useState(DEFAULT_APPT_TYPES[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [symptoms, setSymptoms] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // const userStr = localStorage.getItem("user");
  // const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        if (res.status === 200) {
          const data = res.data;
          // Assume API returns list of doctors (could be full profiles)
          setDoctors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    // Fetch doctor services when doctor is selected
    if (selectedDoctor) {
      const fetchServices = async () => {
        try {
          setLoadingServices(true);
          const res = await api.get(`/doctors/${selectedDoctor.user_id}/services`);
          if (res.status === 200) {
            const data = res.data;
            const services: DoctorService[] = Array.isArray(data.services) ? data.services : [];
            
            // Map the fetched services to our UI array
            if (services.length > 0) {
              const mappedTypes = services.filter(s => s.is_active).map(s => ({
                id: s.service_type,
                title: s.service_type === "video" ? "Video Consultation" : "Voice Call Only",
                icon: s.service_type === "video" ? <Video className="w-5 h-5" /> : <Calendar className="w-5 h-5" />,
                price: s.price,
                desc: `${s.duration_minutes}min consultation`
              }));
              
              if (mappedTypes.length > 0) {
                setAvailableTypes(mappedTypes);
                setAppointmentType(mappedTypes[0]);
                return;
              }
            }
            
            // Fallback to default if no active services configured
            setAvailableTypes(DEFAULT_APPT_TYPES);
            setAppointmentType(DEFAULT_APPT_TYPES[0]);
          }
        } catch (err) {
          console.error("Failed to load doctor services", err);
        } finally {
          setLoadingServices(false);
        }
      };
      fetchServices();
    }
  }, [selectedDoctor]);

  const handleBookAndPay = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create Appointment (Status: pending_payment)
      const scheduledFor = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      const apptRes = await api.post("/patients/appointments", {
          doctor_id: selectedDoctor?.user_id,
          appointment_type: appointmentType.id,
          scheduled_for: scheduledFor,
          symptoms: symptoms,
          duration_minutes: 30,
          price: appointmentType.price,
      });

      if (apptRes.status !== 200) throw new Error("Could not create appointment");
      const apptData = apptRes.data;
      
      // 2. Initialize Payment
      const payRes = await api.post("/payments/initialize", {
          appointment_id: apptData.id,
          amount: appointmentType.price
      });

      if (payRes.status !== 200) throw new Error("Could not initialize payment");
      const payData = payRes.data;

      if (payData.checkout_url) {
        // Redirect to Paystack checkout
        window.location.href = payData.checkout_url;
      } else {
        throw new Error("Invalid payment response");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Book Appointment
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          {/* STEP 1: Select Doctor & Type */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-3">Select Doctor</label>
                
                {/* Search and Category Filtering */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search doctor by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    />
                  </div>
                  <div className="relative w-full sm:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="all">All Specialties</option>
                      {SPECIALTIES.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtered Doctor List */}
                {(() => {
                   const filteredDoctors = doctors.filter(doc => {
                     const matchesSearch = (doc.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                     const matchesCategory = selectedCategory === "all" || 
                       (doc.specialty || "").toLowerCase().includes(selectedCategory.toLowerCase()) ||
                       (doc.specialty || "").toLowerCase().includes(SPECIALTIES.find(s => s.id === selectedCategory)?.name.toLowerCase() || "");
                     return matchesSearch && matchesCategory;
                   });

                   if (filteredDoctors.length === 0) {
                     return (
                       <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                         <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                         <p className="text-sm text-slate-500">No doctors found matching your criteria.</p>
                         <button 
                           onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                           className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                         >
                           Clear Filters
                         </button>
                       </div>
                     );
                   }

                   return (
                    <div className="grid sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                      {filteredDoctors.map(doc => (
                        <div 
                          key={doc.user_id}
                          onClick={() => setSelectedDoctor(doc)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 shadow-sm hover:shadow-md ${selectedDoctor?.user_id === doc.user_id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-slate-200 bg-white hover:border-primary-300'}`}
                        >
                          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <User className="w-5 h-5"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">{doc.name || "Unknown Doctor"}</p>
                            <p className="text-xs text-slate-500 font-medium truncate">{doc.specialty}</p>
                          </div>
                          {selectedDoctor?.user_id === doc.user_id && <CheckCircle className="w-4 h-4 text-primary-600 mt-1" />}
                        </div>
                      ))}
                    </div>
                   );
                })()}

                {/* Fallback for empty state testing - keeping "Any Available" but making it look premium */}
                {doctors.length === 0 && searchTerm === "" && selectedCategory === "all" && (
                   <div 
                    onClick={() => setSelectedDoctor({ user_id: "00000000-0000-0000-0000-000000000000", specialty: "General Practitioner", name: "Dr. Any Available" })}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 mt-4 shadow-sm hover:shadow-md ${selectedDoctor?.user_id === "00000000-0000-0000-0000-000000000000" ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-slate-200 bg-white hover:border-primary-300'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600"><User className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold text-slate-800">Any Available Doctor</p>
                        <p className="text-xs text-slate-500 font-medium">Automatic Matchmaking</p>
                      </div>
                    </div>
                    {selectedDoctor?.user_id === "00000000-0000-0000-0000-000000000000" && <CheckCircle className="w-5 h-5 text-primary-600" />}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-3">Consultation Type</label>
                {loadingServices ? (
                  <div className="p-4 text-center text-sm text-slate-500 animate-pulse bg-slate-50 rounded-xl">Loading pricing...</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {availableTypes.map(type => (
                      <div 
                        key={type.id}
                        onClick={() => setAppointmentType(type)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${appointmentType.id === type.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-slate-200 bg-white hover:border-primary-300'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${appointmentType.id === type.id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                            {type.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{type.title}</p>
                            <p className="text-xs text-slate-500 font-medium">₦{type.price.toLocaleString()}</p>
                          </div>
                        </div>
                        {appointmentType.id === type.id && <CheckCircle className="w-5 h-5 text-primary-600" />}
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* STEP 2: Date, Time & Symptoms */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Select Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // from today
                    className="w-full border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Select Time</label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="" disabled>Choose a time</option>
                    <option value="09:00:00">09:00 AM</option>
                    <option value="10:00:00">10:00 AM</option>
                    <option value="11:30:00">11:30 AM</option>
                    <option value="14:00:00">02:00 PM</option>
                    <option value="16:00:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Symptoms or Reason for Visit</label>
                <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[100px]"
                  placeholder="Briefly describe what you're experiencing..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: Review & Pay */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-white border text-center p-6 border-slate-200 rounded-2xl shadow-sm">
                <div className="inline-flex items-center justify-center p-4 bg-primary-50 text-primary-600 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Confirm and Pay</h3>
                <p className="text-slate-500 text-sm mb-6">Review your appointment details below before processing your payment securely via Paystack.</p>
                
                <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 space-y-3 relative overflow-hidden">
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm font-medium">Doctor</span>
                    <span className="text-slate-800 font-bold">{selectedDoctor?.name || 'Any Available'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm font-medium">Consultation</span>
                    <span className="text-slate-800 font-bold">{appointmentType.title}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm font-medium">Date & Time</span>
                    <span className="text-slate-800 font-bold">{selectedDate} @ {selectedTime.slice(0,5)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-700 font-semibold text-lg">Total Amount</span>
                    <span className="text-primary-600 font-black text-xl">₦{appointmentType.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-400">
                <p className="text-xs flex items-center gap-2"><Lock className="w-3 h-3"/> Secured by Paystack</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1"
            disabled={loading}
          >
            {step > 1 ? <><ChevronLeft className="w-4 h-4" /> Back</> : "Cancel"}
          </button>
          
          <button 
            onClick={() => {
              if (step === 1 && selectedDoctor) setStep(2);
              else if (step === 2 && selectedDate && selectedTime) setStep(3);
              else if (step === 3) handleBookAndPay();
            }}
            disabled={
              loading || 
              (step === 1 && !selectedDoctor) ||
              (step === 2 && (!selectedDate || !selectedTime))
            }
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-medium rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
          >
            {loading ? "Processing..." : (
              step === 3 ? "Complete Payment" : <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Extracted Lock Icon since wasn't imported from lucide-react above easily
const Lock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
