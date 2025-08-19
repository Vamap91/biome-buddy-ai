
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Settings, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">Dr_C</span>
          </div>
          <h1 className="text-lg font-semibold">Chat com Dr_C</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            size="sm"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/settings')} 
            variant="outline" 
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Sair
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
