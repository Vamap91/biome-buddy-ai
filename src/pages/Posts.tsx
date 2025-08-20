
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import CreatePostForm from '@/components/posts/CreatePostForm';
import PostsFeed from '@/components/posts/PostsFeed';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  video_url: string | null;
  image_url?: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  likes_count: number;
  user_has_liked: boolean;
  comments_count: number;
}

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          video_url,
          image_url,
          created_at,
          user_id,
          profiles!fk_posts_profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      // Fetch likes and comments count for each post
      const postsWithStats = await Promise.all(
        (data || []).map(async (post) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          // Check if current user liked this post
          let userHasLiked = false;
          if (user) {
            const { data: userLike } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            userHasLiked = !!userLike;
          }

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('post_comments')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          return {
            ...post,
            likes_count: likesCount || 0,
            user_has_liked: userHasLiked,
            comments_count: commentsCount || 0,
          };
        })
      );

      console.log('Posts fetched successfully:', postsWithStats.length);
      setPosts(postsWithStats);
    } catch (err) {
      console.error('Unexpected error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    setShowCreateForm(false);
    fetchPosts();
  };

  const handleLikeUpdate = () => {
    fetchPosts(); // Refresh posts to update like counts
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Faça login para ver os posts</h2>
          <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Post
          </Button>
        </div>

        {showCreateForm && (
          <CreatePostForm
            onPostCreated={handlePostCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        <PostsFeed posts={posts} loading={loading} onLikeUpdate={handleLikeUpdate} />
      </div>
    </div>
  );
};

export default Posts;
