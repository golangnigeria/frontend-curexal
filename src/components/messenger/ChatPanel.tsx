import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MessageSquare, Paperclip, MoreVertical, CheckCheck, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';
import type { ChatMessage, Conversation } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const ChatPanel: React.FC = () => {
  const { 
    chatMessages,
    sendMessage,
    activeConversationId, 
    recentConversations, 
    loadMoreMessages, 
    hasMoreMessages,
    fetchChatHistory,
    typingUsers,
    sendTypingStatus,
    sendReadReceipt,
    readReceipts,
    uploadChatAttachment
  } = useChatStore();
  const { user, token } = useAuthStore();
  const [msgInput, setMsgInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = recentConversations.find((c: Conversation) => c.id === activeConversationId);

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

  useEffect(() => {
    if (activeConversationId && token) {
      fetchChatHistory(activeConversationId, true);
      // Send read receipt when opening conversation
      sendReadReceipt();
    }
  }, [activeConversationId, token, fetchChatHistory, sendReadReceipt]);

  useEffect(() => {
    if (!isScrollingUp) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isScrollingUp, typingUsers]); // Scroll when typing starts too

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    // Stop typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTypingStatus(false);

    sendMessage(msgInput);
    setMsgInput('');
    setIsScrollingUp(false);
    
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMoreMessages) {
      setIsScrollingUp(true);
      loadMoreMessages();
    } else if (scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 20) {
      setIsScrollingUp(false);
    }
  };

  if (!activeConversationId) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 p-8 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 rotate-3 border border-slate-100"
        >
          <MessageSquare className="w-12 h-12 text-primary-200" />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Your Inbox</h2>
        <p className="text-center max-w-xs text-slate-500 font-medium">
          Select a consultation from the list to view medical history and chat in real-time.
        </p>
      </div>
    );
  }

  const otherUserId = activeConv?.other_user_id;
  const isOtherTyping = Array.from(typingUsers).some(id => id !== user?.id);

  return (
    <div className={`flex-1 w-full bg-white h-full shadow-2xl relative z-0 ${!activeConversationId ? 'hidden md:flex flex-col' : 'flex flex-col'}`}>
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => useChatStore.setState({ activeConversationId: null, isChatOpen: false })}
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-slate-100">
              {activeConv?.other_user_name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 leading-none text-lg tracking-tight">{activeConv?.other_user_name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[9px] font-black uppercase tracking-widest border border-primary-100">
                {activeConv?.other_user_role}
              </span>
              <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <button className="p-2.5 text-slate-600 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
              <Phone size={20} />
            </button>
            <button className="p-2.5 text-slate-600 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
              <Video size={20} />
            </button>
          </div>
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 backdrop-blur-sm custom-scrollbar"
      >
        <div className="flex justify-center pb-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white shadow-sm border border-slate-100 px-3 py-1.5 rounded-full">
            Secure Healthcare Channel
          </span>
        </div>

        {chatMessages.map((msg: ChatMessage, i: number) => {
          const isMe = msg.sender_id === user?.id;
          const showReadReceipt = isMe && i === chatMessages.length - 1 && readReceipts[otherUserId || ''];
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id || i}
              className={`flex flex-col gap-1.5 ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'} max-w-[75%]`}
            >
              <div
                className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${
                  isMe
                    ? 'bg-slate-900 text-white rounded-tr-none hover:bg-black'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none hover:border-primary-200'
                }`}
              >
                {msg.message_type === 'image' ? (
                  <div className="space-y-2">
                    <img 
                      src={msg.message} 
                      alt="Attachment" 
                      className="max-w-full rounded-lg shadow-sm cursor-pointer hover:opacity-95 transition-opacity" 
                      onClick={() => window.open(msg.message, '_blank')}
                    />
                  </div>
                ) : msg.message_type === 'file' ? (
                  <a 
                    href={msg.message} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 underline decoration-current/30 hover:decoration-current transition-all"
                  >
                    <Paperclip size={16} />
                    <span>View Attachment</span>
                  </a>
                ) : (
                  msg.message
                )}
              </div>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && (
                   <div className="flex items-center gap-1">
                      <CheckCheck 
                        size={14} 
                        className={
                          msg.status === 'read' || showReadReceipt 
                            ? "text-primary-500" 
                            : msg.status === 'delivered'
                              ? "text-slate-400"
                              : "text-slate-300"
                        } 
                      />
                      {(msg.status === 'read' || showReadReceipt) && (
                        <span className="text-[9px] text-primary-500 font-black uppercase tracking-tighter">Seen</span>
                      )}
                   </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isOtherTyping && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 mr-auto py-2"
            >
              <div className="flex gap-1.5 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-md">
                <motion.div 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-primary-400 rounded-full" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-primary-400 rounded-full" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-primary-400 rounded-full" 
                />
              </div>
              <span className="text-xs text-slate-400 font-extrabold italic tracking-tight uppercase">Medical Professional is typing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSend} className="flex gap-4 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button
            type="button"
            onClick={handleFileClick}
            className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all border border-transparent hover:border-primary-100"
          >
            <Paperclip size={22} />
          </button>
          
          <div className="flex-1 relative flex items-center">
            <textarea
              value={msgInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your medical query or message..."
              className="w-full min-h-[52px] max-h-40 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500/30 resize-none transition-all placeholder:text-slate-400 font-medium leading-relaxed"
              rows={1}
            />
          </div>

          <button
            type="submit"
            disabled={!msgInput.trim()}
            className="h-12 w-12 shrink-0 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black disabled:opacity-20 disabled:hover:bg-slate-900 transition-all shadow-xl active:scale-95 group"
          >
            <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
