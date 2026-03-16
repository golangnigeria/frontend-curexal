import React, { useState } from 'react';
import { Search, MessageSquare, Filter, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ConversationSidebar: React.FC = () => {
  const { recentConversations, activeConversationId, setActiveConversation, typingUsers } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = recentConversations.filter(c => 
    c.other_user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-white h-full relative z-10 shadow-lg ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
              <Filter size={18} />
            </button>
            <button className="p-2 bg-slate-900 hover:bg-black rounded-xl text-white transition-all shadow-sm">
              <Plus size={18} />
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search consultations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500/50 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const isTyping = typingUsers.has(conv.other_user_id);
            return (
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full flex items-center gap-4 p-4 transition-all relative group ${
                  activeConversationId === conv.id 
                    ? 'bg-primary-50/50' 
                    : 'hover:bg-slate-50'
                }`}
              >
                {activeConversationId === conv.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full" />
                )}
                
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border-2 transition-transform duration-300 group-hover:scale-105 ${
                    activeConversationId === conv.id 
                      ? 'bg-primary-600 text-white border-primary-100' 
                      : 'bg-white text-slate-700 border-slate-100'
                  }`}>
                    {(conv.other_user_name || "U").charAt(0)}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`text-[15px] truncate tracking-tight transition-colors ${
                      conv.unread_count > 0 || activeConversationId === conv.id 
                        ? 'font-extrabold text-slate-900' 
                        : 'font-bold text-slate-600'
                    }`}>
                      {conv.other_user_name || "Unknown User"}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap ml-2">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate transition-all ${
                      isTyping 
                        ? 'text-primary-600 font-bold italic' 
                        : conv.unread_count > 0 
                          ? 'font-bold text-slate-900' 
                          : 'text-slate-500 font-medium'
                    }`}>
                      {isTyping ? 'Typing...' : conv.last_message || 'Start a conversation'}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="bg-primary-600 text-[10px] text-white font-black h-5 min-w-[20px] px-1.5 rounded-lg flex items-center justify-center ml-2 shrink-0 shadow-sm animate-pulse">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-500">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
