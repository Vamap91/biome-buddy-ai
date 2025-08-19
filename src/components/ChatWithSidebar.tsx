
import React from 'react';
import ChatInterface from './ChatInterface';
import ConversationSidebar from './ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

const ChatWithSidebar = () => {
  // Verificar se o AuthProvider está disponível
  const { user, loading: authLoading } = useAuth();
  
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

  // Mostrar loading enquanto autentica
  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário autenticado, não renderizar
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-600">Você precisa estar logado para acessar o chat.</p>
      </div>
    );
  }

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

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    await sendMessage(content, currentConversation || undefined, attachments);
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
