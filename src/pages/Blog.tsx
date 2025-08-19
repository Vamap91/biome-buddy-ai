import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter,
  Clock,
  Tag,
  BookOpen,
  TrendingUp,
  Calendar,
  Eye,
  Heart,
} from 'lucide-react';
import BlogHeader from '@/components/blog/BlogHeader';
import CreatePostForm from '@/components/blog/CreatePostForm';
import PostDetail from '@/components/blog/PostDetail';

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

const BlogSystem = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Descoberta de Nova Espécie de Bromélia na Mata Atlântica",
      excerpt: "Pesquisadores da USP identificaram uma nova espécie de bromélia endêmica da Serra do Mar, evidenciando a riqueza ainda inexplorada da Mata Atlântica.",
      content: `Uma equipe de pesquisadores da Universidade de São Paulo (USP) anunciou a descoberta de uma nova espécie de bromélia na região da Serra do Mar, no litoral de São Paulo. A Vriesea atlantica, como foi batizada, representa mais um exemplo da biodiversidade ainda inexplorada da Mata Atlântica brasileira.

A descoberta aconteceu durante uma expedição de campo realizada em março de 2024, em uma área de floresta ombrófila densa. A nova espécie se distingue por suas folhas com padrões únicos e inflorescência de coloração vermelho-intensa, características que a diferem das demais bromeliáceas conhecidas na região.

"Esta descoberta reforça a importância da conservação da Mata Atlântica e demonstra que ainda há muito a ser explorado em termos de biodiversidade", explica a Dra. Maria Santos, líder da pesquisa.

A V. atlantica habita exclusivamente áreas de altitude entre 800 e 1200 metros, crescendo como epífita em troncos de árvores centenárias. Sua distribuição restrita e o habitat específico a tornam particularmente vulnerável às mudanças climáticas e ao desmatamento.`,
      author: "Dra. Maria Santos",
      authorRole: "Pesquisadora USP - Botânica",
      authorAvatar: "/api/placeholder/40/40",
      publishDate: "2024-08-15",
      category: "descobertas",
      tags: ["mata-atlântica", "bromélia", "nova-espécie", "conservação"],
      readTime: "4 min",
      views: 1284,
      likes: 89,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: "O Papel dos Polinizadores na Conservação dos Cerrados",
      excerpt: "Estudo revela como abelhas nativas são fundamentais para manter a diversidade de plantas do Cerrado brasileiro.",
      content: `O Cerrado brasileiro, reconhecido como a savana mais biodiversa do mundo, depende critically de uma complexa rede de polinizadores para manter sua extraordinária diversidade de plantas. Um estudo recente, conduzido pela Universidade de Brasília em parceria com o ICMBio, revelou dados surpreendentes sobre esta relação.

Durante dois anos, os pesquisadores monitoraram 45 espécies de plantas nativas em cinco áreas protegidas do Cerrado. Os resultados mostraram que mais de 80% das espécies estudadas dependem exclusivamente de polinizadores nativos, especialmente abelhas solitárias e sem ferrão.

"As abelhas nativas do Cerrado evoluíram junto com as plantas da região por milhões de anos, criando relações únicas de interdependência", explica o Prof. Carlos Silva, coordenador do estudo.

Entre as descobertas mais importantes está o papel da abelha-cachorro (Trigona spinipes) na polinização do pequi (Caryocar brasiliense), uma das árvores mais icônicas do Cerrado. A pesquisa mostrou que áreas com maior diversidade de abelhas nativas apresentam também maior produção de frutos e sementes.`,
      author: "Prof. Carlos Silva",
      authorRole: "UFRJ - Ecologia",
      authorAvatar: "/api/placeholder/40/40",
      publishDate: "2024-08-12",
      category: "pesquisa",
      tags: ["cerrado", "polinizadores", "abelhas", "biodiversidade"],
      readTime: "6 min",
      views: 967,
      likes: 156,
      comments: 34,
      featured: false
    },
    {
      id: 3,
      title: "Projeto de Reflorestamento Restaura 500 Hectares na Amazônia",
      excerpt: "Iniciativa colaborativa entre ONGs e comunidades locais recupera área degradada usando técnicas de plantio inovadoras.",
      content: `Uma parceria entre a ONG Verde Amazônia, comunidades ribeirinhas e institutos de pesquisa conseguiu restaurar 500 hectares de floresta amazônica degradada no estado do Pará. O projeto, iniciado em 2022, utiliza técnicas inovadoras de plantio que aceleram o processo de regeneração natural.

A metodologia combina o plantio de espécies nativas pioneiras com a criação de "ilhas de diversidade" - pequenos núcleos com alta concentração de espécies diferentes que servem como centros de dispersão de sementes para áreas adjacentes.

"Nossa abordagem imita os processos naturais de sucessão florestal, mas de forma acelerada", explica Ana Costa, coordenadora do projeto. "Em apenas dois anos, já registramos o retorno de 45 espécies de aves e 15 espécies de mamíferos à área restaurada."

O projeto também gera renda para as comunidades locais através da coleta sustentável de sementes nativas e da produção de mudas. Mais de 80 famílias estão diretamente envolvidas nas atividades de restauração, recebendo capacitação técnica e remuneração justa pelo trabalho.`,
      author: "Ana Costa",
      authorRole: "ONG Verde Amazônia",
      authorAvatar: "/api/placeholder/40/40",
      publishDate: "2024-08-10",
      category: "conservacao",
      tags: ["amazônia", "reflorestamento", "restauração", "comunidades"],
      readTime: "5 min",
      views: 2156,
      likes: 234,
      comments: 67,
      featured: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todos', count: blogPosts.length },
    { id: 'descobertas', name: 'Descobertas', count: blogPosts.filter(p => p.category === 'descobertas').length },
    { id: 'pesquisa', name: 'Pesquisa', count: blogPosts.filter(p => p.category === 'pesquisa').length },
    { id: 'conservacao', name: 'Conservação', count: blogPosts.filter(p => p.category === 'conservacao').length },
    { id: 'educacao', name: 'Educação', count: blogPosts.filter(p => p.category === 'educacao').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const handleCreatePost = useCallback((newPostData: Omit<BlogPost, 'id' | 'author' | 'authorRole' | 'authorAvatar' | 'publishDate' | 'readTime' | 'views' | 'likes' | 'comments' | 'featured'>) => {
    const post: BlogPost = {
      id: Date.now(),
      ...newPostData,
      author: "Curador Dr_C",
      authorRole: "Editor Científico",
      authorAvatar: "/api/placeholder/40/40",
      publishDate: new Date().toISOString().split('T')[0],
      readTime: Math.ceil(newPostData.content.length / 200) + " min",
      views: 0,
      likes: 0,
      comments: 0,
      featured: false
    };
    
    setBlogPosts(prev => [post, ...prev]);
    setCurrentView('home');
  }, []);

  const handleUpdatePost = useCallback((updatedPost: BlogPost) => {
    setBlogPosts(prev => 
      prev.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  }, []);

  const handleViewPost = useCallback((post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('post');
  }, []);

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

      {featuredPosts.length > 0 && selectedCategory === 'all' && !searchTerm && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
            Posts em Destaque
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 relative">
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
                    onClick={() => handleViewPost(post)}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{post.author}</p>
                        <p className="text-gray-500">{post.publishDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                </CardContent>
              </Card>
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
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum post encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termos de busca.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-32 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex-shrink-0"></div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge variant="outline" className="mb-2 capitalize">
                            {post.category}
                          </Badge>
                          <h3 
                            className="text-xl font-bold hover:text-green-600 cursor-pointer"
                            onClick={() => handleViewPost(post)}
                          >
                            {post.title}
                          </h3>
                        </div>
                        {post.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Destaque
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      
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
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{post.author}</p>
                            <p className="text-gray-500">{post.authorRole}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.publishDate}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return (
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
  );
};

export default BlogSystem;
