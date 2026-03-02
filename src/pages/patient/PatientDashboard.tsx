import { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  Stethoscope,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/api";

interface DashboardRecord {
  status?: string;
  is_active?: boolean;
}

const PatientDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const [counts, setCounts] = useState({
    appointments: 0,
    tests: 0,
    prescriptions: 0,
    reminders: 0, // Using reminders instead of vitals for the 4th card based on the mockup label
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel efficiently
        const [apptsRes, testsRes, rxRes, remindersRes] =
          await Promise.allSettled([
            api.get("/patients/appointments"),
            api.get("/patients/tests"),
            api.get("/patients/prescriptions"),
            api.get("/patients/reminders"),
          ]);

        setCounts({
          appointments:
            apptsRes.status === "fulfilled" &&
            Array.isArray(apptsRes.value.data)
              ? apptsRes.value.data.filter(
                  (a: DashboardRecord) => a.status === "scheduled",
                ).length
              : 0,

          tests:
            testsRes.status === "fulfilled" &&
            Array.isArray(testsRes.value.data)
              ? testsRes.value.data.filter(
                  (t: DashboardRecord) => t.status === "pending",
                ).length
              : 0,

          prescriptions:
            rxRes.status === "fulfilled" && Array.isArray(rxRes.value.data)
              ? rxRes.value.data.length
              : 0, // Assuming all returned are active or filter if needed

          reminders:
            remindersRes.status === "fulfilled" &&
            Array.isArray(remindersRes.value.data)
              ? remindersRes.value.data.filter(
                  (r: DashboardRecord) => r.is_active,
                ).length
              : 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Actions & SOS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Patient"}!
          </h2>
          <p className="text-slate-500 mt-1">
            Here is a summary of your health tracking today.
          </p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95">
          <AlertTriangle size={20} />
          Trigger SOS
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary-500 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-50 rounded-xl text-primary-600 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">
            {counts.appointments}
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Upcoming Appointments
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-500 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{counts.tests}</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Pending Lab Tests
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-500 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">
            {counts.prescriptions}
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Active Prescriptions
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-accent-500 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-accent-50 rounded-xl text-accent-600 group-hover:scale-110 transition-transform">
              <Bell size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">
            {counts.reminders}
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Active Reminders
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Recent Appointments
              </h3>
              <button className="text-primary-600 text-sm font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {/* Mock Appointment Item */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Dr. Sarah Jenkins
                    </h4>
                    <p className="text-sm text-slate-500">
                      Cardiologist • General Checkup
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                  <p className="text-sm text-slate-500 mt-1">
                    Yesterday, 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Medication Reminders
              </h3>
            </div>

            <div className="space-y-3">
              {/* Mock Reminder Item */}
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="mt-0.5">
                  <div className="h-4 w-4 rounded-full border-2 border-primary-500"></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Lisinopril 10mg
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1 pill after breakfast • 08:00 AM
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              + Add Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
