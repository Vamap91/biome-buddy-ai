import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen, Settings, LogIn, Users, Video, Globe, Star, TrendingUp, Heart, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Dr_C</span>
            </div>
            
            <h1 className="text-3xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sua <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">IA Especialista</span><br />
              em Biodiversidade
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubra o poder da inteligência artificial aplicada ao meio ambiente. 
              Converse, aprenda e conecte-se com uma comunidade apaixonada pela natureza.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link to="/login">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-lg">
                    <LogIn className="h-5 w-5 mr-2" />
                    Começar Agora
                  </Button>
                </Link>
                <Link to="/free-chat">
                  <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-4 text-lg">
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Experimentar Grátis
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mb-12">
                <Link to="/chat">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-lg">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Continuar Conversando
                  </Button>
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600">Conversas Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">1.2K+</div>
                <div className="text-gray-600">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 mb-2">24/7</div>
                <div className="text-gray-600">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recursos Que Fazem a Diferença
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tecnologia avançada para conectar você com o mundo da sustentabilidade
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">IA Conversacional Avançada</CardTitle>
              <CardDescription className="text-base">
                Converse naturalmente sobre meio ambiente com nossa IA especializada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={user ? "/chat" : "/free-chat"}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {user ? "Iniciar Conversa" : "Testar Gratuitamente"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Conteúdo Educativo</CardTitle>
              <CardDescription className="text-base">
                Artigos, pesquisas e insights sobre sustentabilidade e biodiversidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/blog">
                <Button className="w-full" variant="outline">
                  Explorar Conteúdo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Comunidade Ativa</CardTitle>
              <CardDescription className="text-base">
                Conecte-se com pessoas que compartilham a paixão pelo meio ambiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/posts">
                <Button className="w-full" variant="outline">
                  Participar da Comunidade
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O Que Nossos Usuários Dizem
            </h2>
            <p className="text-xl text-gray-600">
              Depoimentos reais de pessoas que transformaram sua relação com o meio ambiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "O Dr_C revolucionou minha forma de entender sustentabilidade. 
                  As conversas são incrivelmente úteis e educativas!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">Maria Silva</div>
                    <div className="text-gray-500 text-sm">Bióloga</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Ferramenta incrível! Me ajudou muito nos meus projetos de 
                  conservação. A IA realmente entende do assunto."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    J
                  </div>
                  <div>
                    <div className="font-semibold">João Santos</div>
                    <div className="text-gray-500 text-sm">Engenheiro Ambiental</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "A comunidade é fantástica e aprendo algo novo todos os dias. 
                  Recomendo fortemente para todos interessados em sustentabilidade!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    A
                  </div>
                  <div>
                    <div className="font-semibold">Ana Costa</div>
                    <div className="text-gray-500 text-sm">Professora</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para Começar sua Jornada Sustentável?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Junte-se a milhares de pessoas que já estão fazendo a diferença
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                  Criar Conta Gratuita
                </Button>
              </Link>
              <Link to="/free-chat">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Experimentar sem Cadastro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* User Dashboard Preview */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo de volta, {user.email?.split('@')[0]}!
            </h2>
            <p className="text-lg text-gray-600">
              Continue explorando e contribuindo para um mundo mais sustentável
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                  Dashboard
                </CardTitle>
                <CardDescription>
                  Veja suas estatísticas e progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/dashboard">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Ver Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  Configurações
                </CardTitle>
                <CardDescription>
                  Personalize sua experiência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/settings">
                  <Button className="w-full" variant="outline">
                    Configurar Conta
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Video className="h-5 w-5 mr-2 text-purple-600" />
                  Novos Posts
                </CardTitle>
                <CardDescription>
                  Veja as últimas atualizações da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/posts">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Explorar Posts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Dr_C</span>
            </div>
            <div className="text-gray-400">
              <span>© 2025 Charles Frewen. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
