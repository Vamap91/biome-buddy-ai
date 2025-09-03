
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock,
  Tag,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  User,
  Image,
  Trash2
} from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogPosts';

interface BlogPostCardProps {
  post: BlogPost;
  onViewPost: (post: BlogPost) => void;
  onToggleLike: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  variant?: 'featured' | 'normal';
  canDelete?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ 
  post, 
  onViewPost, 
  onToggleLike, 
  onDeletePost,
  variant = 'normal',
  canDelete = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="h-48 relative overflow-hidden">
          {post.image_url ? (
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <Image className="h-12 w-12 text-white/80" />
            </div>
          )}
          <Badge className="absolute top-4 left-4 bg-white text-green-700">
            Destaque
          </Badge>
        </div>
        <CardContent className="p-6">
          <Badge variant="outline" className="mb-3 capitalize">
            {post.category}
          </Badge>
          <h3 
            className="text-xl font-bold mb-3 hover:text-green-600 cursor-pointer"
            onClick={() => onViewPost(post)}
          >
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{post.author}</p>
                <p className="text-gray-500">{formatDate(post.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {calculateReadTime(post.content)} min
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-32 h-24 rounded-lg flex-shrink-0 overflow-hidden">
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <Image className="h-8 w-8 text-white/80" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <Badge variant="outline" className="mb-2 capitalize">
                  {post.category}
                </Badge>
                <h3 
                  className="text-xl font-bold hover:text-green-600 cursor-pointer line-clamp-2 break-words"
                  onClick={() => onViewPost(post)}
                >
                  {post.title}
                </h3>
              </div>
              {post.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 ml-2 flex-shrink-0">
                  Destaque
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3 break-words">{post.excerpt}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.authorAvatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{post.author}</p>
                  <p className="text-gray-500">{post.authorRole}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.created_at)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {calculateReadTime(post.content)} min
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.views}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleLike(post.id)}
                  className={post.isLiked ? "text-red-500 hover:text-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </Button>
                <span className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </span>
                {canDelete && onDeletePost && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePost(post.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
