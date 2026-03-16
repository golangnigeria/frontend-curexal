import { create } from "zustand";
import api from "../lib/api";
import { useAuthStore } from "./useAuthStore";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  doctor_id: string;
  patient_id: string;
  message: string;
  message_type: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  doctor_id: string;
  patient_id: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  other_user_id: string;
  other_user_name: string;
  other_user_role: string;
}

export interface RoomNotification {
  type: string;
  fromName: string;
  doctorId: string;
  patientId: string;
  conversationId: string;
  consultationId: string;
}

interface ChatState {
  // Connections
  notifySocket: WebSocket | null;
  chatSocket: WebSocket | null;

  // Active Chat State
  isChatOpen: boolean;
  activeConversationId: string | null;
  activeDoctorId: string | null;
  activePatientId: string | null;
  chatMessages: ChatMessage[];
  messageOffset: number;
  hasMoreMessages: boolean;

  // Pending Consultation Request State
  incomingRequests: RoomNotification[];
  recentConversations: Conversation[];
  typingUsers: Set<string>; // Set of user IDs currently typing in the active conversation
  readReceipts: Record<string, string>; // userId -> timestamp

  // Actions
  connectNotifySocket: (token: string) => void;
  disconnectNotifySocket: () => void;
  
  connectChatSocket: (token: string, conversationId: string) => void;
  disconnectChatSocket: () => void;
  
  sendMessage: (msg: string, messageType?: string) => void;
  uploadChatAttachment: (file: File) => Promise<{url: string; filename: string}>;
  setChatOpen: (isOpen: boolean) => void;
  setActiveConversation: (conv: Conversation) => void;
  
  // Handlers for Matchmaking Match
  handleMatchFound: (doctorId: string, patientId: string, conversationId: string) => void;
  setIncomingRequests: (reqs: RoomNotification[]) => void;
  removeIncomingRequest: (patientId: string) => void;

  fetchRecentConversations: () => Promise<void>;
  fetchChatHistory: (conversationId: string, reset?: boolean) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  sendTypingStatus: (isTyping: boolean) => void;
  sendReadReceipt: () => void;
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
  activeConversationId: null,
  activeDoctorId: null,
  activePatientId: null,
  chatMessages: [],
  messageOffset: 0,
  hasMoreMessages: true,
  incomingRequests: [],
  recentConversations: [],
  typingUsers: new Set(),
  readReceipts: {},

  connectNotifySocket: (token: string) => {
    if (get().notifySocket) return;

    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
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
              incomingRequests: [...state.incomingRequests.filter((r: RoomNotification) => r.patientId !== data.patientId), data] 
            }));
            window.dispatchEvent(new CustomEvent('new_notification', { detail: data }));
          } else if (data.type === "request_accepted") {
            console.log("Request accepted!", data);
            get().handleMatchFound(data.doctorId, data.patientId, data.conversationId);
          } else if (data.type === "request_rejected") {
            console.log("Request rejected", data);
            window.dispatchEvent(new CustomEvent('consultation_rejected'));
          } else if (data.type === "new_message" || data.type === "NEW_MESSAGE") {
            // Refresh conversation list to show last message and update unread count
            get().fetchRecentConversations();
            
            // If the message is for the active conversation but wasn't caught by the chatSocket 
            // (e.g. if we are on the conversation list but not the chat page)
            // Or if we just want to play a sound/show notification
            window.dispatchEvent(new CustomEvent('new_message_notif', { detail: data }));
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
      notifySocket.close(1000); // Normal closure
      set({ notifySocket: null });
    }
  },
  handleMatchFound: (doctorId: string, patientId: string, conversationId: string) => {
    set({
      activeDoctorId: doctorId,
      activePatientId: patientId,
      activeConversationId: conversationId,
      isChatOpen: true,
      chatMessages: [],
      messageOffset: 0,
      hasMoreMessages: true,
    });
    // Immediately fetch history so the UI doesn't look empty
    get().fetchChatHistory(conversationId, true);
    get().fetchRecentConversations(); // Sync the sidebar too
  },

  connectChatSocket: (token: string, conversationId: string) => {
    const { chatSocket, activeConversationId } = get();
    
    // 1. Idempotency: skip if already connected to this room
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN && activeConversationId === conversationId) {
        console.log("Chat WS already connected for this room");
        return;
    }

    if (chatSocket) {
      chatSocket.close();
    }

    console.log(`Connecting to Chat WS for conversation: ${conversationId}`);
    const ws = new WebSocket(`${WS_BASE_URL}/chat/ws?conversation_id=${conversationId}&token=${token}`);

    ws.onopen = () => console.log("Chat WS Connected");
    
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { type, data } = payload;
        
        console.log(`Chat WS event received: ${type}`, data);

        if (type === "message" || type === "NEW_MESSAGE") {
          const msg: ChatMessage = data;
          
          if (msg.conversation_id !== get().activeConversationId) {
            set((state) => ({
              recentConversations: state.recentConversations.map(c => 
                c.id === msg.conversation_id 
                  ? { ...c, unread_count: (c.unread_count || 0) + 1, last_message: msg.message, last_message_at: msg.created_at }
                  : c
              )
            }));
            return;
          }

          set((state) => {
            const existingIndex = state.chatMessages.findIndex(m => m.id === msg.id || (m.id.startsWith('temp-') && m.sender_id === msg.sender_id && m.message.trim() === msg.message.trim()));
            const newMessages = [...state.chatMessages];
            if (existingIndex !== -1) {
              newMessages[existingIndex] = msg;
            } else {
              newMessages.push(msg);
            }
            return { chatMessages: newMessages };
          });
          get().fetchRecentConversations();
        } else if (type === "MESSAGE_DELIVERED") {
          const { message_id, conversation_id } = data;
          if (conversation_id === get().activeConversationId) {
            set((state) => ({
              chatMessages: state.chatMessages.map(m => m.id === message_id ? { ...m, status: 'delivered' } : m)
            }));
          }
        } else if (type === "MESSAGE_READ") {
          const { conversation_id, read_at, user_id } = data;
          if (conversation_id === get().activeConversationId) {
            set((state) => ({
              chatMessages: state.chatMessages.map(m => m.status !== 'read' ? { ...m, status: 'read', read_at } : m),
              readReceipts: { ...state.readReceipts, [user_id]: read_at }
            }));
          }
        } else if (type === "typing") {
          const { user_id, is_typing, conversation_id } = data;
          if (conversation_id !== get().activeConversationId) return;
          
          set((state) => {
            const next = new Set(state.typingUsers);
            if (is_typing) next.add(user_id);
            else next.delete(user_id);
            return { typingUsers: next };
          });
        } else if (type === "read_receipt") {
          const { user_id, read_at, conversation_id } = data;
          if (conversation_id !== get().activeConversationId) return;

          set((state) => ({
            readReceipts: { ...state.readReceipts, [user_id]: read_at }
          }));
        }
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
      console.log("Explicitly disconnecting Chat WS and clearing state");
      chatSocket.close(1000);
      set({ chatSocket: null, isChatOpen: false, chatMessages: [], activeConversationId: null });
    }
  },

  sendMessage: (msg: string, messageType: string = "text") => {
    const { chatSocket, activeConversationId, recentConversations, isChatOpen, activeDoctorId, activePatientId } = get();
    const { user } = useAuthStore.getState();
    
    console.log("[WS SEND] Attempting send:", {
      socketReady: chatSocket?.readyState,
      activeConversationId,
      hasUser: !!user,
      isChatOpen
    });

    if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
      console.error("[WS SEND ERROR] Socket not open or null", chatSocket?.readyState);
      return;
    }
    
    if (!activeConversationId) {
      console.error("[WS SEND ERROR] No active conversation ID");
      return;
    }

    if (!user) {
      console.error("[WS SEND ERROR] No authenticated user found in AuthStore");
      return;
    }

    const otherUser = recentConversations.find(c => c.id === activeConversationId);
    
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      sender_id: user?.id || "",
      receiver_id: otherUser?.other_user_id || "",
      doctor_id: activeDoctorId || "",
      patient_id: activePatientId || "",
      message: msg,
      message_type: messageType,
      status: 'sending',
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    set((state) => ({
      chatMessages: [...state.chatMessages, tempMessage]
    }));

    chatSocket.send(JSON.stringify({
      type: "message",
      message: msg,
      payload: {
          message_type: messageType
      }
    }));
    
    console.log("[WS SEND] Message sent to socket", tempMessage.id);
  },

  uploadChatAttachment: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const { data } = await api.post("/chat/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      
      return data; // {url, public_id, filename}
    } catch (err) {
      console.error("Failed to upload chat attachment", err);
      throw err;
    }
  },

  sendTypingStatus: (isTyping: boolean) => {
    const { chatSocket } = get();
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({
        type: "typing",
        payload: { is_typing: isTyping }
      }));
    }
  },

  sendReadReceipt: () => {
    const { chatSocket } = get();
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(JSON.stringify({
        type: "read_receipt",
        payload: {}
      }));
    }
  },

  setChatOpen: (isOpen: boolean) => set({ isChatOpen: isOpen }),
  setActiveConversation: (conv: Conversation) => {
    const { activeConversationId } = get();
    if (activeConversationId === conv.id) {
      console.log("Same conversation selected, ignoring reset");
      set({ isChatOpen: true });
      return;
    }

    console.log("Setting active conversation:", conv.id);
    set({
      activeConversationId: conv.id,
      activeDoctorId: conv.doctor_id,
      activePatientId: conv.patient_id,
      isChatOpen: true,
      chatMessages: [],
      messageOffset: 0,
      hasMoreMessages: true,
    });
    
    // Automatically fetch history and mark as read when selecting a conversation
    get().fetchChatHistory(conv.id, true);
    get().markAsRead(conv.id);
  },
  setIncomingRequests: (reqs: RoomNotification[]) => set({ incomingRequests: reqs }),
  removeIncomingRequest: (patientId: string) => set((state) => ({
    incomingRequests: state.incomingRequests.filter((r) => r.patientId !== patientId)
  })),

  fetchRecentConversations: async () => {
    try {
      const { data } = await api.get("/api/chat/conversations");
      console.log("Conversations:", data);
      set({ recentConversations: data || [] });
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  },

  fetchChatHistory: async (conversationId: string, reset: boolean = true) => {
    try {
      const limit = 50;
      const offset = reset ? 0 : get().messageOffset;
      console.log(`Fetching history for ${conversationId}, reset=${reset}, offset=${offset}`);
      const { data } = await api.get(`/api/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`);
      
      set((state) => {
        const newMessages = data as ChatMessage[];
        let mergedMessages: ChatMessage[];

        if (reset) {
          // Robust Merge: Keep existing real-time messages that aren't in the fetched history
          // This avoids losing messages sent/received while history was loading
          const fetchedIds = new Set(newMessages.map(m => m.id));
          const unsavedMessages = state.chatMessages.filter(m => !fetchedIds.has(m.id));
          mergedMessages = [...newMessages, ...unsavedMessages];
          console.log(`History reset/merge: Fetched ${newMessages.length}, kept ${unsavedMessages.length} unsaved. Total: ${mergedMessages.length}`);
        } else {
          // Prepended merging for "load more"
          const existingIds = new Set(state.chatMessages.map(m => m.id));
          const filteredNew = newMessages.filter(m => !existingIds.has(m.id));
          mergedMessages = [...filteredNew, ...state.chatMessages];
          console.log(`History prepend: Fetched ${newMessages.length}, new items ${filteredNew.length}. Total: ${mergedMessages.length}`);
        }

        // Sort chronologically just in case
        mergedMessages.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        return {
          chatMessages: mergedMessages,
          messageOffset: offset + newMessages.length,
          hasMoreMessages: newMessages.length === limit,
        };
      });

      // If we just opened the chat, mark as read
      if (reset) {
        get().markAsRead(conversationId);
      }
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  },

  loadMoreMessages: async () => {
    const { activeConversationId, hasMoreMessages } = get();
    if (activeConversationId && hasMoreMessages) {
      await get().fetchChatHistory(activeConversationId, false);
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      // Notify the other party via WebSocket
      get().sendReadReceipt();

      // Update the UI locally immediately
      set((state) => ({
        recentConversations: state.recentConversations.map(c => 
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      }));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  },
}));
