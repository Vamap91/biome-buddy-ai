
import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useLanguage } from '@/hooks/useLanguage';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogPostCard from '@/components/blog/BlogPostCard';
import CreatePostForm from '@/components/blog/CreatePostForm';
import PostDetail from '@/components/blog/PostDetail';

const Blog: React.FC = () => {
  const { posts, loading, createPost, toggleLike } = useBlogPosts();
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'detail'>('home');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('allPosts') },
    { id: 'discoveries', label: t('discoveries') },
    { id: 'research', label: t('research') },
    { id: 'conservation', label: t('conservation') },
    { id: 'education', label: t('education') }
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const featuredPosts = posts.filter(post => post.featured);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return posts.length;
    return posts.filter(post => post.category === categoryId).length;
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setCurrentView('detail');
  };

  const handleCreatePost = async (postData: any) => {
    const newPost = await createPost(postData);
    if (newPost) {
      setCurrentView('home');
    }
  };

  const handleUpdatePost = (updatedPost: any) => {
    // Atualizar o post na lista local se necessário
    setSelectedPost(updatedPost);
  };

  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogHeader currentView={currentView} setCurrentView={setCurrentView} />
        <CreatePostForm 
          onSubmit={handleCreatePost}
          onCancel={() => setCurrentView('home')}
        />
      </div>
    );
  }

  if (currentView === 'detail' && selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogHeader currentView={currentView} setCurrentView={setCurrentView} />
        <PostDetail 
          post={selectedPost}
          onBack={() => setCurrentView('home')}
          onUpdatePost={handleUpdatePost}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 hidden sm:block" />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{t('filters')}:</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 ${selectedCategory === category.id ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {category.label} ({getCategoryCount(category.id)})
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {t('searchResults')} "{searchTerm}"
            </h2>
            {filteredPosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">{t('noPostsFound')}</p>
                <p className="text-sm text-gray-400">{t('adjustFilters')}</p>
              </div>
            )}
          </div>
        )}

        {/* Featured Posts */}
        {!searchTerm && featuredPosts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('featuredPosts')}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {featuredPosts.slice(0, 3).map(post => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  featured={true}
                  onClick={() => handlePostClick(post)}
                  onLike={() => toggleLike(post.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchTerm ? `${t('searchResults')} "${searchTerm}"` : (selectedCategory === 'all' ? t('allPosts') : categories.find(c => c.id === selectedCategory)?.label)}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">{t('noPostsFound')}</p>
              <p className="text-gray-400">{t('adjustFilters')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredPosts.map(post => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onClick={() => handlePostClick(post)}
                  onLike={() => toggleLike(post.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Blog;
