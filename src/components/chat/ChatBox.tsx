import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBox = () => {
  const { isChatOpen, setChatOpen, chatMessages, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const [msgInput, setMsgInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    sendMessage(msgInput);
    setMsgInput("");
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
              Dr.
            </div>
            <div>
              <h4 className="font-bold text-sm leading-none">Consultation</h4>
              <p className="text-[10px] text-green-400 font-medium mt-1">
                ● Online
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">👋</span>
                  </div>
                  <h5 className="font-bold text-slate-800 mb-1">
                    Doctor is ready
                  </h5>
                  <p className="text-sm text-slate-500">
                    Send a message to begin your consultation.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col max-w-[85%] ${
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
                          isMe
                            ? "bg-primary-600 text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 px-1">
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Now"}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-slate-100 flex items-end gap-2"
            >
              <textarea
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 max-h-32 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all"
                rows={1}
              />
              <button
                type="submit"
                disabled={!msgInput.trim()}
                className="h-[44px] w-[44px] shrink-0 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors shadow-sm"
              >
                <Send size={18} className="translate-x-0.5" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBox;
