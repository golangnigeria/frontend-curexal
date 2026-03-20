import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Video,
  Plus,
  Star, 
  Play, 
  X
} from "lucide-react";

import api from "../../lib/api";
import { BookAppointmentWizard } from "../../components/patient/BookAppointmentWizard";

interface Appointment {
  id: string;
  doctor_id: string;
  doctor_name?: string;
  specialty?: string;
  appointment_type: string;
  scheduled_for: string;
  status: string;
  meeting_link?: string;
  recording_url?: string;
}

export const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showWizard, setShowWizard] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingApt, setRatingApt] = useState<Appointment | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/patients/appointments");
      if (res.status === 200) {
        const data = res.data;
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmitRating = async () => {
    if (!ratingApt) return;
    setSubmittingRating(true);
    try {
      const res = await api.post(`/patients/appointments/${ratingApt.id}/rate`, {
          rating: ratingValue,
          review: reviewText
      });
      if (res.status === 200) {
        setRatingApt(null);
        setReviewText("");
        setRatingValue(5);
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const upcoming = appointments.filter(a => a.status === "pending" || a.status === "confirmed" || a.status === "ongoing");
  const past = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500 mt-1">
            Manage your upcoming physical and virtual consultations.
          </p>
        </div>
        <button 
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={18} />
          Book Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "upcoming" ? "border-primary-600 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "past" ? "border-primary-600 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Past
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 space-y-4">
          {loading ? (
             <div className="text-center py-12 text-slate-400">Loading appointments...</div>
          ) : activeTab === "upcoming" ? (
            upcoming.length === 0 ? (
              <div className="text-center py-12 text-slate-400 border border-dashed border-slate-100 rounded-xl">No upcoming appointments.</div>
            ) : (
              upcoming.map(apt => (
                <div key={apt.id} className="p-5 border border-slate-100 rounded-xl hover:border-primary-500 transition-colors bg-slate-50">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">
                          {apt.doctor_name || "Doctor"}
                        </h4>
                        <p className="text-sm">{apt.specialty || "Specialist"}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium">
                          <div className="flex items-center gap-1 text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                            <CalendarIcon size={14} /> {new Date(apt.scheduled_for).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                            <Clock size={14} /> {new Date(apt.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                            <Video size={14} /> {apt.appointment_type.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {apt.status === "confirmed" && (
                        <button 
                          onClick={() => navigate(`/dashboard/meeting/${apt.id}`)}
                          className="flex-1 md:flex-none px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                        >
                          Join Call
                        </button>
                      )}
                      <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-medium rounded-lg transition-colors text-center">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            past.length === 0 ? (
              <div className="text-center py-12 text-slate-400 border border-dashed border-slate-100 rounded-xl">No past appointments found.</div>
            ) : (
              past.map(apt => (
                <div key={apt.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                        <Stethoscope size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700">
                          {apt.doctor_name || "Doctor"}
                        </h4>
                        <p className="text-sm">{apt.specialty || "Specialist"}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} /> {new Date(apt.scheduled_for).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {apt.status === "completed" && (
                        <>
                          {apt.recording_url && (
                             <a 
                               href={apt.recording_url} 
                               target="_blank" 
                               rel="noreferrer"
                               className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
                             >
                               <Play size={12}/> Recording
                             </a>
                          )}
                          <button 
                            onClick={() => setRatingApt(apt)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all"
                          >
                            <Star size={12}/> Rate
                          </button>
                        </>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${apt.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {showWizard && (
        <BookAppointmentWizard 
          onClose={() => setShowWizard(false)} 
        />
      )}

      {/* RATING MODAL */}
      {ratingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Rate Appointment</h3>
              <button onClick={() => setRatingApt(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400"/>
              </button>
            </div>
            <div className="p-6 space-y-6">
               <div className="text-center">
                 <p className="text-slate-500 text-sm mb-4">How was your experience with Dr. {ratingApt.doctor_name || "the doctor"}?</p>
                 <div className="flex justify-center gap-2">
                   {[1,2,3,4,5].map(v => (
                     <Star 
                       key={v}
                       onClick={() => setRatingValue(v)}
                       size={32}
                       className={`cursor-pointer transition-all ${v <= ratingValue ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-200'}`}
                     />
                   ))}
                 </div>
               </div>

               <div>
                 <label className="text-sm font-semibold text-slate-700 block mb-2">Write a review (Optional)</label>
                 <textarea 
                   rows={3}
                   value={reviewText}
                   onChange={e => setReviewText(e.target.value)}
                   className="w-full border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-primary-500 transition-all text-sm"
                   placeholder="Share your thoughts..."
                 />
               </div>

               <button 
                 disabled={submittingRating}
                 onClick={handleSubmitRating}
                 className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
               >
                 {submittingRating ? "Submitting..." : "Submit Review"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
