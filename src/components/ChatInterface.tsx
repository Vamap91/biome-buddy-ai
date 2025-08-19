
import { useState, useRef } from "react";
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
  Bot,
  User,
  Loader2,
  File
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'dr_c';
  timestamp: Date;
  rating?: number;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string, attachments?: File[]) => void;
  isProcessing?: boolean;
  className?: string;
}

const ChatInterface = ({ 
  messages = [], 
  onSendMessage,
  isProcessing = false,
  className = "" 
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleSendMessage = () => {
    if ((inputValue.trim() || attachedFiles.length > 0) && onSendMessage && !isProcessing) {
      onSendMessage(inputValue || "Analise o anexo enviado", attachedFiles);
      setInputValue("");
      setAttachedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
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
              <span className="text-sm text-muted-foreground">
                {isProcessing ? t('processing') : 'Online'}
              </span>
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
                  <span className="text-sm">{t('aiThinking')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Área de input */}
        <div className="border-t border-border/40 p-4">
          {/* Arquivos anexados */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg text-sm">
                  <File className="h-3 w-3" />
                  <span className="truncate max-w-32">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xls,.xlsx,.ppt,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={handleFileAttach}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder={t('chatPlaceholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
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
              disabled={(!inputValue.trim() && attachedFiles.length === 0) || isProcessing}
              className="bg-hero-gradient hover:opacity-90 text-white"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-start mt-2 text-xs text-muted-foreground">
            <span>{t('enterToSend')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
