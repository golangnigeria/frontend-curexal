import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Clock, 
  User as UserIcon, 
  ChevronRight, 
  Search,
  Filter,
  Calendar,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

interface Match {
  id: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  matched_at: string;
  ended_at?: string;
  doctor?: {
    specialty: string;
    user: { name: string };
  };
  patient?: {
    name: string;
  };
}

const Consultations = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/chats/history");
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    const name = user?.role_name === "doctor" ? m.patient?.name : m.doctor?.user.name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search consultations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-12 shrink-0">
          <Filter className="mr-2 h-4 w-4 text-slate-500" />
          Filter view
        </Button>
      </div>

      {/* Consultations List */}
      <div className="grid gap-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className="group cursor-pointer hover:border-primary-300 hover:shadow-md transition-all"
                onClick={() => navigate(`/dashboard/chats/${match.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-5 w-full">
                      <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <UserIcon className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-900 truncate">
                            {user?.role_name === "doctor" ? match.patient?.name : `Dr. ${match.doctor?.user.name}`}
                          </h3>
                          <Badge variant={match.status === 'active' ? 'success' : 'secondary'} className="px-2">
                            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" />
                            {format(new Date(match.matched_at), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-slate-400" />
                            {match.status === 'active' ? 'Ongoing Session' : `Ended ${format(new Date(match.ended_at!), "h:mm a")}`}
                          </div>
                          {user?.role_name === 'patient' && match.doctor?.specialty && (
                            <span className="text-primary-600 font-medium">
                              • {match.doctor.specialty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                       <Button variant="ghost" className="w-full sm:w-auto text-primary-600 font-medium">
                         View Session
                         <ChevronRight className="ml-1 h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <MessageSquare className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Consultations Yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {user?.role_name === 'patient' 
                ? "You haven't requested any medical consultations. Consult a doctor from your dashboard when needed."
                : "You have no consultation history yet. Ensure you are online to receive patient matches."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;
