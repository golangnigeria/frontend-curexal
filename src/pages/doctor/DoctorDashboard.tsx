import { Users, Calendar, Activity, CheckCircle, Video } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import ChatBox from "../../components/chat/ChatBox";

const DoctorDashboard = () => {
  const { user, token } = useAuthStore();
  const { connectNotifySocket, disconnectNotifySocket } = useChatStore();
  const [isOnline, setIsOnline] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/doctors/profile");
        if (response.data && typeof response.data.is_online !== "undefined") {
          setIsOnline(response.data.is_online);
        }
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (token) {
      connectNotifySocket(token);
    }
    return () => {
      disconnectNotifySocket();
    };
  }, [token, connectNotifySocket, disconnectNotifySocket]);

  const toggleOnlineStatus = async () => {
    setIsUpdating(true);
    const newStatus = !isOnline;

    try {
      await api.put("/api/doctors/online_status", { is_online: newStatus });
      setIsOnline(newStatus);
      toast.success(
        newStatus
          ? "You are now accepting consultations"
          : "You are no longer accepting consultations",
      );
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update online status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome back, Dr.{" "}
            {user?.name?.split(" ")[1] || user?.name || "Doctor"}
          </h2>
          <p className="text-slate-500 mt-1">
            Here's your schedule and patient overview for today.
          </p>
        </div>
        <div className="flex gap-3 text-sm items-center">
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium transition-colors ${isOnline ? "text-slate-500" : "text-slate-800"}`}
            >
              Offline
            </span>

            <button
              onClick={toggleOnlineStatus}
              disabled={isUpdating}
              className={`
                relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  
                focus-visible:ring-white focus-visible:ring-opacity-75
                ${isOnline ? "bg-green-500" : "bg-slate-300"}
                ${isUpdating ? "opacity-70 cursor-wait" : ""}
              `}
              role="switch"
              aria-checked={isOnline}
            >
              <span className="sr-only">Accepting Consultations</span>
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 
                  transition duration-200 ease-in-out flex items-center justify-center
                  ${isOnline ? "translate-x-6" : "translate-x-0"}
                `}
              >
                {isUpdating ? (
                  <div className="h-4 w-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
                ) : isOnline ? (
                  <Video size={14} className="text-green-500" />
                ) : null}
              </span>
            </button>

            <span
              className={`text-sm font-bold transition-colors ${isOnline ? "text-green-600" : "text-slate-500"}`}
            >
              Accepting Consultations
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary-500 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/40 rounded-xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            8
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Today's Appointments
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-accent-500 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-accent-50 rounded-xl text-accent-600 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">142</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Total Patients
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-500 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">3</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Pending Lab Results
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-green-500 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
              <CheckCircle size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">4</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Completed Today
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Upcoming Schedule
              </h3>
              <button className="text-primary-600 text-sm font-medium hover:underline">
                View Calendar
              </button>
            </div>

            <div className="space-y-4">
              {/* Mock Appointment Item */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50/50 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-center min-w-12">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      10:30
                    </span>
                    <span className="text-xs text-slate-500">AM</span>
                  </div>
                  <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Michael Johnson
                    </h4>
                    <p className="text-sm text-slate-500">
                      Regular Checkup • Physical
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:border-primary-500 transition-colors">
                    View File
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Start Visit
                  </button>
                </div>
              </div>

              {/* Mock Appointment Item */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border-l-4 border-slate-200 bg-white hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-center min-w-12">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      11:15
                    </span>
                    <span className="text-xs text-slate-500">AM</span>
                  </div>
                  <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Sarah Williams
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>{" "}
                      Virtual Consultation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Lab Results */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                New Lab Results
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <Activity size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                    Comprehensive Metabolic
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Patient: David Clark
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold text-red-700 bg-red-100 rounded">
                    Attention Required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatBox />
    </div>
  );
};

export default DoctorDashboard;
