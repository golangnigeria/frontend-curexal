import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  XCircle,   
  Loader2,
  Trash2,
  Lock,
  Send,
  User as UserIcon,
  Paperclip,
  Phone,
  Video
} from "lucide-react";     
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  message_type: string;
  media_url?: string;
  media_public_id?: string;
  is_read: boolean;
  deleted_at?: string;
  created_at: string;
}

interface MatchInfo {
  id: string;
  status: string;
  doctor_id: string;
  patient_id: string;
  doctor?: { user: { name: string }, specialty: string };
  patient?: { name: string };
}

const ChatPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMatchAndMessages = async () => {
      try {
        const [matchRes, msgRes] = await Promise.all([
          api.get(`/chats/history`), 
          api.get(`/chats/${matchId}/messages`)
        ]);
        
        const activeMatch = matchRes.data.matches?.find((m: MatchInfo) => m.id === matchId);
        if (activeMatch) setMatch(activeMatch);
        
        setMessages(msgRes.data.messages || []);
      } catch (err: unknown) {
        console.error("Failed to fetch chat data:", err);
        const axiosError = err as AxiosError<{detail: string}>;
        const detail = axiosError.response?.data?.detail || "";
        toast.error("Could not load consultation. " + detail);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchAndMessages();
    
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/chats/${matchId}/messages`);
        if (res.data.messages?.length !== messages.length) {
          setMessages(res.data.messages || []);
        }
      } catch {
        // Silent polling error
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [matchId, messages.length]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (msgText: string, type = "text", mediaData?: { url: string, public_id: string }) => {
    if (!msgText.trim() && !mediaData) return;

    try {
      const payload = { 
        message: msgText, 
        message_type: type,
        media_url: mediaData?.url,
        media_public_id: mediaData?.public_id
      };
      const res = await api.post(`/chats/${matchId}/messages`, payload);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{detail: string}>;
      const detail = axiosError.response?.data?.detail || "Failed to send message";
      toast.error(detail);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await api.delete(`/chats/messages/${messageId}`);
      setMessages(messages.map(m => m.id === messageId ? { ...m, deleted_at: new Date().toISOString() } : m));
      toast.success("Message removed");
    } catch (err) {
      console.error("Delete message failed:", err);
      toast.error("Failed to delete message");
    }
  };

  const handleEndSession = async () => {
    setEndingSession(true);
    try {
      await api.put(`/chats/${matchId}/close`);
      toast.success("Consultation session closed successfully.");
      navigate("/dashboard/consultations");
    } catch (err: unknown) {
      console.error("End Session Error:", err);
      const axiosError = err as AxiosError<{detail: string}>;
      const detail = axiosError.response?.data?.detail || "Failed to end session";
      toast.error(`Error: ${detail}`);
      setShowEndConfirm(false);
    } finally {
      setEndingSession(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
    </div>
  );

  const partnerName = user?.role_name === "doctor" ? match?.patient?.name : `Dr. ${match?.doctor?.user.name}`;
  const partnerRole = user?.role_name === "doctor" ? "Patient" : match?.doctor?.specialty || "Specialist";

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
      
      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !endingSession && setShowEndConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white p-8 max-w-sm w-full rounded-2xl shadow-xl flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <XCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">End Consultation?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Ending this session will archive the chat. You will not be able to send new messages.
              </p>
              <div className="w-full flex flex-col gap-3">
                <Button 
                  onClick={handleEndSession}
                  disabled={endingSession}
                  variant="danger"
                  className="w-full"
                >
                  {endingSession ? <><Loader2 className="animate-spin mr-2" size={16}/> Closing Session</> : "End Session Now"}
                </Button>
                <Button 
                  onClick={() => setShowEndConfirm(false)}
                  disabled={endingSession}
                  variant="ghost"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
              <UserIcon size={24} />
            </div>
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{partnerName || "Unknown"}</h2>
            <p className="text-xs font-semibold text-primary-600">{partnerRole}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 hidden sm:flex">
             <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 hidden sm:flex">
             <Video size={20} />
          </Button>
          <Button 
            onClick={() => setShowEndConfirm(true)}
            variant="outline"
            className="ml-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-slate-200"
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/grid.svg')] bg-center relative">
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
             <Lock size={12} className="text-emerald-500" />
             End-to-End Encrypted Session
           </div>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.sender_id === user?.id;
          const isDeleted = !!msg.deleted_at;
          const showTime = index === 0 || new Date(msg.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"} group relative`}
            >
              {showTime && (
                <div className="w-full text-center text-xs font-medium text-slate-400 my-4 select-none">
                  {format(new Date(msg.created_at), "MMM d, h:mm a")}
                </div>
              )}
              
              <div className={`relative flex items-center gap-2 max-w-[80%] sm:max-w-[70%]`}>
                {!isDeleted && isMe && (
                   <button 
                     onClick={() => handleDeleteMessage(msg.id)}
                     className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-300 hover:text-rose-500 shrink-0"
                     title="Delete message"
                   >
                     <Trash2 size={14}/>
                   </button>
                )}

                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                  isMe 
                    ? "bg-primary-600 text-white rounded-tr-sm" 
                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm"
                }`}>
                  {isDeleted ? (
                    <span className="italic flex items-center gap-2 opacity-75">
                       <Trash2 size={14}/> Message recalled
                    </span>
                  ) : (
                    <>
                      {msg.message_type === "text" && (
                         <div style={{ wordBreak: 'break-word' }}>{msg.message}</div>
                      )}
                      
                      {msg.message_type === "voice" && (
                        <div className="flex items-center gap-3 py-1 min-w-[200px]">
                           <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                              <MessageCircle size={18} />
                           </div>
                           <audio controls className="h-10 w-full" style={{ filter: isMe ? 'invert(1)' : 'none' }}>
                              <source src={msg.media_url} type="audio/ogg" />
                           </audio>
                        </div>
                      )}

                      {msg.message_type === "document" && (
                        <a href={msg.media_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                           <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                              <MessageCircle size={20} />
                           </div>
                           <span className="font-medium truncate">View Attachment</span>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-400 ${isMe ? "justify-end" : "justify-start"} px-1`}>
                 {msg.created_at && format(new Date(msg.created_at), "h:mm a")}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Placeholder */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-2 py-1.5 focus-within:bg-white focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all shadow-sm">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 shrink-0">
            <Paperclip size={18} />
          </Button>

          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
          />

          <Button
            onClick={() => handleSendMessage(newMessage)}
            disabled={!newMessage.trim()}
            variant="primary"
            size="icon"
            className="h-10 w-10 rounded-full shrink-0 shadow-sm transition-transform active:scale-95"
          >
            <Send size={16} className="-ml-0.5" />
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;
