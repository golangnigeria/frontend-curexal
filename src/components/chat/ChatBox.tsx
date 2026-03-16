import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import type { ChatMessage, Conversation } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { X, Send, Minimize2, Maximize2, Paperclip, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBox = () => {
  const { 
    isChatOpen, 
    setChatOpen, 
    chatMessages, 
    sendMessage, 
    activeConversationId, 
    recentConversations, 
    fetchChatHistory,
    connectChatSocket,
    typingUsers,
    sendTypingStatus,
    sendReadReceipt,
    readReceipts,
    uploadChatAttachment
  } = useChatStore();
  const { user, token } = useAuthStore();
  const [msgInput, setMsgInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadChatAttachment(file);
      const isImage = file.type.startsWith('image/');
      sendMessage(url, isImage ? 'image' : 'file');
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Fetch history and connect socket when chat opens
  useEffect(() => {
    if (isChatOpen && activeConversationId && token) {
      fetchChatHistory(activeConversationId, true);
      connectChatSocket(token, activeConversationId);
      // Send read receipt when opening chat
      sendReadReceipt();
    }
  }, [isChatOpen, activeConversationId, token, fetchChatHistory, connectChatSocket, sendReadReceipt]);

  const activeConv = recentConversations.find((c: Conversation) => c.id === activeConversationId);
  const otherUserName = activeConv?.other_user_name || (user?.role_name === "doctor" ? "Patient" : "Doctor");
  const otherUserId = activeConv?.other_user_id;

  // Check if someone else is typing
  const isOtherTyping = Array.from(typingUsers).some(id => id !== user?.id);


  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (!isMinimized && isChatOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isMinimized, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    
    // Stop typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTypingStatus(false);
    
    sendMessage(msgInput);
    setMsgInput("");
    
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsgInput(e.target.value);
    
    // Typing indicator logic
    if (!typingTimeoutRef.current) {
      sendTypingStatus(true);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className={`fixed z-50 right-4 sm:right-8 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isMinimized
            ? "bottom-4 w-72 h-16"
            : "bottom-4 sm:bottom-8 w-[90vw] sm:w-[380px] h-[550px] max-h-[85vh]"
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white cursor-pointer select-none"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
              {otherUserName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-sm leading-none">{otherUserName}</h4>
              <p className="text-[10px] text-green-400 font-medium mt-1">
                ● Connected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setChatOpen(false);
              }}
              className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Area */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 backdrop-blur-sm">
              <div className="text-center py-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-full border border-slate-100 shadow-sm">
                  Encryption active
                </span>
              </div>
              
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-blue-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm rotate-3">
                    <span className="text-3xl">🩺</span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 mb-2">
                    Professional consultation
                  </h5>
                  <p className="text-sm text-slate-500 max-w-[200px]">
                    Share symptoms or medical concerns securely.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg: ChatMessage, i: number) => {
                  const isMe = msg.sender_id === user?.id;
                  const showReadReceipt = isMe && i === chatMessages.length - 1 && readReceipts[otherUserId || ''];
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={msg.id || i}
                      className={`flex flex-col gap-1 ${
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      } max-w-[85%]`}
                    >
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm shadow-sm transition-all ${
                        isMe
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      {msg.message_type === 'image' ? (
                        <img 
                          src={msg.message} 
                          alt="Attachment" 
                          className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                          onClick={() => window.open(msg.message, '_blank')}
                        />
                      ) : msg.message_type === 'file' ? (
                        <a 
                          href={msg.message} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 underline"
                        >
                          <Paperclip size={14} />
                          <span>File</span>
                        </a>
                      ) : (
                        msg.message
                      )}
                    </div>
                      
                      <div className="flex items-center gap-1.5 px-1.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Sending..."}
                        </span>
                        {isMe && (
                           <CheckCheck 
                             size={12} 
                             className={
                               msg.status === 'read' || showReadReceipt 
                                 ? "text-primary-500" 
                                 : msg.status === 'delivered'
                                   ? "text-slate-400"
                                   : "text-slate-300"
                             } 
                           />
                        )}
                      </div>
                      {(msg.status === 'read' || showReadReceipt) && (
                        <span className="text-[8px] text-primary-500 font-bold -mt-0.5 px-1">Seen</span>
                      )}
                    </motion.div>
                  );
                })
              )}
              
              {/* Typing indicator */}
              {isOtherTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mr-auto"
                >
                  <div className="flex gap-1 bg-white border border-slate-100 rounded-full px-3 py-2 shadow-sm">
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full" 
                    />
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full" 
                    />
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full" 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold italic">Doctor is typing...</span>
                </motion.div>
              )}
              
              <div ref={bottomRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/80 backdrop-blur-md border-t border-slate-100">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (msgInput.trim()) {
                    sendMessage(msgInput);
                    setMsgInput("");
                    sendTypingStatus(false);
                  }
                }} 
                className="flex items-center gap-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={handleFileClick}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <Paperclip size={18} />
                </button>
                
                <textarea
                  value={msgInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Message..."
                  className="flex-1 max-h-32 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white resize-none transition-all placeholder:text-slate-400"
                  rows={1}
                />
                
                <button
                  type="submit"
                  disabled={!msgInput.trim()}
                  className="h-[44px] w-[44px] shrink-0 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black disabled:opacity-20 disabled:hover:bg-slate-900 transition-all shadow-lg active:scale-95"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBox;
