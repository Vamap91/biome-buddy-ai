
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RecentActivity {
  id: string;
  title: string;
  created_at: string;
}

interface DashboardStats {
  conversationsToday: number;
  totalMessages: number;
  estimatedTokens: number;
  totalConversations: number;
  recentActivity: RecentActivity[];
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    conversationsToday: 0,
    totalMessages: 0,
    estimatedTokens: 0,
    totalConversations: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

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

      // Buscar atividade recente
      const { data: recentConversations, error: recentError } = await supabase
        .from('conversations')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        console.error('Error fetching recent activity:', recentError);
      }

      // Calcular tokens aproximados (estimativa baseada no número de caracteres)
      const totalUserChars = (userMessages || []).reduce((acc, msg) => acc + msg.content.length, 0);
      const totalAiChars = (aiMessages || []).reduce((acc, msg) => acc + msg.content.length, 0);
      const totalChars = totalUserChars + totalAiChars;
      
      // Estimativa: aproximadamente 4 caracteres por token
      const estimatedTokens = Math.round(totalChars / 4);

      const totalMessages = (userMessages?.length || 0) + (aiMessages?.length || 0);

      const recentActivity: RecentActivity[] = (recentConversations || []).map(conv => ({
        id: conv.id,
        title: conv.title || 'Conversa sem título',
        created_at: conv.created_at
      }));

      console.log('Dashboard stats loaded:', { 
        conversationsToday: conversationsToday?.length || 0,
        totalMessages,
        totalConversations: totalConversations?.length || 0 
      });

      setStats({
        conversationsToday: conversationsToday?.length || 0,
        totalMessages,
        estimatedTokens,
        totalConversations: totalConversations?.length || 0,
        recentActivity,
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user]);

  // Only fetch stats when user is available and not already initialized
  useEffect(() => {
    if (user && !initialized) {
      console.log('Initializing dashboard stats for user:', user.id);
      fetchStats();
    }
  }, [user, initialized, fetchStats]);

  return { stats, loading, refreshStats: fetchStats };
}
