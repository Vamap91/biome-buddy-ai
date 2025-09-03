import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  views: number;
  profiles: {
    username: string;
  };
}

interface ContentStats {
  total_posts: number;
  total_conversations: number;
  posts_today: number;
  conversations_today: number;
}

const ContentManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<ContentStats>({
    total_posts: 0,
    total_conversations: 0,
    posts_today: 0,
    conversations_today: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Buscar posts mais recentes
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            excerpt,
            category,
            created_at,
            views,
            user_id
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (postsError) throw postsError;

        // Buscar profiles dos autores
        const enrichedPosts = [];
        for (const post of postsData || []) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', post.user_id)
            .single();
          
          enrichedPosts.push({
            ...post,
            profiles: { username: profile?.username || 'Unknown' }
          });
        }

        setPosts(enrichedPosts);

        // Buscar estatísticas
        const today = new Date().toISOString().split('T')[0];
        
        const [totalPostsResult, totalConversationsResult, postsToday, conversationsToday] = await Promise.all([
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('conversations').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }).gte('created_at', today),
          supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', today)
        ]);

        setStats({
          total_posts: totalPostsResult.count || 0,
          total_conversations: totalConversationsResult.count || 0,
          posts_today: postsToday.count || 0,
          conversations_today: conversationsToday.count || 0
        });

      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'tecnologia': 'bg-blue-100 text-blue-800',
      'educacao': 'bg-green-100 text-green-800',
      'saude': 'bg-red-100 text-red-800',
      'meio-ambiente': 'bg-emerald-100 text-emerald-800',
      'ciencia': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando conteúdo...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas de conteúdo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_posts}</div>
            <p className="text-xs text-muted-foreground">
              Conteúdos publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas IA</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_conversations}</div>
            <p className="text-xs text-muted-foreground">
              Sessões de chat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.posts_today}</div>
            <p className="text-xs text-muted-foreground">
              Publicados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.conversations_today}</div>
            <p className="text-xs text-muted-foreground">
              Iniciadas hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posts recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Mais Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{post.title}</h3>
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      @{post.profiles.username}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {post.views} visualizações
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum post encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;