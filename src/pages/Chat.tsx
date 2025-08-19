import { useState } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  MessageSquare, 
  LogOut, 
  User,
  Bot,
  Loader2,
  Trash2,
  BarChart3
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Chat = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    currentConversation,
    isProcessing,
    setCurrentConversation,
    createConversation,
    sendMessage,
    deleteConversation,
  } = useConversations();

  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const handleNewChat = async () => {
    const newConversation = await createConversation();
    if (newConversation) {
      setCurrentConversation(newConversation.id);
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, currentConversation || undefined);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const success = await deleteConversation(conversationId);
    if (success) {
      console.log('Conversa deletada com sucesso');
    }
    setConversationToDelete(null);
  };

  // Convert messages to ChatInterface format
  const chatMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    sender: msg.role === 'user' ? 'user' as const : 'dr_c' as const,
    timestamp: new Date(msg.created_at),
  }));

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Dr_C v2.0</h2>
            <Button onClick={handleNewChat} size="sm" className="bg-hero-gradient">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Navigation */}
          <div className="space-y-2 mb-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
          
          {/* User info */}
          <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.user_metadata?.full_name || user?.email || 'Usuário'}
              </p>
            </div>
            <Button 
              onClick={signOut} 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Conversations list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center mb-1 group"
              >
                <Button
                  variant={currentConversation === conversation.id ? "secondary" : "ghost"}
                  className="flex-1 justify-start h-auto py-2 mr-1"
                  onClick={() => setCurrentConversation(conversation.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate text-left">{conversation.title}</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setConversationToDelete(conversation.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar Conversa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar esta conversa? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteConversation(conversation.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                <Bot className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Nenhuma conversa ainda.</p>
                <p className="text-xs">Inicie um novo chat!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            className="flex-1"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="max-w-md text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Bem-vindo ao Dr_C v2.0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Seu assistente especializado em biodiversidade com IA real da OpenAI. 
                  Selecione uma conversa existente ou inicie um novo chat.
                </p>
                <Button onClick={handleNewChat} className="bg-hero-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
