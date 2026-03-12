import { useState, useRef, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import api from "../../lib/api";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { token, user } = useAuthStore();
  const { incomingRequests, removeIncomingRequest, handleMatchFound } =
    useChatStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use a simpler condition to check if there are requests for a doctor
  const isDoctor = user?.role_name === "doctor";
  const requests = isDoctor ? incomingRequests : [];

  const handleAction = async (
    action: "accept" | "reject",
    patientId: string,
  ) => {
    setProcessingId(patientId);
    try {
      await api.post(`/api/chat/${action}`, { patient_id: patientId });

      if (action === "accept" && token) {
        toast.success("Consultation accepted. Opening chat...");
        // Ensure we pass the appropriate IDs. The notification has the patientId.
        // We know the doctorId is the current user since this is the doctor view.
        handleMatchFound(user!.id, patientId, token);
      } else {
        toast.info("Consultation rejected.");
      }
      removeIncomingRequest(patientId);
    } catch (err: unknown) {
      console.error(`Failed to ${action} consultation`, err);
      toast.error(`Failed to ${action} consultation. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary-600 transition-all shadow-sm group focus:outline-none"
      >
        <Bell size={20} />
        {requests.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
            {requests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {requests.length > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {requests.length} New
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {requests.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No new notifications
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <div
                    key={req.patientId}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <User size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {req.fromName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested a consultation
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() =>
                              handleAction("reject", req.patientId)
                            }
                            disabled={processingId === req.patientId}
                            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() =>
                              handleAction("accept", req.patientId)
                            }
                            disabled={processingId === req.patientId}
                            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
