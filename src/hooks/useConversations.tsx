
import { useState, useEffect } from 'react';
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

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  // Create new conversation
  const createConversation = async (title?: string) => {
    if (!user) return null;

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
  };

  // Send message
  const sendMessage = async (content: string, conversationId?: string) => {
    if (!user) return;

    let activeConversationId = conversationId || currentConversation;

    // Create conversation if none exists
    if (!activeConversationId) {
      const newConversation = await createConversation();
      if (!newConversation) return;
      activeConversationId = newConversation.id;
      setCurrentConversation(activeConversationId);
    }

    // Add user message
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

    // Simulate AI response (you can replace this with actual AI integration)
    setTimeout(async () => {
      const aiResponse = `Obrigado pela sua pergunta sobre "${content}". Como Dr_C v2.0, posso ajudá-lo com informações sobre biodiversidade. Esta é uma resposta simulada que será substituída pela integração real com IA.`;

      await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            content: aiResponse,
            role: 'assistant',
          },
        ]);

      // Refresh messages
      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }
    }, 1500);

    // Refresh messages immediately for user message
    if (activeConversationId) {
      await fetchMessages(activeConversationId);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [currentConversation]);

  return {
    conversations,
    messages,
    currentConversation,
    loading,
    setCurrentConversation,
    createConversation,
    sendMessage,
    fetchConversations,
  };
}
