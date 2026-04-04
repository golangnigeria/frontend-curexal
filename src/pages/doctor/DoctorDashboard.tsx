import { useState, useEffect } from "react";
import { Users, MessageSquare, Activity, CheckCircle, Power, Eye, EyeOff, Loader2, User as UserIcon, ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDoctorAvailability, type DoctorAvailability } from "../../hooks/useDoctorAvailability";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

interface PatientProfile {
  registration_number?: string;
  gender?: string;
  phone_number?: string;
  date_of_birth?: string;
}

interface Match {
  id: string;
  status: string;
  matched_at: string;
  patient?: { 
    name: string;
    patient_profile?: PatientProfile;
  };
}

const DoctorDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [initialApiStatus, setInitialApiStatus] = useState<DoctorAvailability | undefined>();
  const { status, setStatus } = useDoctorAvailability(initialApiStatus);
  
  const [counts, setCounts] = useState({
    activeChats: 0,
    totalPatients: 0,
    pendingResults: 0,
    completedToday: 0,
  });
  
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          api.get("/profile/me"),
          api.get("/chats/history"),
        ]);

        const profile = profileRes.data.doctor_profile;
        if (profile) {
          setInitialApiStatus({
            isOnline: profile.is_online,
            isVisible: profile.is_visible_for_matching,
          });
        }

        const matches = historyRes.data.matches || [];
        const active = matches.filter((m: Match) => m.status === 'active');
        setActiveMatches(active);
        
        setCounts({
          activeChats: active.length,
          totalPatients: 142,
          pendingResults: 3,
          completedToday: matches.filter((m: Match) => m.status === 'closed' && format(new Date(m.matched_at), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length,
        });
      } catch (err) {
        console.error("Failed to fetch doctor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleToggleOnline = () => {
    setStatus({
      isOnline: !status.isOnline,
      isVisible: status.isVisible, // Maintain visibility setting
    });
    toast.success(`You are now ${!status.isOnline ? 'Online' : 'Offline'}`);
  };

  const handleToggleVisibility = () => {
    setStatus({
      isOnline: status.isOnline,
      isVisible: !status.isVisible,
    });
    toast.success(`Priority matching ${!status.isVisible ? 'enabled' : 'disabled'}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
      <p className="text-sm text-slate-500">Loading workspace...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Profile & Controls */}
      <Card className="border-none shadow-none bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-3">
              Dr. {user?.name?.split(" ")[1] || user?.name || "Doctor"}
            </h2>
            <div className="flex items-center gap-2">
               <span className={`h-2.5 w-2.5 rounded-full ${status.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
               <p className="text-sm font-medium text-slate-600">
                 System Status: {status.isOnline ? 'Receiving Patients' : 'Offline'}
               </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button 
              variant={status.isOnline ? "primary" : "outline"}
              onClick={handleToggleOnline}
              className={`flex-1 md:flex-none ${status.isOnline ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            >
              <Power className="mr-2 h-4 w-4" />
              {status.isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
            <Button 
              variant="outline"
              onClick={handleToggleVisibility}
              className="flex-1 md:flex-none"
            >
              {status.isVisible ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4 text-slate-400" />}
              {status.isVisible ? 'Visible' : 'Hidden'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Consultations", value: counts.activeChats, icon: MessageSquare },
          { label: "Total Patients", value: counts.totalPatients, icon: Users },
          { label: "Pending Lab Results", value: counts.pendingResults, icon: Activity },
          { label: "Completed Today", value: counts.completedToday, icon: CheckCircle },
        ].map((stat, i) => (
          <Card key={i} className="hover:border-slate-300 transition-colors cursor-pointer shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <stat.icon className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full border-slate-200">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-lg font-bold">Patient Queue</CardTitle>
              <Link to="/dashboard/consultations">
                 <Button variant="ghost" size="sm" className="text-primary-600">History</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {activeMatches.length > 0 ? activeMatches.map((match) => (
                  <div key={match.id} className="flex flex-col sm:flex-row items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-5 w-full mb-4 sm:mb-0">
                      <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-0.5 flex flex-wrap items-center gap-2">
                          {match.patient?.name || "Secure Patient"}
                          {match.patient?.patient_profile?.registration_number && (
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {match.patient.patient_profile.registration_number}
                            </span>
                          )}
                        </h4>
                        
                        {match.patient?.patient_profile && (
                           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mb-2">
                              {match.patient.patient_profile.gender && (
                                 <span className="capitalize font-medium">{match.patient.patient_profile.gender}</span>
                              )}
                              {match.patient.patient_profile.date_of_birth && (
                                 <span className="font-medium">
                                    {Math.floor((new Date().getTime() - new Date(match.patient.patient_profile.date_of_birth).getTime()) / 31557600000)} yrs
                                 </span>
                              )}
                              {match.patient.patient_profile.phone_number && (
                                 <span>{match.patient.patient_profile.phone_number}</span>
                              )}
                           </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                           <Badge variant="success" className="px-2 py-0">Waiting</Badge>
                           <p className="text-xs font-medium text-slate-500">
                             Matched at {format(new Date(match.matched_at), "h:mm a")}
                           </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/dashboard/chats/${match.id}`)}
                      variant="primary"
                      className="w-full sm:w-auto shrink-0 shadow-sm"
                    >
                      Enter Session
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-16 px-6">
                     <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <MessageSquare className="h-8 w-8 text-slate-300" />
                     </div>
                     <h3 className="text-sm font-semibold text-slate-900 mb-1">Queue Empty</h3>
                     <p className="text-sm text-slate-500 max-w-sm mx-auto">
                       There are no active patient matches waiting. Keep your status online to receive new consultations.
                     </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts & Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Clinical Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-6">
              <div className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                   <Badge variant="danger">High Priority</Badge>
                   <p className="text-xs text-slate-400 mt-0.5">10m ago</p>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-0.5">Metabolic Panel Results</h4>
                <p className="text-xs text-slate-500">Patient: David Clark</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                   <Badge variant="secondary">Standard</Badge>
                   <p className="text-xs text-slate-400 mt-0.5">1h ago</p>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-0.5">Follow-up Reminder</h4>
                <p className="text-xs text-slate-500">Patient: Sarah Jenkins</p>
              </div>
              
              <Button variant="ghost" className="w-full text-xs font-semibold text-slate-600 mt-2">
                 View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
