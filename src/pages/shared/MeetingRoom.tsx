import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { JitsiMeetingRoom } from "../../components/video/JitsiMeeting";
import { ArrowLeft, ShieldCheck, AlertCircle, Radio } from "lucide-react";

export const MeetingRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  
  // MOCK FETCH for appointment details
  // Normally you'd hit GET /api/appointments/:id to get meeting_link / room name
  // Here we'll simulate it for the scope since we haven't implemented a specific appointment detail endpoint.
  useEffect(() => {
    if (!id || !user) return;
    
    // Simulating API fetch
    setTimeout(() => {
      // In prod: fetch data and use the returned `meeting_link` as the roomName
      // The API generated it like `curexal-video-xyz`
      // We will parse it securely
      setRoomName(`curexal-secure-meeting-${id}`);
      setLoading(false);
    }, 1000);
  }, [id, user]);

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center p-20 animate-pulse text-slate-400">
         <div className="w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4" />
         <p>Authorizing Access...</p>
       </div>
     );
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-10">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col items-center text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2.5 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 font-medium">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-500 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Telehealth Consultation
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full mt-1 w-max">
               <ShieldCheck size={14} /> End-to-End Encrypted
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-pulse">
            <Radio size={14} className="fill-red-600"/>
            <span className="text-xs font-bold uppercase tracking-wider">Recording active</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-500 font-mono text-sm rounded-xl">
            ID: {id?.slice(0, 8)}...
          </div>
        </div>
      </div>

      <JitsiMeetingRoom 
        roomName={roomName}
        displayName={user?.name || "Participant"}
        email={user?.email || "user@curexal.com"}
        onReadyToClose={() => navigate("/dashboard/appointments")}
      />
    </div>
  );
};

export default MeetingRoom;
