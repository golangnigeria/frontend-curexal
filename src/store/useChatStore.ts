import { create } from "zustand";

export interface ChatMessage {
  id?: string;
  sender_id: string;
  doctor_id: string;
  patient_id: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface RoomNotification {
  type: string; // "new_message", "incoming_request", "request_accepted", "request_rejected"
  fromName: string;
  doctorId: string;
  patientId: string;
}

interface ChatState {
  // Connections
  notifySocket: WebSocket | null;
  chatSocket: WebSocket | null;

  // Active Chat State
  isChatOpen: boolean;
  activeDoctorId: string | null;
  activePatientId: string | null;
  chatMessages: ChatMessage[];

  // Pending Consultation Request State
  incomingRequests: RoomNotification[];

  // Actions
  connectNotifySocket: (token: string) => void;
  disconnectNotifySocket: () => void;
  
  connectChatSocket: (token: string, doctorId: string, patientId: string) => void;
  disconnectChatSocket: () => void;
  
  sendMessage: (msg: string) => void;
  setChatOpen: (isOpen: boolean) => void;
  
  // Handlers for Matchmaking Match
  handleMatchFound: (doctorId: string, patientId: string, token: string) => void;
  setIncomingRequests: (reqs: RoomNotification[]) => void;
  removeIncomingRequest: (patientId: string) => void;
}

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace("http", "ws") || "ws://localhost:8081/api";

export const useChatStore = create<ChatState>((set, get) => ({
  notifySocket: null,
  chatSocket: null,
  isChatOpen: false,
  activeDoctorId: null,
  activePatientId: null,
  chatMessages: [],
  incomingRequests: [],

  connectNotifySocket: (token: string) => {
    if (get().notifySocket) return; // already connected

    // We pass the token in the URL or rely on cookies.
    // The backend `auth.Auth` accepts the `access_token` cookie.
    // But since WebSockets might not send cross-origin cookies easily in dev,
    // we can append it as a query param if the backend supports it.
    // However, our auth_handler fallback checks the cookie or Authorization header.
    // Since browser WS API doesn't allow custom headers, we'll try standard WS 
    // and rely on the frontend sending the cookie automatically if withCredentials is setup 
    // on the domain, or we pass it in the URL if the backend is modified.
    // Let's assume cookies work for now as the backend uses `ctx.GetCookie("access_token")`.
    
    const ws = new WebSocket(`${WS_BASE_URL}/chat/notify?token=${token}`);

    ws.onopen = () => console.log("Notify WS Connected");
    
    ws.onmessage = (event) => {
      try {
        const data: RoomNotification = JSON.parse(event.data);
        if (data.type === "incoming_request") {
          console.log("Incoming consultation request!", data);
          set((state) => ({ incomingRequests: [...state.incomingRequests, data] }));
        } else if (data.type === "request_accepted") {
            console.log("Request accepted!", data);
            get().handleMatchFound(data.doctorId, data.patientId, token);
        } else if (data.type === "request_rejected") {
            console.log("Request rejected", data);
            // Rejection toast or state here -- handled by component effect listening to changes if needed.
            // But we can also dispatch a custom event on window
            window.dispatchEvent(new CustomEvent('consultation_rejected'));
        } else if (data.type === "new_message") {
          // If chat isn't open with this person, we might want to show a toast
          if (!get().isChatOpen) {
            // Toast would ideally go here, but Zustand shouldn't house UI toasts directly.
            // A component listening to this state will handle it.
            console.log("New message from", data.fromName);
          }
        }
      } catch (err) {
        console.error("Failed to parse notify message", err);
      }
    };

    ws.onclose = () => {
      console.log("Notify WS Disconnected");
      set({ notifySocket: null });
      // Optional: implement reconnection logic here
    };

    set({ notifySocket: ws });
  },

  disconnectNotifySocket: () => {
    const { notifySocket } = get();
    if (notifySocket) {
      notifySocket.close();
      set({ notifySocket: null });
    }
  },

  handleMatchFound: (doctorId: string, patientId: string, token: string) => {
    set({
      activeDoctorId: doctorId,
      activePatientId: patientId,
      isChatOpen: true,
      chatMessages: [], // Clear old messages
    });
    get().connectChatSocket(token, doctorId, patientId);
  },

  connectChatSocket: (token: string, doctorId: string, patientId: string) => {
    const { chatSocket } = get();
    if (chatSocket) {
      chatSocket.close();
    }

    const ws = new WebSocket(`${WS_BASE_URL}/chat/ws?doctor=${doctorId}&patient=${patientId}&token=${token}`);

    ws.onopen = () => console.log("Chat WS Connected");
    
    ws.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data);
        set((state) => ({ chatMessages: [...state.chatMessages, msg] }));
      } catch (err) {
        console.error("Failed to parse chat message", err);
      }
    };

    ws.onclose = () => {
      console.log("Chat WS Disconnected");
      set({ chatSocket: null });
    };

    set({ chatSocket: ws });
  },

  disconnectChatSocket: () => {
    const { chatSocket } = get();
    if (chatSocket) {
      chatSocket.close();
      set({ chatSocket: null, isChatOpen: false, chatMessages: [] });
    }
  },

  sendMessage: (msg: string) => {
    const { chatSocket } = get();
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({ message: msg }));
    } else {
      console.error("Cannot send message, chat socket is not open");
    }
  },

  setChatOpen: (isOpen: boolean) => set({ isChatOpen: isOpen }),
  setIncomingRequests: (reqs: RoomNotification[]) => set({ incomingRequests: reqs }),
  removeIncomingRequest: (patientId: string) => set((state) => ({
    incomingRequests: state.incomingRequests.filter((r) => r.patientId !== patientId)
  })),
}));
