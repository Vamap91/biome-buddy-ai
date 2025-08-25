
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  BookOpen, 
  Gamepad2, 
  Settings, 
  LogOut,
  BarChart3,
  Users,
  Activity,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import MetricCard from '@/components/MetricCard';
import UpgradeModal from '@/components/UpgradeModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { stats, loading } = useDashboardStats();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
                <p className="text-sm text-gray-600">{t('welcome')}, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{t('online')}</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                {t('settings')}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">{t('welcome')}, {t('user')}!</h2>
            <p className="text-green-100 text-lg mb-6">
              {t('readyToExplore')}
            </p>
            <Button 
              onClick={() => navigate('/chat')} 
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('startNewConversation')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title={t('conversationsToday')}
            value={stats?.conversations_today || 0}
            icon={MessageCircle}
            loading={loading}
            className="bg-blue-50 border-blue-200"
          />
          <MetricCard
            title={t('queriesPerformed')}
            value={stats?.queries_performed || 0}
            icon={BarChart3}
            loading={loading}
            className="bg-green-50 border-green-200"
          />
          <MetricCard
            title={t('tokensUsed')}
            value={stats?.tokens_used || 0}
            icon={Activity}
            loading={loading}
            className="bg-purple-50 border-purple-200"
          />
          <MetricCard
            title={t('recentActivity')}
            value={stats?.recent_activity || 0}
            icon={Clock}
            loading={loading}
            className="bg-orange-50 border-orange-200"
          />
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Chat with Dr_C */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-gradient-to-br from-green-500 to-green-600"
            onClick={() => navigate('/chat')}
          >
            <CardContent className="p-0">
              <div className="p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <MessageCircle className="h-12 w-12 text-white/90" />
                  <div className="text-white/60 text-sm font-medium">IA Chat</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Chat Dr_C</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {t('converseWithDrC')}
                </p>
              </div>
              <div className="h-2 bg-white/20"></div>
            </CardContent>
          </Card>

          {/* Blog */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={() => navigate('/blog')}
          >
            <CardContent className="p-0">
              <div className="p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <BookOpen className="h-12 w-12 text-white/90" />
                  <div className="text-white/60 text-sm font-medium">Blog</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Blog Dr_C</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {t('exploreArticles')}
                </p>
              </div>
              <div className="h-2 bg-white/20"></div>
            </CardContent>
          </Card>

          {/* Games */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={() => navigate('/games')}
          >
            <CardContent className="p-0">
              <div className="p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <Gamepad2 className="h-12 w-12 text-white/90" />
                  <div className="text-white/60 text-sm font-medium">{t('games')}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('ecoGames')}</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {t('learnByPlaying')}
                </p>
              </div>
              <div className="h-2 bg-white/20"></div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{t('recentActivity')}</h3>
              <Button variant="outline" size="sm">
                Ver Tudo
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Nova conversa iniciada</p>
                  <p className="text-xs text-gray-500">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Artigo lido sobre biodiversidade</p>
                  <p className="text-xs text-gray-500">Há 5 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
