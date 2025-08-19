
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DashboardStats {
  conversationsToday: number;
  totalMessages: number;
  tokensUsed: string;
  totalConversations: number;
  loading: boolean;
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    conversationsToday: 0,
    totalMessages: 0,
    tokensUsed: '0',
    totalConversations: 0,
    loading: true,
  });

  const fetchStats = async () => {
    if (!user) return;

    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Data de hoje (início do dia)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Buscar conversas de hoje
      const { data: conversationsToday, error: conversationsTodayError } = await supabase
        .from('conversations')
        .select('id')
        .gte('created_at', todayISO);

      if (conversationsTodayError) {
        console.error('Error fetching conversations today:', conversationsTodayError);
      }

      // Buscar total de conversas
      const { data: totalConversations, error: totalConversationsError } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true });

      if (totalConversationsError) {
        console.error('Error fetching total conversations:', totalConversationsError);
      }

      // Buscar total de mensagens do usuário
      const { data: userMessages, error: userMessagesError } = await supabase
        .from('messages')
        .select('id, content')
        .eq('role', 'user');

      if (userMessagesError) {
        console.error('Error fetching user messages:', userMessagesError);
      }

      // Buscar total de mensagens da IA
      const { data: aiMessages, error: aiMessagesError } = await supabase
        .from('messages')
        .select('id, content')
        .eq('role', 'assistant');

      if (aiMessagesError) {
        console.error('Error fetching AI messages:', aiMessagesError);
      }

      // Calcular tokens aproximados (estimativa baseada no número de caracteres)
      const totalUserChars = (userMessages || []).reduce((acc, msg) => acc + msg.content.length, 0);
      const totalAiChars = (aiMessages || []).reduce((acc, msg) => acc + msg.content.length, 0);
      const totalChars = totalUserChars + totalAiChars;
      
      // Estimativa: aproximadamente 4 caracteres por token
      const estimatedTokens = Math.round(totalChars / 4);
      const tokensFormatted = estimatedTokens > 1000 
        ? `${(estimatedTokens / 1000).toFixed(1)}K`
        : estimatedTokens.toString();

      const totalMessages = (userMessages?.length || 0) + (aiMessages?.length || 0);

      setStats({
        conversationsToday: conversationsToday?.length || 0,
        totalMessages,
        tokensUsed: tokensFormatted,
        totalConversations: totalConversations?.length || 0,
        loading: false,
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  return { stats, refreshStats: fetchStats };
}
