
import React from 'react';
import ChatInterface from './ChatInterface';
import ConversationSidebar from './ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

const ChatWithSidebar = () => {
  const {
    conversations,
    messages,
    currentConversation,
    loading,
    isProcessing,
    setCurrentConversation,
    createConversation,
    sendMessage,
    deleteConversation,
  } = useConversations();

  // Converter mensagens para o formato do ChatInterface
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.role === 'user' ? 'user' as const : 'dr_c' as const,
    timestamp: new Date(msg.created_at)
  }));

  const handleNewConversation = async () => {
    const newConv = await createConversation('Nova Conversa');
    if (newConv) {
      setCurrentConversation(newConv.id);
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, currentConversation || undefined);
  };

  return (
    <div className="flex h-full">
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={setCurrentConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        loading={loading}
      />
      <div className="flex-1">
        <ChatInterface
          messages={formattedMessages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          className="h-full rounded-none"
        />
      </div>
    </div>
  );
};

export default ChatWithSidebar;
