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
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch conversations
  const fetchConversations = async () => {
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
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
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
        // Type cast the data to ensure role is properly typed
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
  };

  // Create new conversation
  const createConversation = async (title?: string) => {
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
  };

  // Send message with OpenAI integration
  const sendMessage = async (content: string, conversationId?: string) => {
    if (!user) return;

    let activeConversationId = conversationId || currentConversation;

    try {
      setIsProcessing(true);

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

      // Refresh messages immediately for user message
      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }

      // Call OpenAI API through edge function
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

      // Add AI response to database
      await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            content: aiResponse,
            role: 'assistant',
          },
        ]);

      // Update conversation title if it's a new conversation
      if (conversations.find(c => c.id === activeConversationId)?.title === 'Nova Conversa') {
        const titlePrompt = content.length > 50 ? content.substring(0, 50) + '...' : content;
        await supabase
          .from('conversations')
          .update({ title: titlePrompt })
          .eq('id', activeConversationId);
        
        await fetchConversations();
      }

      // Refresh messages with AI response
      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }

    } catch (err) {
      console.error('Unexpected error sending message:', err);
    } finally {
      setIsProcessing(false);
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
    isProcessing,
    setCurrentConversation,
    createConversation,
    sendMessage,
    fetchConversations,
  };
}
