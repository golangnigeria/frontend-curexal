import { useState, useEffect } from "react";
import {
  Activity,
  MessageSquare,
  Clock,
  Stethoscope,
  AlertTriangle,
  Bell,
  User as UserIcon,
  Loader2,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

interface Match {
  id: string;
  status: string;
  matched_at: string;
  doctor?: {
    user: { name: string };
    specialty: string;
  };
}

const PatientDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    consultations: 0,
    tests: 0,
    prescriptions: 0,
    reminders: 0,
  });
  
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleSpeakToDoctor = async () => {
    setIsMatching(true);
    toast.info("Searching for an available doctor...");

    try {
      const res = await api.post("/patients/match");
      if (res.data.match) {
        toast.success("Doctor matched! Establishing secure session...");
        setTimeout(() => {
          navigate(`/dashboard/chats/${res.data.match.id}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Matching failed:", err);
      let errorMsg = "No available doctors at the moment. Please try again shortly.";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.detail || errorMsg;
      }
      toast.error(errorMsg);
      setIsMatching(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [matchesRes, testsRes, rxRes, remindersRes] =
          await Promise.allSettled([
            api.get("/chats/history"),
            api.get("/patients/tests"),
            api.get("/patients/prescriptions"),
            api.get("/patients/reminders"),
          ]);

        const matches = matchesRes.status === "fulfilled" ? matchesRes.value.data.matches || [] : [];
        setRecentMatches(matches.slice(0, 3));

        setCounts({
          consultations: matches.length,
          tests: testsRes.status === "fulfilled" && Array.isArray(testsRes.value.data) ? testsRes.value.data.length : 0,
          prescriptions: rxRes.status === "fulfilled" && Array.isArray(rxRes.value.data) ? rxRes.value.data.length : 0,
          reminders: remindersRes.status === "fulfilled" && Array.isArray(remindersRes.value.data) ? remindersRes.value.data.length : 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Matching Overlay */}
      <AnimatePresence>
        {isMatching && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm mx-4"
            >
              <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-primary-100 blur-2xl rounded-full"></div>
                 <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto relative" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Connecting...</h2>
              <p className="text-slate-500 text-sm">
                Finding the best available specialist for you. This usually takes less than a minute.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Welcome Banner */}
      <Card className="bg-gradient-to-br from-primary-50 to-white overflow-hidden relative border-primary-100">
        <div className="absolute top-0 right-0 p-32 bg-primary-200/50 rounded-full blur-[100px] w-64 h-64 -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Patient"}
            </h2>
            <p className="text-slate-600 text-sm">
              Your health dashboard is up to date. Ready for a consultation?
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
             <Button variant="danger" className="flex-1 md:flex-none h-11" onClick={() => toast.info('SOS triggered')}>
               <AlertTriangle className="mr-2 h-4 w-4" />
               SOS
             </Button>
             <Button variant="primary" className="flex-1 md:flex-none h-11 shadow-md shadow-primary-500/20" onClick={handleSpeakToDoctor} disabled={isMatching}>
               <Stethoscope className="mr-2 h-4 w-4" />
               Consult Doctor
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Consultations", value: counts.consultations, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Lab Tests", value: counts.tests, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Prescriptions", value: counts.prescriptions, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Reminders", value: counts.reminders, icon: Bell, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="hover:border-primary-200 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-lg font-bold">Recent Consultations</CardTitle>
              <Link to="/dashboard/consultations">
                 <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                   View All
                 </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMatches.length > 0 ? recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Dr. {match.doctor?.user.name || "Specialist"}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {match.doctor?.specialty || "General Consultation"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={match.status === 'active' ? 'success' : 'secondary'} className="mb-1">
                         {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(match.matched_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No recent consultations found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
               <CardTitle className="text-lg font-bold">Medication Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Static Example for UI */}
               <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                 <div className="h-8 w-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-semibold text-slate-900 truncate">Lisinopril 10mg</h4>
                   <p className="text-xs text-slate-500">1 pill • 08:00 AM</p>
                 </div>
                 <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transform group-hover:translate-x-1 transition-all" />
               </div>

               <Button variant="outline" className="w-full text-xs h-9 border-dashed">
                 + Add New Reminder
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
