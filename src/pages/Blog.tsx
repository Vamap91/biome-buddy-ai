
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  BookOpen,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import BlogHeader from '@/components/blog/BlogHeader';
import CreatePostForm from '@/components/blog/CreatePostForm';
import PostDetail from '@/components/blog/PostDetail';
import BlogPostCard from '@/components/blog/BlogPostCard';
import ProtectedBlogRoute from '@/components/ProtectedBlogRoute';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';

const BlogSystem = () => {
  const { posts, loading, createPost, toggleLike } = useBlogPosts();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', count: posts.length },
    { id: 'descobertas', name: 'Descobertas', count: posts.filter(p => p.category === 'descobertas').length },
    { id: 'pesquisa', name: 'Pesquisa', count: posts.filter(p => p.category === 'pesquisa').length },
    { id: 'conservacao', name: 'Conservação', count: posts.filter(p => p.category === 'conservacao').length },
    { id: 'educacao', name: 'Educação', count: posts.filter(p => p.category === 'educacao').length }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(post => post.featured);

  const handleCreatePost = useCallback(async (newPostData: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    const result = await createPost(newPostData);
    if (result) {
      setCurrentView('home');
    }
  }, [createPost]);

  const handleUpdatePost = useCallback((updatedPost: BlogPost) => {
    // Atualizar o post localmente para feedback imediato
    // A atualização real seria feita via API
    console.log('Post atualizado:', updatedPost);
  }, []);

  const handleViewPost = useCallback((post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('post');
  }, []);

  const handleToggleLike = useCallback(async (postId: string) => {
    await toggleLike(postId);
  }, [toggleLike]);

  const BlogHome = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar posts, tags ou autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          {featuredPosts.length > 0 && selectedCategory === 'all' && !searchTerm && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                Posts em Destaque
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map(post => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    onViewPost={handleViewPost}
                    onToggleLike={handleToggleLike}
                    variant="featured"
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Posts'}
            </h2>
            
            {filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {posts.length === 0 ? 'Nenhum post ainda' : 'Nenhum post encontrado'}
                </h3>
                <p className="text-gray-500">
                  {posts.length === 0 
                    ? 'Seja o primeiro a compartilhar conhecimento!' 
                    : 'Tente ajustar os filtros ou termos de busca.'
                  }
                </p>
                {posts.length === 0 && (
                  <Button 
                    onClick={() => setCurrentView('create')}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Criar Primeiro Post
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    onViewPost={handleViewPost}
                    onToggleLike={handleToggleLike}
                    variant="normal"
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );

  return (
    <ProtectedBlogRoute>
      <div className="min-h-screen bg-gray-50">
        <BlogHeader currentView={currentView} setCurrentView={setCurrentView} />
        
        {currentView === 'home' && <BlogHome />}
        {currentView === 'create' && (
          <CreatePostForm 
            onCreatePost={handleCreatePost}
            onCancel={() => setCurrentView('home')}
          />
        )}
        {currentView === 'post' && selectedPost && (
          <PostDetail 
            post={selectedPost}
            onBack={() => setCurrentView('home')}
            onUpdatePost={handleUpdatePost}
          />
        )}
      </div>
    </ProtectedBlogRoute>
  );
};

export default BlogSystem;
