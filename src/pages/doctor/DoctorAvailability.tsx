import React, { useState, useEffect } from "react";
import { Plus, Trash2, Clock, CalendarDays, Check, AlertTriangle, X } from "lucide-react";
import api from "../../lib/api";

interface Slot {
  id?: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Helper to format 24h time to 12h AM/PM
const formatTimeToAMPM = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  let hr = parseInt(hours);
  const ampm = hr >= 12 ? "PM" : "AM";
  hr = hr % 12;
  hr = hr ? hr : 12; // the hour '0' should be '12'
  return `${hr}:${minutes} ${ampm}`;
};

interface DoctorService {
  id?: string;
  service_type: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

export const DoctorAvailability: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"schedule" | "services">("schedule");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New slot form
  const [newWeekday, setNewWeekday] = useState(1);
  const [newStartTime, setNewStartTime] = useState("09:00:00");
  const [newEndTime, setNewEndTime] = useState("17:00:00");
  const [newDuration, setNewDuration] = useState(30);

  // Services State
  const [servicesLoading, setServicesLoading] = useState(true);
  const [doctorServices, setDoctorServices] = useState<DoctorService[]>([]);
  const [serviceForm, setServiceForm] = useState<DoctorService>({
    service_type: "video",
    price: 15000,
    duration_minutes: 30,
    is_active: true
  });

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);


  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctors/me/availability");
      if (res.status === 200) {
        setSlots(Array.isArray(res.data) ? res.data : []);
      } else {
        setError("Failed to load availability");
      }
    } catch {
      setError("An error occurred loading availability");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const res = await api.get("/doctors/me/services");
      if (res.status === 200) {
        setDoctorServices(Array.isArray(res.data.services) ? res.data.services : []);
      }
    } catch (error) {
      console.error("fetchServices: error:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchServices();
  }, []); 

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/doctors/availability", {
          weekday: newWeekday,
          start_time: newStartTime.length === 5 ? newStartTime + ":00" : newStartTime,
          end_time: newEndTime.length === 5 ? newEndTime + ":00" : newEndTime,
          slot_duration: newDuration
      });

      if (res.status === 200 || res.status === 201) {
        fetchAvailability();
        // Reset form
        setNewStartTime("09:00:00");
        setNewEndTime("17:00:00");
      } else {
        setError("Failed to add slot");
      }
    } catch {
      setError("Network error occurred");
    }
  };

  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;
    
    try {
      const res = await api.delete(`/doctors/availability/${slotToDelete}`);
      if (res.status === 200) {
        fetchAvailability();
        setIsDeleteModalOpen(false);
        setSlotToDelete(null);
      } else {
        setError("Failed to delete slot");
      }
    } catch {
      setError("Network error occurred while deleting");
    }
  };

  const openDeleteModal = (slotId: string) => {
    setSlotToDelete(slotId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Practice Setup</h2>
          <p className="text-slate-500 mt-1">
            Manage your weekly working periods and consultation pricing.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "schedule" ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            }`}
          >
            Working Schedule
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "services" ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            }`}
          >
            Pricing & Services
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      {activeTab === "schedule" && (
        <div className="grid md:grid-cols-3 gap-6">
        {/* ADD NEW SLOT FORM */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Plus className="w-5 h-5 text-primary-600"/>
            </div>
            Add Time Slot
          </h3>
          
          <form onSubmit={handleAddSlot} className="space-y-5">
            {/* Day of Week - Custom "Neat" Selection */}
            <div>
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Day of Week</label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day, idx) => {
                  const isSelected = newWeekday === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewWeekday(idx)}
                      className={`flex-1 min-w-[45px] py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                        isSelected 
                          ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200" 
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:border-primary-200 hover:bg-white"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Start Time</label>
                <div className="relative group">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="time" 
                    value={newStartTime} 
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all text-slate-700 font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">End Time</label>
                <div className="relative group">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="time" 
                    value={newEndTime} 
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all text-slate-700 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Slot Duration - Neater Selection */}
            <div>
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Slot Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map((duration) => {
                  const isSelected = newDuration === duration;
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setNewDuration(duration)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                        isSelected 
                          ? "bg-primary-50 border-primary-200 text-primary-700 ring-2 ring-primary-500/10" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {duration}m
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/25 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Save Schedule Slot
              </button>
            </div>
          </form>
        </div>

        {/* LIST EXISTING SLOTS */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-primary-600"/> Current Schedule
          </h3>
          
          <div className="flex-1">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400">Loading schedule...</div>
            ) : slots.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-100 rounded-xl">
                <Clock className="w-12 h-12 mb-3 text-slate-300"/>
                <p>No availability slots set up yet.</p>
                <p className="text-sm mt-1 text-slate-400 text-center">Add slots to allow patients to book appointments with you.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {WEEKDAYS.map((day, idx) => {
                  const daySlots = slots.filter(s => s.weekday === idx);
                  if (daySlots.length === 0) return null;
                  
                  return (
                    <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-semibold text-slate-700 capitalize">
                        {day}
                      </div>
                      <div className="p-2 space-y-2">
                        {daySlots.map((slot, i) => (
                          <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-lg hover:border-primary-200 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-primary-100 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTimeToAMPM(slot.start_time)} - {formatTimeToAMPM(slot.end_time)}
                              </div>
                              <span className="text-slate-400 text-[13px] font-medium">{slot.slot_duration} min units</span>
                            </div>
                            <button 
                              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100" 
                              title="Delete Slot"
                              onClick={() => slot.id && openDeleteModal(slot.id)}
                            >
                              <Trash2 className="w-4.5 h-4.5"/>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
            }
          </div>
        </div>
      </div>
      )}

      {activeTab === "services" && (
        <DoctorServicesTab 
          services={doctorServices} 
          loading={servicesLoading} 
          fetchServices={fetchServices} 
          formState={serviceForm}
          setFormState={setServiceForm}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 pb-2 flex justify-between items-start">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 pt-2">
              <h4 className="text-xl font-bold text-slate-800 mb-2">Delete Time Slot?</h4>
              <p className="text-slate-500 leading-relaxed">
                This action cannot be undone. Patients will no longer be able to book appointments during this time period.
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSlot}
                className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/25 transition-all active:scale-[0.98]"
              >
                Delete Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Separate Component for the Services Tab to keep file organized
// -------------------------------------------------------------
const DoctorServicesTab = ({ 
  services, loading, fetchServices, formState, setFormState 
}: { 
  services: DoctorService[], loading: boolean, fetchServices: () => void, formState: DoctorService, setFormState: (s: DoctorService) => void 
}) => {
  const [saving, setSaving] = useState(false);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/doctors/services", formState);
      if (res.status === 200 || res.status === 201) fetchServices();
    } catch(err) {
      console.error(err)
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Plus className="w-5 h-5 text-primary-600"/>
          </div>
          Add or Update Service
        </h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Service Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "video", label: "Video", icon: "video" },
                { id: "voice", label: "Voice", icon: "phone" }
              ].map((type) => {
                const isSelected = formState.service_type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormState({...formState, service_type: type.id})}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all border flex flex-col items-center gap-1 ${
                      isSelected 
                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200" 
                        : "bg-slate-50 border-slate-100 text-slate-600 hover:border-primary-200 hover:bg-white"
                    }`}
                  >
                    <span className="capitalize font-bold">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Price (NGN)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary-500 transition-colors">₦</span>
              <input 
                type="number" 
                value={formState.price}
                onChange={e => setFormState({...formState, price: parseFloat(e.target.value)})}
                className="w-full pl-9 pr-4 py-2.5 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all text-slate-700 font-medium"
                required min={0}
              />
            </div>
          </div>
          <div>
            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Duration (Minutes)</label>
            <div className="relative group">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="number" 
                value={formState.duration_minutes}
                onChange={e => setFormState({...formState, duration_minutes: parseInt(e.target.value)})}
                className="w-full pl-10 pr-4 py-2.5 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all text-slate-700 font-medium"
                required min={5}
              />
            </div>
          </div>
          <div className="pt-2">
            <button 
              disabled={saving} 
              type="submit" 
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {saving ? "Saving..." : "Save Service"}
            </button>
          </div>
        </form>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
         <h3 className="text-lg font-bold text-slate-800 mb-4">Active Services</h3>
         <div className="flex-1">
            {loading ? (
              <div className="text-slate-400 text-center py-8">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="text-slate-400 text-center p-8 border-2 border-dashed border-slate-100 rounded-xl">
                No services configured. Add specific pricing for Voice or Video above.
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-800 capitalize">{s.service_type} Consultation</h4>
                      <p className="text-sm text-slate-500">{s.duration_minutes} minutes duration</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary-600">₦{s.price.toLocaleString()}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  )
}

export default DoctorAvailability;
