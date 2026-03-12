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

const getWsBaseUrl = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
    // Clean up trailing slashes
    const baseUrl = apiBaseUrl.replace(/\/+$/, "");
    
    // Ensure it starts with ws or wss
    const wsUrl = baseUrl.replace(/^http/, "ws");
    
    // If it doesn't already contain /api, add it
    return wsUrl.includes("/api") ? wsUrl : `${wsUrl}/api`;
};

const WS_BASE_URL = getWsBaseUrl();

export const useChatStore = create<ChatState>((set, get) => ({
  notifySocket: null,
  chatSocket: null,
  isChatOpen: false,
  activeDoctorId: null,
  activePatientId: null,
  chatMessages: [],
  incomingRequests: [],

  connectNotifySocket: (token: string) => {
    if (get().notifySocket) return;

    let reconnectTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 10;

    const connect = () => {
      console.log(`Attempting to connect Notify WS (Attempt ${retryCount + 1}) to ${WS_BASE_URL}/chat/notify...`);
      const ws = new WebSocket(`${WS_BASE_URL}/chat/notify?token=${token}`);

      ws.onopen = () => {
        console.log("Notify WS Connected");
        retryCount = 0;
        set({ notifySocket: ws });
      };

      ws.onmessage = (event) => {
        try {
          const data: RoomNotification = JSON.parse(event.data);
          if (data.type === "incoming_request") {
            console.log("Incoming consultation request!", data);
            set((state) => ({ 
              incomingRequests: [...state.incomingRequests.filter(r => r.patientId !== data.patientId), data] 
            }));
            // Dispatch custom event for visual feedback in components that don't use the store directly
            window.dispatchEvent(new CustomEvent('new_notification', { detail: data }));
          } else if (data.type === "request_accepted") {
            console.log("Request accepted!", data);
            get().handleMatchFound(data.doctorId, data.patientId, token);
          } else if (data.type === "request_rejected") {
            console.log("Request rejected", data);
            window.dispatchEvent(new CustomEvent('consultation_rejected'));
          }
        } catch (err) {
          console.error("Failed to parse notify message", err);
        }
      };

      ws.onclose = (event) => {
        console.log("Notify WS Disconnected", event.reason);
        set({ notifySocket: null });

        // Don't reconnect if it was a normal closure (e.g. logout)
        if (event.code !== 1000 && retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          console.log(`Reconnecting Notify WS in ${delay}ms...`);
          
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(() => {
            retryCount++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (err) => {
        console.error("Notify WS Error", err);
        ws.close();
      };
    };

    connect();

    // Store cleanup logic in the state if needed, but for now we rely on explicit disconnect
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
