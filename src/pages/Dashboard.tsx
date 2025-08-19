import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MetricCard from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Lightbulb, 
  Home, 
  MessageSquare, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  Upload,
  BarChart,
  Brain,
  Leaf,
  Activity,
} from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'chat' | 'upload' | 'analysis';
}

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'Nova conversa iniciada',
    description: 'Usuário iniciou uma conversa sobre abelhas e polinização',
    time: '5 minutos atrás',
    type: 'chat',
  },
  {
    id: '2',
    title: 'Documento enviado',
    description: 'Upload do artigo "Impacto da urbanização na fauna local"',
    time: '12 minutos atrás',
    type: 'upload',
  },
  {
    id: '3',
    title: 'Análise concluída',
    description: 'Análise de dados sobre a população de aves migratórias',
    time: '30 minutos atrás',
    type: 'analysis',
  },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();

  // Mock data and other functions
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-blue-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-hero-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Dr_C v2.0
                </h1>
                <p className="text-xs text-muted-foreground">Biodiversidade Inteligente</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat IA
                </Link>
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentos
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                      <AvatarFallback className="bg-hero-gradient text-white text-sm">
                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.user_metadata?.full_name || 'Pesquisador'}!
          </h2>
          <p className="text-muted-foreground">
            Explore o mundo da biodiversidade com inteligência artificial avançada
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-lift bg-card-gradient border-0 shadow-soft cursor-pointer group" asChild>
            <Link to="/chat">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    Iniciar Chat IA
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Converse com o Dr_C v2.0 sobre biodiversidade, ecologia e conservação
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover-lift bg-card-gradient border-0 shadow-soft cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5 text-success" />
                  </div>
                  Carregar Documento
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Faça upload de documentos para análise e extração de insights
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-card-gradient border-0 shadow-soft cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  Relatórios
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Visualize relatórios e análises detalhadas dos seus dados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Conversas"
            value="15"
            icon={<MessageSquare className="h-4 w-4" />}
            trend={{ value: 12, label: "este mês" }}
          />
          
          <MetricCard
            title="Documentos Processados"
            value="8"
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 25, label: "este mês" }}
          />
          
          <MetricCard
            title="Insights Gerados"
            value="42"
            icon={<Brain className="h-4 w-4" />}
            trend={{ value: 8, label: "esta semana" }}
          />
          
          <MetricCard
            title="Espécies Analisadas"
            value="127"
            icon={<Leaf className="h-4 w-4" />}
            trend={{ value: 15, label: "este mês" }}
          />
        </div>

        {/* Recent Activity */}
        <Card className="bg-card-gradient border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'chat' 
                    ? 'bg-blue-500/20 text-blue-600' 
                    : activity.type === 'upload' 
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-purple-500/20 text-purple-600'
                  }`}>
                    {activity.type === 'chat' && <MessageSquare className="h-4 w-4" />}
                    {activity.type === 'upload' && <Upload className="h-4 w-4" />}
                    {activity.type === 'analysis' && <Brain className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
