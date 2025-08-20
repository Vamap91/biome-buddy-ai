import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Função melhorada para processar arquivos
  const processFiles = async (files: File[]): Promise<string> => {
    let fileContents = '';
    
    for (const file of files) {
      try {
        console.log(`Processando arquivo: ${file.name}, tipo: ${file.type}, tamanho: ${file.size} bytes`);
        
        // Processar diferentes tipos de arquivo
        if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          // Arquivos de texto
          const text = await file.text();
          fileContents += `\n\n=== DOCUMENTO: ${file.name} ===\n`;
          fileContents += `TIPO: Arquivo de texto\n`;
          fileContents += `CONTEÚDO:\n${text}\n`;
          fileContents += `=== FIM DO DOCUMENTO ===\n\n`;
          
        } else if (file.type === 'application/pdf') {
          // PDFs - adicionar informações detalhadas
          fileContents += `\n\n=== DOCUMENTO PDF: ${file.name} ===\n`;
          fileContents += `TIPO: Documento PDF\n`;
          fileContents += `TAMANHO: ${(file.size / 1024).toFixed(2)} KB\n`;
          fileContents += `INSTRUÇÃO: Este é um arquivo PDF. Por favor, analise o conteúdo baseado no contexto da conversa. O usuário está enviando este documento para que você possa analisá-lo e responder perguntas sobre ele.\n`;
          fileContents += `SOLICITAÇÃO: Reconheça que recebeu o PDF "${file.name}" e peça ao usuário para fazer perguntas específicas sobre o documento, ou forneça um resumo se for solicitado.\n`;
          fileContents += `=== FIM DO DOCUMENTO ===\n\n`;
          
        } else if (file.type.includes('image')) {
          // Imagens
          fileContents += `\n\n=== IMAGEM: ${file.name} ===\n`;
          fileContents += `TIPO: Imagem (${file.type})\n`;
          fileContents += `TAMANHO: ${(file.size / 1024).toFixed(2)} KB\n`;
          fileContents += `INSTRUÇÃO: Uma imagem foi anexada. Reconheça o recebimento da imagem e peça ao usuário para descrever o que ele gostaria de saber sobre ela, já que você não pode visualizar imagens diretamente.\n`;
          fileContents += `=== FIM DA IMAGEM ===\n\n`;
          
        } else if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
          // Planilhas
          if (file.name.endsWith('.csv')) {
            try {
              const text = await file.text();
              fileContents += `\n\n=== PLANILHA CSV: ${file.name} ===\n`;
              fileContents += `TIPO: Planilha CSV\n`;
              fileContents += `CONTEÚDO:\n${text}\n`;
              fileContents += `=== FIM DA PLANILHA ===\n\n`;
            } catch (error) {
              fileContents += `\n\n=== PLANILHA: ${file.name} ===\n`;
              fileContents += `TIPO: Planilha Excel/CSV\n`;
              fileContents += `ERRO: Não foi possível ler o conteúdo diretamente.\n`;
              fileContents += `INSTRUÇÃO: Reconheça que recebeu a planilha e peça ao usuário para descrever os dados ou fazer perguntas específicas sobre o conteúdo.\n`;
              fileContents += `=== FIM DA PLANILHA ===\n\n`;
            }
          } else {
            fileContents += `\n\n=== PLANILHA: ${file.name} ===\n`;
            fileContents += `TIPO: Planilha Excel\n`;
            fileContents += `TAMANHO: ${(file.size / 1024).toFixed(2)} KB\n`;
            fileContents += `INSTRUÇÃO: Uma planilha Excel foi anexada. Reconheça o recebimento e peça ao usuário para descrever os dados ou fazer perguntas específicas sobre o conteúdo da planilha.\n`;
            fileContents += `=== FIM DA PLANILHA ===\n\n`;
          }
          
        } else if (file.type.includes('document') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          // Documentos Word
          fileContents += `\n\n=== DOCUMENTO WORD: ${file.name} ===\n`;
          fileContents += `TIPO: Documento Word\n`;
          fileContents += `TAMANHO: ${(file.size / 1024).toFixed(2)} KB\n`;
          fileContents += `INSTRUÇÃO: Um documento Word foi anexado. Reconheça o recebimento e peça ao usuário para fazer perguntas específicas sobre o documento ou fornecer detalhes sobre o que ele gostaria de saber.\n`;
          fileContents += `=== FIM DO DOCUMENTO ===\n\n`;
          
        } else if (file.type.includes('presentation') || file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
          // Apresentações
          fileContents += `\n\n=== APRESENTAÇÃO: ${file.name} ===\n`;
          fileContents += `TIPO: Apresentação PowerPoint\n`;
          fileContents += `TAMANHO: ${(file.size / 1024).toFixed(2)} KB\n`;
          fileContents += `INSTRUÇÃO: Uma apresentação PowerPoint foi anexada. Reconheça o recebimento e peça ao usuário para fazer perguntas específicas sobre a apresentação.\n`;
          fileContents += `=== FIM DA APRESENTAÇÃO ===\n\n`;
          
        } else {
          // Outros tipos de arquivo
          fileContents += `\n\n=== ARQUIVO: ${file.name} ===\n`;
          fileContents += `TIPO: ${file.type || 'Tipo desconhecido'}\n`;
          fileContents += `TAMANHO: ${(file.size / 1024).toFixed(2)} KB\n`;
          fileContents += `INSTRUÇÃO: Um arquivo foi anexado. Reconheça que recebeu o arquivo "${file.name}" e peça ao usuário para explicar o que ele gostaria de saber sobre este arquivo.\n`;
          fileContents += `=== FIM DO ARQUIVO ===\n\n`;
        }
        
      } catch (error) {
        console.error(`Erro ao processar arquivo ${file.name}:`, error);
        fileContents += `\n\n=== ERRO NO ARQUIVO: ${file.name} ===\n`;
        fileContents += `ERRO: Não foi possível processar este arquivo.\n`;
        fileContents += `INSTRUÇÃO: Informe ao usuário que houve um problema ao processar o arquivo "${file.name}" e peça para tentar novamente ou usar um formato diferente.\n`;
        fileContents += `=== FIM DO ERRO ===\n\n`;
      }
    }
    
    // Adicionar instruções gerais no final
    if (files.length > 0) {
      fileContents += `\n\n=== INSTRUÇÕES IMPORTANTES ===\n`;
      fileContents += `TOTAL DE ARQUIVOS ANEXADOS: ${files.length}\n`;
      fileContents += `COMO PROCEDER:\n`;
      fileContents += `1. Reconheça que recebeu os arquivos anexados\n`;
      fileContents += `2. Para PDFs, Word, Excel e outros documentos: Explique que você precisa que o usuário faça perguntas específicas ou forneça mais contexto sobre o que deseja saber\n`;
      fileContents += `3. Para arquivos de texto: Analise o conteúdo e forneça insights relevantes\n`;
      fileContents += `4. Para imagens: Peça ao usuário para descrever a imagem ou fazer perguntas específicas\n`;
      fileContents += `5. Sempre seja específico sobre qual arquivo você está se referindo quando responder\n`;
      fileContents += `=== FIM DAS INSTRUÇÕES ===\n\n`;
    }
    
    return fileContents;
  };

  // Fetch conversations with useCallback to prevent unnecessary re-renders
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
      } else {
        console.log('Conversations loaded:', data?.length || 0);
        setConversations(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching conversations:', err);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user]);

  // Fetch messages with useCallback
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        const typedMessages: Message[] = (data || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          created_at: msg.created_at
        }));
        console.log('Messages loaded for conversation:', conversationId, typedMessages.length);
        setMessages(typedMessages);
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    }
  }, [user]);

  // Create new conversation with useCallback
  const createConversation = useCallback(async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: user.id,
            title: title || 'Nova Conversa',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      console.log('New conversation created:', data.id);
      await fetchConversations();
      return data;
    } catch (err) {
      console.error('Unexpected error creating conversation:', err);
      return null;
    }
  }, [user, fetchConversations]);

  // Delete conversation with useCallback
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return false;

    try {
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        return false;
      }

      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        return false;
      }

      console.log('Conversation deleted:', conversationId);
      await fetchConversations();
      
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err) {
      console.error('Unexpected error deleting conversation:', err);
      return false;
    }
  }, [user, fetchConversations, currentConversation]);

  // Send message melhorado com logs mais detalhados
  const sendMessage = useCallback(async (content: string, conversationId?: string, attachments?: File[]) => {
    if (!user) return;

    let activeConversationId = conversationId || currentConversation;

    try {
      setIsProcessing(true);

      if (!activeConversationId) {
        const newConversation = await createConversation();
        if (!newConversation) return;
        activeConversationId = newConversation.id;
        setCurrentConversation(activeConversationId);
      }

      // Processar arquivos anexados se houver
      let fullMessage = content;
      if (attachments && attachments.length > 0) {
        console.log(`Processando ${attachments.length} arquivo(s) anexado(s)`);
        const fileContents = await processFiles(attachments);
        fullMessage = content + fileContents;
        console.log('Mensagem completa com anexos preparada, tamanho:', fullMessage.length, 'caracteres');
      }

      const { error: userMessageError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            content: fullMessage,
            role: 'user',
          },
        ]);

      if (userMessageError) {
        console.error('Error sending message:', userMessageError);
        return;
      }

      // Check if this is the first message in the conversation
      const { data: existingMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', activeConversationId);

      if (!messagesError && existingMessages && existingMessages.length === 1) {
        const titleFromMessage = content.length > 50 ? content.substring(0, 50) + '...' : content;
        await supabase
          .from('conversations')
          .update({ title: titleFromMessage })
          .eq('id', activeConversationId);
        
        console.log('Updated conversation title to:', titleFromMessage);
      }

      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }

      console.log('Enviando mensagem para IA, tamanho:', fullMessage.length, 'caracteres');
      
      const { data: aiData, error: aiError } = await supabase.functions.invoke('chat-ai', {
        body: { message: fullMessage }
      });

      let aiResponse = '';
      
      if (aiError) {
        console.error('Error calling AI function:', aiError);
        aiResponse = 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
      } else if (aiData?.response) {
        aiResponse = aiData.response;
        console.log('Resposta da IA recebida, tamanho:', aiResponse.length, 'caracteres');
      } else {
        console.error('No response from AI function:', aiData);
        aiResponse = 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente.';
      }

      await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            content: aiResponse,
            role: 'assistant',
          },
        ]);

      await fetchConversations();

      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }

    } catch (err) {
      console.error('Unexpected error sending message:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentConversation, createConversation, fetchMessages, fetchConversations]);

  // Only fetch conversations when user is available and not already initialized
  useEffect(() => {
    if (user && !initialized) {
      console.log('Initializing conversations for user:', user.id);
      fetchConversations();
    }
  }, [user, initialized, fetchConversations]);

  // Only fetch messages when currentConversation changes and is not null
  useEffect(() => {
    if (currentConversation && user) {
      console.log('Loading messages for conversation:', currentConversation);
      fetchMessages(currentConversation);
    } else if (!currentConversation) {
      setMessages([]);
    }
  }, [currentConversation, fetchMessages, user]);

  // Memoize the return value to prevent unnecessary re-renders
  const memoizedValue = useMemo(() => ({
    conversations,
    messages,
    currentConversation,
    loading,
    isProcessing,
    setCurrentConversation,
    createConversation,
    sendMessage,
    fetchConversations,
    deleteConversation,
  }), [
    conversations,
    messages,
    currentConversation,
    loading,
    isProcessing,
    createConversation,
    sendMessage,
    fetchConversations,
    deleteConversation,
  ]);

  return memoizedValue;
}
