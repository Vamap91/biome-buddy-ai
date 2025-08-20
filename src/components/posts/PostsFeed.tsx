
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  likes_count?: number;
  user_has_liked?: boolean;
}

interface PostsFeedProps {
  posts: Post[];
  loading: boolean;
}

const PostsFeed: React.FC<PostsFeedProps> = ({ posts, loading }) => {
  const { user } = useAuth();
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  const handleLike = async (postId: string) => {
    if (!user || likingPosts.has(postId)) return;

    setLikingPosts(prev => new Set(prev).add(postId));

    try {
      // For now, we'll just show a toast. The actual like functionality would require
      // additional database tables for likes that we haven't created yet.
      toast.success('Like adicionado!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Erro ao curtir post');
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
        <p className="text-muted-foreground">
          Seja o primeiro a criar um post!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={post.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {post.profiles.full_name?.charAt(0) || 
                   post.profiles.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">
                  {post.profiles.full_name || post.profiles.username}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {post.content && (
              <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
            )}

            {post.video_url && (
              <video
                src={post.video_url}
                controls
                className="w-full rounded-lg mb-4"
                style={{ maxHeight: '400px' }}
              />
            )}

            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post content"
                className="w-full rounded-lg mb-4 object-cover"
                style={{ maxHeight: '400px' }}
              />
            )}

            <div className="flex items-center gap-4 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                disabled={likingPosts.has(post.id)}
                className="text-muted-foreground hover:text-red-500"
              >
                <Heart className="h-4 w-4 mr-1" />
                Curtir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-blue-500"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Comentar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostsFeed;
