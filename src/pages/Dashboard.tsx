
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Bot,
  User,
  LogOut,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { stats, refreshStats } = useDashboardStats();

  // Atualizar estatísticas quando voltar para o dashboard
  useEffect(() => {
    refreshStats();
  }, []);

  const statsCards = [
    {
      title: 'Conversas Hoje',
      value: stats.loading ? '...' : stats.conversationsToday.toString(),
      change: stats.conversationsToday > 0 ? '+' + ((stats.conversationsToday / Math.max(stats.totalConversations, 1)) * 100).toFixed(0) + '%' : '0%',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Mensagens Totais',
      value: stats.loading ? '...' : stats.totalMessages.toString(),
      change: stats.totalMessages > 0 ? '+' + Math.min(100, Math.round(stats.totalMessages / 10)) + '%' : '0%',
      icon: Bot,
      color: 'text-green-600'
    },
    {
      title: 'Tokens Estimados',
      value: stats.loading ? '...' : stats.tokensUsed,
      change: stats.tokensUsed !== '0' ? '+' + Math.min(100, Math.round(parseInt(stats.tokensUsed.replace('K', '')) || 0)) + '%' : '0%',
      icon: Zap,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Dr_C v2.0</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'pt' ? 'EN' : 'PT'}
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {user?.user_metadata?.full_name || user?.email || t('user')}
                </p>
                <p className="text-xs text-muted-foreground">{t('online')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <nav className="p-4 space-y-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Principal</h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Fale com o Dr_C
              </Button>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('settings')}</h3>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                {t('settings')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-hero-gradient rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                {t('welcome')}, {user?.user_metadata?.full_name?.split(' ')[0] || t('user')}!
              </h2>
              <p className="text-white/80 mb-4">
                {t('readyToExplore')}
              </p>
              <Button 
                variant="secondary"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('startNewConversation')}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {statsCards.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    {stats.loading ? (
                      <>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stat.change}
                          </span> 
                          desde o início
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="w-2 h-2 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-3/4 mb-1" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stats.conversationsToday > 0 && (
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {stats.conversationsToday} conversa{stats.conversationsToday > 1 ? 's' : ''} hoje
                            </p>
                            <p className="text-xs text-muted-foreground">Conversas com o Dr_C</p>
                          </div>
                        </div>
                      )}
                      {stats.totalMessages > 0 && (
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{stats.totalMessages} mensagens totais</p>
                            <p className="text-xs text-muted-foreground">Interações realizadas</p>
                          </div>
                        </div>
                      )}
                      {stats.tokensUsed !== '0' && (
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{stats.tokensUsed} tokens processados</p>
                            <p className="text-xs text-muted-foreground">Capacidade de IA utilizada</p>
                          </div>
                        </div>
                      )}
                      {stats.totalMessages === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <Bot className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Nenhuma atividade ainda.</p>
                          <p className="text-xs">Comece conversando com o Dr_C!</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversas totais</span>
                        <Badge variant="secondary">{stats.totalConversations}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Mensagens trocadas</span>
                        <Badge variant="secondary">{stats.totalMessages}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tokens utilizados</span>
                        <Badge variant="secondary">{stats.tokensUsed}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status do Dr_C</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
