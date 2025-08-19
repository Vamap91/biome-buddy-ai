
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricCard from "@/components/MetricCard";
import ChatInterface from "@/components/ChatInterface";
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  TrendingUp,
  Leaf,
  Calendar,
  Bell,
  Settings,
  Search,
  Plus,
  Filter,
  Download,
  BarChart3,
  Globe,
  Brain
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-surface-elevated sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Dr_C v2.0</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1 ml-8">
              <Button variant="ghost" size="sm">Dashboard</Button>
              <Button variant="ghost" size="sm">Chat</Button>
              <Button variant="ghost" size="sm">Biblioteca</Button>
              <Button variant="ghost" size="sm">Analytics</Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Busca Global */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Buscar..." 
                  className="pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Notificações */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs"></div>
            </Button>

            {/* Perfil */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">JS</span>
              </div>
              <span className="hidden md:block text-sm font-medium">João Silva</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-border/40 min-h-screen p-4">
          <nav className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Principal
            </div>
            <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat Dr_C
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Biblioteca
            </Button>

            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
              Ferramentas
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Brain className="mr-2 h-4 w-4" />
              Análise IA
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Globe className="mr-2 h-4 w-4" />
              API
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </nav>

          {/* Upgrade Prompt */}
          <div className="mt-8">
            <Card className="bg-card-gradient border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Upgrade para Pro</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Acesse IA avançada e recursos premium
                </p>
                <Button size="sm" className="w-full bg-hero-gradient hover:opacity-90">
                  Fazer Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6">
          {/* Boas-vindas */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">
                Bom dia, <span className="text-gradient">João</span> 👋
              </h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <Calendar className="w-3 h-3 mr-1" />
                  Plano Pro Ativo
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground">
              Aqui está um resumo da sua atividade em biodiversidade hoje.
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Conversas este mês"
              value="47"
              icon={<MessageCircle className="h-4 w-4" />}
              trend={{ value: 23, label: "vs mês anterior" }}
            />
            <MetricCard
              title="Documentos analisados"
              value="12"
              icon={<BookOpen className="h-4 w-4" />}
              trend={{ value: 8, label: "esta semana" }}
            />
            <MetricCard
              title="Tempo de estudo"
              value="24h"
              icon={<Brain className="h-4 w-4" />}
              trend={{ value: -5, label: "vs semana anterior" }}
            />
            <MetricCard
              title="Satisfaction Score"
              value="4.8"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: 12, label: "pontos" }}
            />
          </div>

          {/* Tabs de Conteúdo */}
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[400px] grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="library">Biblioteca</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button size="sm" className="bg-hero-gradient hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Projeto
                </Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Atividade Recente */}
                <Card className="bg-card-gradient border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                    <CardDescription>
                      Suas últimas interações com o Dr_C
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        action: "Chat sobre polinizadores",
                        time: "2 horas atrás",
                        type: "chat"
                      },
                      {
                        action: "Análise do paper: 'Bee Diversity in Urban Areas'",
                        time: "1 dia atrás",
                        type: "analysis"
                      },
                      {
                        action: "Salvou artigo na biblioteca",
                        time: "2 dias atrás",
                        type: "save"
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recursos Recomendados */}
                <Card className="bg-card-gradient border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Recomendado para Você</CardTitle>
                    <CardDescription>
                      Baseado no seu histórico de pesquisa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "Impacto das Mudanças Climáticas na Polinização",
                        type: "Artigo Científico",
                        badge: "Trending"
                      },
                      {
                        title: "Guia de Identificação de Abelhas Nativas",
                        type: "Recurso Educacional",
                        badge: "Popular"
                      },
                      {
                        title: "Workshop: Conservação de Polinizadores",
                        type: "Evento",
                        badge: "Novo"
                      }
                    ].map((resource, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/30 hover-lift">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {resource.badge}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{resource.type}</span>
                        </div>
                        <h4 className="font-medium text-sm">{resource.title}</h4>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <div className="max-w-4xl">
                <ChatInterface />
              </div>
            </TabsContent>

            <TabsContent value="library" className="space-y-6">
              <Card className="bg-card-gradient border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Biblioteca de Conhecimento</CardTitle>
                  <CardDescription>
                    Explore recursos, artigos e documentos sobre biodiversidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Biblioteca em Construção</h3>
                    <p className="text-muted-foreground mb-4">
                      A biblioteca completa estará disponível em breve com milhares de recursos.
                    </p>
                    <Button className="bg-hero-gradient hover:opacity-90">
                      Ser Notificado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
