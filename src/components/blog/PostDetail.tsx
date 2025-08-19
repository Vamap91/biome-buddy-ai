
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Tag 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
}

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onUpdatePost: (updatedPost: BlogPost) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onUpdatePost }) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = useCallback(() => {
    const newLikesCount = isLiked ? post.likes - 1 : post.likes + 1;
    const updatedPost = { ...post, likes: newLikesCount };
    
    setIsLiked(!isLiked);
    onUpdatePost(updatedPost);
    
    toast({
      title: isLiked ? "Like removido" : "Post curtido!",
      description: isLiked ? "Você removeu sua curtida do post." : "Obrigado por curtir este post.",
      duration: 2000,
    });
  }, [isLiked, post, onUpdatePost, toast]);

  const handleComment = useCallback(() => {
    toast({
      title: "Comentários em breve",
      description: "A funcionalidade de comentários será implementada em breve!",
      duration: 3000,
    });
  }, [toast]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do post foi copiado para a área de transferência.",
        duration: 2000,
      });
    }
  }, [post.title, post.excerpt, toast]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            ← Voltar ao Blog
          </Button>
          
          <Badge variant="outline" className="mb-4 capitalize">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-gray-600 text-sm">{post.authorRole}</p>
                <p className="text-gray-500 text-sm">{post.publishDate}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.views}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>
        
        <div className="h-64 bg-gradient-to-r from-green-400 to-green-600 rounded-lg mb-8"></div>
        
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm"
                onClick={handleLike}
                className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {post.likes} Curtidas
              </Button>
              <Button variant="outline" size="sm" onClick={handleComment}>
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.comments} Comentários
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostDetail;
