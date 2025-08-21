
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  Send, 
  Trash2,
  User,
  Loader2
} from 'lucide-react';
import { useBlogComments } from '@/hooks/useBlogComments';
import { useAuth } from '@/hooks/useAuth';

interface BlogCommentsProps {
  postId: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const { comments, loading, addComment, deleteComment } = useBlogComments(postId);
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      await deleteComment(commentId);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-green-600" />
        <h3 className="text-xl font-semibold">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário para novo comentário */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                placeholder="Deixe seu comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          </div>
        ) : comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Ainda não há comentários neste post.
              </p>
              {!user && (
                <p className="text-sm text-gray-400 mt-2">
                  Faça login para comentar.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      
                      {user && user.id === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComments;
