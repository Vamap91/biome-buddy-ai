
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MoreVertical, 
  Star,
  Share2,
  Download,
  Bot,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'dr_c';
  timestamp: Date;
  rating?: number;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  className?: string;
}

const ChatInterface = ({ 
  messages = [], 
  onSendMessage,
  className = "" 
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Mensagens de exemplo
  const defaultMessages: Message[] = [
    {
      id: '1',
      content: 'Olá! Eu sou o Dr_C v2.0, seu assistente especializado em biodiversidade. Como posso ajudá-lo hoje?',
      sender: 'dr_c',
      timestamp: new Date(Date.now() - 5000)
    },
    {
      id: '2',
      content: 'Gostaria de saber mais sobre o papel das abelhas na polinização e como isso afeta a biodiversidade.',
      sender: 'user',
      timestamp: new Date(Date.now() - 3000)
    },
    {
      id: '3',
      content: 'Excelente pergunta! As abelhas são polinizadores fundamentais para a manutenção da biodiversidade. Elas visitam aproximadamente 80% das plantas com flores do mundo, facilitando a reprodução sexual das plantas através da transferência de pólen...',
      sender: 'dr_c',
      timestamp: new Date(Date.now() - 1000),
      rating: 5
    }
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
      setIsTyping(true);
      
      // Simular resposta do bot
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={cn("flex flex-col h-[600px] bg-card-gradient border-0 shadow-nature", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-hero-gradient rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Dr_C v2.0</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              )}
            >
              <Avatar className="w-8 h-8">
                {message.sender === 'dr_c' ? (
                  <div className="w-8 h-8 bg-hero-gradient rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>

              <div className={cn(
                "flex-1 max-w-[80%]",
                message.sender === 'user' ? 'text-right' : ''
              )}>
                <div
                  className={cn(
                    "inline-block p-3 rounded-2xl text-sm",
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>

                {/* Ações da mensagem */}
                <div className={cn(
                  "flex items-center space-x-2 mt-2 text-xs text-muted-foreground",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  <span>{message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                  
                  {message.sender === 'dr_c' && (
                    <>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  
                  {message.rating && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {message.rating}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <div className="w-8 h-8 bg-hero-gradient rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </Avatar>
              <div className="bg-muted p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Área de input */}
        <div className="border-t border-border/40 p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Digite sua pergunta sobre biodiversidade..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-hero-gradient hover:opacity-90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Pressione Enter para enviar, Shift+Enter para nova linha</span>
            <span>Powered by GPT-4</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
