import React, { useEffect } from 'react';
import ConversationSidebar from '../../components/messenger/ConversationSidebar';
import ChatPanel from '../../components/messenger/ChatPanel';
import { useChatStore } from '../../store/useChatStore';
const MessengerPage: React.FC = () => {
  const { fetchRecentConversations, activeConversationId, connectChatSocket, disconnectChatSocket } = useChatStore();

  useEffect(() => {
    fetchRecentConversations();
    
    return () => {
      disconnectChatSocket();
    };
  }, [fetchRecentConversations, disconnectChatSocket]);

  useEffect(() => {
    if (activeConversationId) {
      connectChatSocket(activeConversationId);
    }
  }, [activeConversationId, connectChatSocket]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc] overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent pointer-events-none" />
      <div className="flex-1 flex overflow-hidden m-0 sm:m-4 md:m-8 bg-white/40 backdrop-blur-xl rounded-none sm:rounded-[2.5rem] border-0 sm:border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
        <ConversationSidebar />
        <ChatPanel />
      </div>
    </div>
  );
};

export default MessengerPage;
