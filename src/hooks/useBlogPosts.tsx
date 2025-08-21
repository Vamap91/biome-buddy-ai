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
      
      // Buscar posts primeiro
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Erro ao buscar posts:', postsError);
        throw postsError;
      }

      // Para cada post, buscar dados do perfil e contadores
      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          // Buscar dados do perfil do usuário
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', post.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Erro ao buscar perfil:', profileError);
          }

          // Contar likes
          const { count: likesCount, error: likesError } = await supabase
            .from('blog_post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          if (likesError) console.error('Erro ao contar likes:', likesError);

          // Contar comentários
          const { count: commentsCount, error: commentsError } = await supabase
            .from('blog_post_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          if (commentsError) console.error('Erro ao contar comentários:', commentsError);

          // Verificar se o usuário atual curtiu
          let isLiked = false;
          if (user) {
            const { data: likeData, error: likeError } = await supabase
              .from('blog_post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (likeError) console.error('Erro ao verificar like:', likeError);
            isLiked = !!likeData;
          }
          
          return {
            ...post,
            author: profileData?.full_name || profileData?.username || 'Usuário Anônimo',
            authorRole: 'Colaborador',
            authorAvatar: profileData?.avatar_url || '/api/placeholder/40/40',
            likes: likesCount || 0,
            comments: commentsCount || 0,
            isLiked
          };
        })
      );

      setPosts(postsWithDetails);
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
        .maybeSingle();

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

      // Incrementar views do post (simples update)
      const { data: currentPost } = await supabase
        .from('blog_posts')
        .select('views')
        .eq('id', postId)
        .single();

      if (currentPost) {
        await supabase
          .from('blog_posts')
          .update({ views: (currentPost.views || 0) + 1 })
          .eq('id', postId);
      }

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
