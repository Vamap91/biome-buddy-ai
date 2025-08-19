
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Bot,
  User,
  LogOut,
  Zap,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    {
      title: t('conversationsToday'),
      value: '12',
      change: '+8%',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: t('queriesPerformed'),
      value: '847',
      change: '+23%',
      icon: Bot,
      color: 'text-green-600'
    },
    {
      title: t('tokensUsed'),
      value: '45.2K',
      change: '+12%',
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
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> desde ontem
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('recentActivity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: 'Nova conversa iniciada',
                        time: '2 minutos atrás',
                        type: 'chat'
                      },
                      {
                        action: 'Query sobre polinização',
                        time: '15 minutos atrás',
                        type: 'query'
                      },
                      {
                        action: 'Análise de biodiversidade',
                        time: '1 hora atrás',
                        type: 'analysis'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'chat' ? 'bg-blue-500' :
                          activity.type === 'query' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('quickStats')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversas este mês</span>
                      <Badge variant="secondary">124</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Taxa de satisfação</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">98%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tempo médio de resposta</span>
                      <Badge variant="secondary">1.2s</Badge>
                    </div>
                  </div>
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
