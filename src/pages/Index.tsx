
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen, Settings, LogIn, Users, Video, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo e Header Principal */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Dr_C v2.0</span>
          </div>
          <p className="text-lg text-gray-600 mb-2">Plataforma de Biodiversidade com IA</p>
          <p className="text-base text-gray-500">Sua plataforma inteligente para conversas e descobertas ambientais</p>
          
          {!user && (
            <div className="flex gap-4 justify-center mt-8">
              <Link to="/login">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </Button>
              </Link>
              <Link to="/free-chat">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Gratuito
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Chat Inteligente
              </CardTitle>
              <CardDescription>
                Converse com nossa IA especializada em meio ambiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={user ? "/chat" : "/free-chat"}>
                <Button className="w-full">
                  {user ? "Ir para Chat" : "Experimentar Gratuitamente"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Blog Ambiental
              </CardTitle>
              <CardDescription>
                Descubra artigos e pesquisas sobre sustentabilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/blog">
                <Button className="w-full" variant="outline">
                  Explorar Blog
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-purple-600" />
                Posts da Comunidade
              </CardTitle>
              <CardDescription>
                Compartilhe e veja posts da comunidade ambiental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/posts">
                <Button className="w-full" variant="outline">
                  Ver Posts
                </Button>
              </Link>
            </CardContent>
          </Card>

          {user && (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-orange-600" />
                    Dashboard
                  </CardTitle>
                  <CardDescription>
                    Veja suas estatísticas e atividades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/dashboard">
                    <Button className="w-full" variant="outline">
                      Acessar Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    Configurações
                  </CardTitle>
                  <CardDescription>
                    Gerencie sua conta e preferências
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/settings">
                    <Button className="w-full" variant="outline">
                      Configurar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <footer className="text-center py-8 text-gray-500">
          <p>© 2024 Dr_C v2.0. Feito com 💚 para a biodiversidade.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
