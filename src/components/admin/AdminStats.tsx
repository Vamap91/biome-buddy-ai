import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  total_users: number;
  total_posts: number;
  total_conversations: number;
  total_messages: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_posts: 0,
    total_conversations: 0,
    total_messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar estatísticas em paralelo
        const [usersResult, postsResult, conversationsResult, messagesResult] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('conversations').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          total_users: usersResult.count || 0,
          total_posts: postsResult.count || 0,
          total_conversations: conversationsResult.count || 0,
          total_messages: messagesResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats.total_users,
      icon: Users,
      description: "Usuários registrados",
      color: "text-blue-600"
    },
    {
      title: "Posts do Blog",
      value: stats.total_posts,
      icon: FileText,
      description: "Conteúdos publicados",
      color: "text-green-600"
    },
    {
      title: "Conversas IA",
      value: stats.total_conversations,
      icon: MessageSquare,
      description: "Sessões de chat",
      color: "text-purple-600"
    },
    {
      title: "Mensagens Totais",
      value: stats.total_messages,
      icon: TrendingUp,
      description: "Interações registradas",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;