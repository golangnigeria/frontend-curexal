import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, MoreHorizontal } from 'lucide-react';
import { useChatStore, type Conversation } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const formatTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

const MessengerDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { recentConversations, fetchRecentConversations, setActiveConversation } = useChatStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      fetchRecentConversations();
    }
  }, [isOpen, fetchRecentConversations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onConversationClick = (conv: Conversation) => {
    if (token) {
      setActiveConversation(conv);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        aria-label="Messenger"
      >
        <MessageSquare className="w-6 h-6" />
        {recentConversations.some(c => c.unread_count > 0) && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Chats</h3>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Messenger"
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {recentConversations.length > 0 ? (
              recentConversations.map((conv) => (
                <button
                  key={conv.other_user_id}
                  onClick={() => onConversationClick(conv)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold group-hover:scale-105 transition-transform">
                      {conv.other_user_name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {conv.other_user_name}
                      </p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                        {formatTime(new Date(conv.last_message_at))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${conv.unread_count > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                        {conv.last_message}
                      </p>
                      {conv.unread_count > 0 && (
                        <div className="bg-blue-600 text-[9px] text-white font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                          {conv.unread_count > 99 ? '99+' : conv.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 font-medium">No messages yet</p>
                <p className="text-xs text-slate-400 mt-1">Start a conversation with a specialist</p>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-slate-100 text-center">
            <Link 
              to="/dashboard/messenger"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-blue-600 hover:bg-blue-50 w-full py-2 rounded-lg transition-colors"
            >
              See all in Messenger
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessengerDropdown;
