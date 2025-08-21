
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Dados do usuário via join com profiles
  author?: string;
  authorRole?: string;
  authorAvatar?: string;
  // Contadores via join
  likes?: number;
  comments?: number;
  isLiked?: boolean;
}

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Buscar posts com contadores de likes e comentários
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Para cada post, buscar contadores de likes e comentários
      const postsWithCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          // Contar likes
          const { count: likesCount } = await supabase
            .from('blog_post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Contar comentários
          const { count: commentsCount } = await supabase
            .from('blog_post_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Verificar se o usuário atual curtiu
          let isLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('blog_post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            isLiked = !!likeData;
          }

          return {
            ...post,
            author: post.profiles?.full_name || post.profiles?.username || 'Usuário Anônimo',
            authorRole: 'Colaborador',
            authorAvatar: post.profiles?.avatar_url || '/api/placeholder/40/40',
            likes: likesCount || 0,
            comments: commentsCount || 0,
            isLiked
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts do blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Post criado com sucesso.",
      });

      // Recarregar posts
      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o post.",
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Verificar se já curtiu
      const { data: existingLike } = await supabase
        .from('blog_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remover like
        await supabase
          .from('blog_post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Adicionar like
        await supabase
          .from('blog_post_likes')
          .insert([{
            post_id: postId,
            user_id: user.id
          }]);
      }

      // Atualizar views
      await supabase
        .from('blog_posts')
        .update({ views: supabase.rpc('increment_views', { post_id: postId }) })
        .eq('id', postId);

      // Recarregar posts
      await fetchPosts();
    } catch (error) {
      console.error('Erro ao curtir/descurtir:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    refetch: fetchPosts
  };
};
