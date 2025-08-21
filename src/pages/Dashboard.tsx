
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  BarChart3, 
  Settings,
  MessageCircle,
  Calendar,
  Gamepad2,
  BookOpen,
  Menu,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

  const NavigationButtons = () => (
    <>
      <Button onClick={() => navigate('/games')} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <Gamepad2 className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{t('games')}</span>
      </Button>
      <Button onClick={() => navigate('/blog')} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <BookOpen className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Blog</span>
      </Button>
      <Button onClick={() => navigate('/settings')} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <Settings className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{t('settings')}</span>
      </Button>
      <Button onClick={handleLogout} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <LogOut className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{t('logout')}</span>
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-hero-gradient rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent truncate">
                {t('welcome')}, {user?.user_metadata?.full_name || user?.email || t('user')}!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base hidden sm:block">{t('readyToExplore')}</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <NavigationButtons />
          </div>

          {/* Mobile Navigation Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <h3 className="font-semibold text-lg mb-4">Menu</h3>
                  <NavigationButtons />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Quick Actions Row */}
        <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
          <NavigationButtons />
        </div>

        {/* Action Button - Chat IA */}
        <Card className="mb-6 sm:mb-8 bg-hero-gradient border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">{t('startNewConversation')}</h2>
                <p className="text-white/80 text-sm sm:text-base">Converse com o Dr_C sobre biodiversidade</p>
              </div>
              <Button 
                onClick={handleStartChat}
                variant="secondary" 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t('chatAI')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Blog Button */}
          <Card className="bg-hero-gradient border-0 hover:opacity-90 transition-opacity cursor-pointer" onClick={() => navigate('/blog')}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-white">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Blog</h2>
                  <p className="text-white/80 text-sm sm:text-base">Explore artigos sobre biodiversidade</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/blog');
                  }}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Blog
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Games Button */}
          <Card className="bg-hero-gradient border-0 hover:opacity-90 transition-opacity cursor-pointer" onClick={() => navigate('/games')}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-white">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Jogos</h2>
                  <p className="text-white/80 text-sm sm:text-base">Aprenda jogando sobre biodiversidade</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/games');
                  }}
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Jogos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6">
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
