
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
      } else {
        console.log('Posts fetched successfully:', data);
        setPosts(data || []);
      }
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

        <PostsFeed posts={posts} loading={loading} />
      </div>
    </div>
  );
};

export default Posts;
