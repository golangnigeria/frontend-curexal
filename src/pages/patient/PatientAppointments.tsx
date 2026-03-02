import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Video,
  MapPin,
  Plus,
} from "lucide-react";

export const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500 mt-1">
            Manage your upcoming physical and virtual consultations.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
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
        <div className="p-6 space-y-4 text-slate-500">
          {activeTab === "upcoming" && (
            <div className="p-5 border border-slate-100 rounded-xl hover:border-primary-500 transition-colors bg-slate-50">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">
                      Dr. Emily Chen
                    </h4>
                    <p className="text-sm">Dermatologist • Skin Evaluation</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium">
                      <div className="flex items-center gap-1 text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                        <CalendarIcon size={14} /> Tomorrow, Oct 24
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                        <Clock size={14} /> 14:30 PM
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        <Video size={14} /> Virtual Consultation
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button className="flex-1 md:flex-none px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors text-center">
                    Join Call
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors text-center">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "past" && (
            <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 opacity-75">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">
                      Dr. Sarah Jenkins
                    </h4>
                    <p className="text-sm">Cardiologist • General Checkup</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={12} /> Oct 15, 2023
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> Main Hospital, Room A2
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
