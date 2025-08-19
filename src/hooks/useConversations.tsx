
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch conversations with useCallback to prevent unnecessary re-renders
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
      } else {
        setConversations(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching conversations:', err);
    }
    setLoading(false);
  }, [user]);

  // Fetch messages with useCallback
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        const typedMessages: Message[] = (data || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          created_at: msg.created_at
        }));
        setMessages(typedMessages);
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    }
  }, [user]);

  // Create new conversation with useCallback
  const createConversation = useCallback(async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: user.id,
            title: title || 'Nova Conversa',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      await fetchConversations();
      return data;
    } catch (err) {
      console.error('Unexpected error creating conversation:', err);
      return null;
    }
  }, [user, fetchConversations]);

  // Delete conversation with useCallback
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return false;

    try {
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        return false;
      }

      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        return false;
      }

      await fetchConversations();
      
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err) {
      console.error('Unexpected error deleting conversation:', err);
      return false;
    }
  }, [user, fetchConversations, currentConversation]);

  // Send message with useCallback
  const sendMessage = useCallback(async (content: string, conversationId?: string) => {
    if (!user) return;

    let activeConversationId = conversationId || currentConversation;

    try {
      setIsProcessing(true);

      if (!activeConversationId) {
        const newConversation = await createConversation();
        if (!newConversation) return;
        activeConversationId = newConversation.id;
        setCurrentConversation(activeConversationId);
      }

      const { error: userMessageError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            content,
            role: 'user',
          },
        ]);

      if (userMessageError) {
        console.error('Error sending message:', userMessageError);
        return;
      }

      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }

      const { data: aiData, error: aiError } = await supabase.functions.invoke('chat-ai', {
        body: { message: content }
      });

      let aiResponse = '';
      
      if (aiError) {
        console.error('Error calling AI function:', aiError);
        aiResponse = 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
      } else if (aiData?.response) {
        aiResponse = aiData.response;
      } else {
        console.error('No response from AI function:', aiData);
        aiResponse = 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente.';
      }

      await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            content: aiResponse,
            role: 'assistant',
          },
        ]);

      const currentConv = conversations.find(c => c.id === activeConversationId);
      if (currentConv?.title === 'Nova Conversa') {
        const titlePrompt = content.length > 50 ? content.substring(0, 50) + '...' : content;
        await supabase
          .from('conversations')
          .update({ title: titlePrompt })
          .eq('id', activeConversationId);
        
        await fetchConversations();
      }

      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }

    } catch (err) {
      console.error('Unexpected error sending message:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentConversation, createConversation, fetchMessages, conversations, fetchConversations]);

  // Only fetch conversations when user changes and is available
  useEffect(() => {
    if (user && !loading) {
      fetchConversations();
    }
  }, [user, fetchConversations, loading]);

  // Only fetch messages when currentConversation changes and is not null
  useEffect(() => {
    if (currentConversation && user) {
      fetchMessages(currentConversation);
    } else if (!currentConversation) {
      setMessages([]);
    }
  }, [currentConversation, fetchMessages, user]);

  // Memoize the return value to prevent unnecessary re-renders
  const memoizedValue = useMemo(() => ({
    conversations,
    messages,
    currentConversation,
    loading,
    isProcessing,
    setCurrentConversation,
    createConversation,
    sendMessage,
    fetchConversations,
    deleteConversation,
  }), [
    conversations,
    messages,
    currentConversation,
    loading,
    isProcessing,
    createConversation,
    sendMessage,
    fetchConversations,
    deleteConversation,
  ]);

  return memoizedValue;
}
