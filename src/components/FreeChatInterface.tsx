
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot,
  User,
  Loader2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'dr_c';
  timestamp: Date;
}

const FreeChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const navigate = useNavigate();
  const MAX_QUESTIONS = 10;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing || questionsUsed >= MAX_QUESTIONS) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    setQuestionsUsed(prev => prev + 1);

    try {
      const { data: aiData, error } = await supabase.functions.invoke('free-chat-ai', {
        body: { message: inputValue }
      });

      let aiResponse = '';
      if (error) {
        console.error('Error calling AI function:', error);
        aiResponse = 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
      } else if (aiData?.response) {
        aiResponse = aiData.response;
      } else {
        aiResponse = 'Desculpe, não consegui processar sua mensagem no momento.';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'dr_c',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Unexpected error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Erro inesperado. Tente novamente mais tarde.',
        sender: 'dr_c',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUpgrade = () => {
    navigate('/login');
  };

  const questionsRemaining = MAX_QUESTIONS - questionsUsed;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header com contador */}
      <div className="border-b border-border/40 backdrop-blur-sm bg-background/80 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Dr_C v2.0 - Teste Grátis</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={questionsRemaining > 3 ? "default" : "destructive"} className="text-sm">
              {questionsRemaining} perguntas restantes
            </Badge>
            <Button onClick={handleUpgrade} className="bg-hero-gradient hover:opacity-90">
              Fazer Login
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 container mx-auto p-4 max-w-4xl">
        <Card className="h-full flex flex-col bg-card-gradient border-0 shadow-nature">
          <CardHeader className="pb-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Chat com Dr_C</span>
              </CardTitle>
              {questionsUsed >= MAX_QUESTIONS && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>Limite atingido</span>
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Olá! Sou o Dr_C</h3>
                  <p className="text-muted-foreground">
                    Faça suas perguntas sobre biodiversidade. Você tem {MAX_QUESTIONS} perguntas gratuitas!
                  </p>
                </div>
              )}

              {messages.map((message) => (
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
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
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

                    <div className={cn(
                      "flex items-center mt-2 text-xs text-muted-foreground",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}>
                      <span>{message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicador de processamento */}
              {isProcessing && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <div className="w-8 h-8 bg-hero-gradient rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">Dr_C está pensando...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensagem de limite atingido */}
              {questionsUsed >= MAX_QUESTIONS && (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Limite de perguntas atingido</h3>
                  <p className="text-muted-foreground mb-4">
                    Você usou todas as suas {MAX_QUESTIONS} perguntas gratuitas.
                  </p>
                  <Button onClick={handleUpgrade} className="bg-hero-gradient hover:opacity-90">
                    Fazer Login para Continuar
                  </Button>
                </div>
              )}
            </div>

            {/* Área de input */}
            <div className="border-t border-border/40 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={questionsUsed >= MAX_QUESTIONS ? "Limite de perguntas atingido" : "Digite sua pergunta sobre biodiversidade..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isProcessing || questionsUsed >= MAX_QUESTIONS}
                    className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing || questionsUsed >= MAX_QUESTIONS}
                  className="bg-hero-gradient hover:opacity-90 text-white"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                <span>Enter para enviar • {questionsRemaining} perguntas restantes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeChatInterface;
