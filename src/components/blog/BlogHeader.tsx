
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, LayoutDashboard, Gamepad2, Settings, BookOpen, PlusCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface BlogHeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ currentView, setCurrentView }) => {
  const navigate = useNavigate();

  const NavigationButtons = () => (
    <>
      <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <LayoutDashboard className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Dashboard</span>
      </Button>
      <Button onClick={() => navigate('/games')} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <Gamepad2 className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Jogos</span>
      </Button>
      <Button onClick={() => navigate('/settings')} variant="outline" size="sm" className="flex-1 sm:flex-none">
        <Settings className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Configurações</span>
      </Button>
      <Button 
        variant="outline" 
        onClick={() => setCurrentView('home')}
        className={`flex-1 sm:flex-none ${currentView === 'home' ? 'bg-green-50 border-green-300' : ''}`}
        size="sm"
      >
        <BookOpen className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Blog</span>
      </Button>
    </>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Blog Dr_C v2.0</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Centro de Conhecimento em Biodiversidade</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* New Post Button - Always visible */}
            <Button 
              onClick={() => setCurrentView('create')}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo Post</span>
            </Button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavigationButtons />
            </div>

            {/* Mobile Navigation Menu */}
            <div className="lg:hidden">
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
        </div>
      </div>

      {/* Mobile Quick Actions Row */}
      <div className="lg:hidden border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex gap-1 overflow-x-auto">
            <NavigationButtons />
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
