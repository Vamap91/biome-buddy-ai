
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, LayoutDashboard, Gamepad2, Settings, BookOpen, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogHeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ currentView, setCurrentView }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Dr_C v2.0</h1>
              <p className="text-sm text-gray-600">Centro de Conhecimento em Biodiversidade</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => navigate('/games')} variant="outline" size="sm">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Jogos
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('home')}
              className={currentView === 'home' ? 'bg-green-50 border-green-300' : ''}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
            <Button 
              onClick={() => setCurrentView('create')}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
