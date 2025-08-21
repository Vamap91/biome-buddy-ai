
import React from 'react';
import ChatWithSidebar from '@/components/ChatWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Settings, LayoutDashboard, Gamepad2, BookOpen, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Chat = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const NavigationButtons = () => (
    <>
      <Button 
        onClick={() => navigate('/dashboard')} 
        variant="outline" 
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <LayoutDashboard className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Dashboard</span>
      </Button>
      <Button 
        onClick={() => navigate('/games')} 
        variant="outline" 
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <Gamepad2 className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Jogos</span>
      </Button>
      <Button 
        onClick={() => navigate('/blog')} 
        variant="outline" 
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <BookOpen className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Blog</span>
      </Button>
      <Button 
        onClick={() => navigate('/settings')} 
        variant="outline" 
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <Settings className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Configurações</span>
      </Button>
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <LogOut className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </>
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-hero-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs sm:text-sm font-bold">Dr_C</span>
          </div>
          <h1 className="text-base sm:text-lg font-semibold truncate">Chat com Dr_C</h1>
        </div>
        
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

      {/* Mobile Quick Actions Row */}
      <div className="flex lg:hidden gap-1 p-2 bg-muted/30 border-b overflow-x-auto">
        <NavigationButtons />
      </div>

      {/* Chat Interface with Sidebar */}
      <div className="flex-1">
        <ChatWithSidebar />
      </div>
    </div>
  );
};

export default Chat;
