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
import { useChatStore } from "../../store/useChatStore";
import api from "../../lib/api";
import { toast } from "react-toastify";
import SpecialtySelectorModal from "../../components/chat/SpecialtySelectorModal";
import ChatBox from "../../components/chat/ChatBox";

interface DashboardRecord {
  status?: string;
  is_active?: boolean;
}

const PatientDashboard = () => {
  const { user, token } = useAuthStore();
  const { connectNotifySocket, disconnectNotifySocket } = useChatStore();

  const [counts, setCounts] = useState({
    appointments: 0,
    tests: 0,
    prescriptions: 0,
    reminders: 0, 
  });

  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleSpeakToDoctor = () => {
    setIsSpecialtyModalOpen(true);
  };

  const handleSpecialtySelect = async (specialtyId: string) => {
    setIsMatchmaking(true);
    try {
      // Create request payload. (The backend may or may not use the specialty ID yet,
      // but we send it for future-proofing or if the backend processes it).
      const payload = { specialty: specialtyId };

      const response = await api.post("/api/chat/request", payload);

      if (response.data?.doctor_id) {
        toast.info("Match found! Waiting for the doctor to accept...");
        setIsSpecialtyModalOpen(false);
        // The background Notify WebSocket will receive the "request_accepted" event automatically
      }
    } catch (err: any) {
      console.error("Matchmaking error", err);
      // Give the patient a nice response if no doctors are online/available
      toast.error(
        err.response?.data?.detail ||
          "No doctors are currently available for this specialty. Please try again later or schedule an appointment.",
        { autoClose: 6000 },
      );
    } finally {
      setIsMatchmaking(false);
    }
  };

  useEffect(() => {
    // Connect to the global notification socket when the dashboard loads
    if (token) {
      connectNotifySocket(token);
    }

    const handleRejection = () => {
      toast.error(
        "The doctor is currently unavailable. Please try another specialty or schedule an appointment.",
        { autoClose: 6000 },
      );
    };

    window.addEventListener("consultation_rejected", handleRejection);

    return () => {
      // Disconnect when leaving the dashboard (optional, or keep it global in App.tsx)
      disconnectNotifySocket();
      window.removeEventListener("consultation_rejected", handleRejection);
    };
  }, [token, connectNotifySocket, disconnectNotifySocket]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel efficiently
        const [apptsRes, testsRes, rxRes, remindersRes] =
          await Promise.allSettled([
            api.get("/api/patients/appointments"),
            api.get("/api/patients/tests"),
            api.get("/api/patients/prescriptions"),
            api.get("/api/patients/reminders"),
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
              : 0,

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 w-full transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Patient"}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here is a summary of your health tracking today.
          </p>
        </div>
        <div className="flex flex-row gap-2 w-full md:w-auto">
          <button
            onClick={handleSpeakToDoctor}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-3 md:px-5 py-3 rounded-xl font-bold uppercase tracking-tight md:tracking-wide text-[10px] md:text-xs shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Stethoscope size={18} />
            <span className="truncate">Speak to Doctor</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 md:px-5 py-3 rounded-xl font-bold uppercase tracking-tight md:tracking-wide text-[10px] md:text-xs shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95">
            <AlertTriangle size={18} />
            <span className="truncate">Trigger SOS</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary-500 transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
              <Calendar size={22} className="md:w-6 md:h-6" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            {counts.appointments}
          </h3>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase md:normal-case tracking-wider md:tracking-normal">
            Upcoming Appointments
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-purple-500 transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Activity size={22} className="md:w-6 md:h-6" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            {counts.tests}
          </h3>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase md:normal-case tracking-wider md:tracking-normal">
            Pending Lab Tests
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-amber-500 transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Clock size={22} className="md:w-6 md:h-6" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            {counts.prescriptions}
          </h3>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase md:normal-case tracking-wider md:tracking-normal">
            Active Prescriptions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-accent-500 transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-accent-50 dark:bg-accent-500/10 rounded-xl text-accent-600 dark:text-accent-400 group-hover:scale-110 transition-transform">
              <Bell size={22} className="md:w-6 md:h-6" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            {counts.reminders}
          </h3>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase md:normal-case tracking-wider md:tracking-normal">
            Active Reminders
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                Recent Appointments
              </h3>
              <button className="text-primary-600 text-sm font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {/* Mock Appointment Item */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 trasition-colors">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white transition-colors">
                      Dr. Sarah Jenkins
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Cardiologist • General Checkup
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 transition-colors">
                    Completed
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Yesterday, 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
                Medication Reminders
              </h3>
            </div>

            <div className="space-y-3">
              {/* Mock Reminder Item */}
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                <div className="mt-0.5">
                  <div className="h-4 w-4 rounded-full border-2 border-primary-500"></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white transition-colors">
                    Lisinopril 10mg
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    1 pill after breakfast • 08:00 AM
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
              + Add Reminder
            </button>
          </div>
        </div>
      </div>

      <SpecialtySelectorModal
        isOpen={isSpecialtyModalOpen}
        onClose={() => setIsSpecialtyModalOpen(false)}
        onSelect={handleSpecialtySelect}
        isLoading={isMatchmaking}
      />
      <ChatBox />
    </div>
  );
};

export default PatientDashboard;
