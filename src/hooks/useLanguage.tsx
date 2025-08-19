
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'pt' | 'en';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    welcome: 'Bem-vindo',
    dashboard: 'Dashboard',
    chatAI: 'Chat IA',
    settings: 'Configurações',
    logout: 'Sair',
    startNewConversation: 'Iniciar Nova Conversa',
    conversationsToday: 'Conversas Hoje',
    queriesPerformed: 'Queries Realizadas',
    tokensUsed: 'Tokens Utilizados',
    recentActivity: 'Atividade Recente',
    quickStats: 'Estatísticas Rápidas',
    online: 'Online',
    user: 'Usuário',
    readyToExplore: 'Pronto para explorar a biodiversidade com IA avançada?'
  },
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    chatAI: 'AI Chat',
    settings: 'Settings',
    logout: 'Logout',
    startNewConversation: 'Start New Conversation',
    conversationsToday: 'Conversations Today',
    queriesPerformed: 'Queries Performed',
    tokensUsed: 'Tokens Used',
    recentActivity: 'Recent Activity',
    quickStats: 'Quick Stats',
    online: 'Online',
    user: 'User',
    readyToExplore: 'Ready to explore biodiversity with advanced AI?'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
