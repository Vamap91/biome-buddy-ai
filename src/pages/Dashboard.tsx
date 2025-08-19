import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MetricCard from '@/components/MetricCard';
import { 
  MessageSquare, 
  BarChart3, 
  Zap, 
  Settings,
  MessageCircle,
  TrendingUp,
  Users,
  Calendar,
  Gamepad2,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  
  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-hero-gradient rounded-xl flex items-center justify-center">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">
                {t('welcome')}, {user?.user_metadata?.full_name || user?.email || t('user')}!
              </h1>
              <p className="text-muted-foreground">{t('readyToExplore')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={() => navigate('/games')} variant="outline" size="sm">
              <Gamepad2 className="h-4 w-4 mr-2" />
              {t('games')}
            </Button>
            <Button onClick={() => navigate('/blog')} variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              {t('settings')}
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              {t('logout')}
            </Button>
          </div>
        </div>

        {/* Action Button */}
        <Card className="mb-8 bg-hero-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-2xl font-semibold mb-2">{t('startNewConversation')}</h2>
                <p className="text-white/80">Converse com o Dr_C sobre biodiversidade</p>
              </div>
              <Button 
                onClick={handleStartChat}
                variant="secondary" 
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t('chatAI')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title={t('conversationsToday')}
            value={stats.conversationsToday.toString()}
            icon={<MessageSquare className="h-4 w-4" />}
            trend={{
              value: 12,
              label: "from yesterday"
            }}
          />
          <MetricCard
            title={t('queriesPerformed')}
            value={stats.totalMessages.toString()}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: 8,
              label: "from last week"
            }}
          />
          <MetricCard
            title={t('tokensUsed')}
            value={stats.estimatedTokens.toLocaleString()}
            icon={<Zap className="h-4 w-4" />}
            trend={{
              value: 23,
              label: "from last month"
            }}
          />
          <MetricCard
            title="Total de Conversas"
            value={stats.totalConversations.toString()}
            icon={<Users className="h-4 w-4" />}
            trend={{
              value: 5,
              label: "from last week"
            }}
          />
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t('recentActivity')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      <MessageCircle className="h-4 w-4 mt-1 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma atividade recente</p>
                    <p className="text-sm">Inicie uma conversa para ver suas atividades aqui</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>{t('quickStats')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {t('online')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversas hoje</span>
                    <span className="font-medium">{stats.conversationsToday}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total de mensagens</span>
                    <span className="font-medium">{stats.totalMessages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tokens estimados</span>
                    <span className="font-medium">{stats.estimatedTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total conversas</span>
                    <span className="font-medium">{stats.totalConversations}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
