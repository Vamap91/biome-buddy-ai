
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BlogComment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  post_id: string;
  // Dados do usuário via join
  author?: string;
  authorAvatar?: string;
}

export const useBlogComments = (postId: string) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Buscar comentários do post
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Erro ao buscar comentários:', commentsError);
        throw commentsError;
      }

      // Para cada comentário, buscar dados do perfil
      const commentsWithDetails = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', comment.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Erro ao buscar perfil:', profileError);
          }
          
          return {
            ...comment,
            author: profileData?.full_name || profileData?.username || 'Usuário Anônimo',
            authorAvatar: profileData?.avatar_url || '/api/placeholder/32/32',
          };
        })
      );

      setComments(commentsWithDetails);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comentários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('blog_post_comments')
        .insert([{
          content,
          post_id: postId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Comentário adicionado com sucesso.",
      });

      // Recarregar comentários
      await fetchComments();
      return data;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blog_post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Comentário removido com sucesso.",
      });

      // Recarregar comentários
      await fetchComments();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o comentário.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, user]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments
  };
};
