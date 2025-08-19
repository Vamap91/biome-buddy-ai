
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'pt' | 'en';
  toggleLanguage: () => void;
  setLanguage: (lang: 'pt' | 'en') => void;
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
    readyToExplore: 'Pronto para explorar a biodiversidade com IA avançada?',
    // Settings page translations
    managePreferences: 'Gerencie suas preferências e informações',
    backToDashboard: 'Voltar ao Dashboard',
    personalInfo: 'Informações Pessoais',
    updatePersonalInfo: 'Atualize suas informações pessoais',
    fullName: 'Nome Completo',
    enterFullName: 'Digite seu nome completo',
    birthDate: 'Data de Nascimento',
    selectDate: 'Selecione uma data',
    currentPlan: 'Plano Atual',
    subscriptionInfo: 'Informações sobre sua assinatura',
    freePlan: 'Plano Gratuito',
    limitedAccess: 'Acesso limitado às funcionalidades básicas',
    upgrade: 'Fazer Upgrade',
    conversationsPerMonth: '10 conversas por mês',
    basicSupport: 'Suporte básico',
    essentialFeatures: 'Funcionalidades essenciais',
    language: 'Idioma',
    chooseLanguage: 'Escolha o idioma da interface',
    selectLanguage: 'Selecione o idioma',
    portuguese: 'Português',
    english: 'English',
    manageData: 'Gerenciar Dados',
    clearHistory: 'Limpe seu histórico de conversas',
    dangerZone: 'Zona de Perigo',
    clearHistoryWarning: 'Esta ação não pode ser desfeita. Isso irá permanentemente deletar todas as suas conversas e mensagens.',
    clearing: 'Limpando...',
    clearAllHistory: 'Limpar Todo Histórico',
    areYouSure: 'Você tem certeza?',
    clearHistoryConfirmation: 'Esta ação não pode ser desfeita. Isso irá permanentemente deletar todas as suas conversas e mensagens do sistema.',
    cancel: 'Cancelar',
    yesClearAll: 'Sim, limpar tudo',
    logoutAccount: 'Sair da Conta',
    saveChanges: 'Salvar Alterações',
    profileUpdatedSuccess: 'Perfil atualizado com sucesso!',
    informationSaved: 'Suas informações foram salvas.',
    errorUpdatingProfile: 'Erro ao atualizar perfil',
    tryAgainLater: 'Tente novamente mais tarde.',
    historyCleared: 'Histórico limpo com sucesso!',
    allConversationsRemoved: 'Todas as conversas foram removidas.',
    errorClearingHistory: 'Erro ao limpar histórico'
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
    readyToExplore: 'Ready to explore biodiversity with advanced AI?',
    // Settings page translations
    managePreferences: 'Manage your preferences and information',
    backToDashboard: 'Back to Dashboard',
    personalInfo: 'Personal Information',
    updatePersonalInfo: 'Update your personal information',
    fullName: 'Full Name',
    enterFullName: 'Enter your full name',
    birthDate: 'Birth Date',
    selectDate: 'Select a date',
    currentPlan: 'Current Plan',
    subscriptionInfo: 'Information about your subscription',
    freePlan: 'Free Plan',
    limitedAccess: 'Limited access to basic features',
    upgrade: 'Upgrade',
    conversationsPerMonth: '10 conversations per month',
    basicSupport: 'Basic support',
    essentialFeatures: 'Essential features',
    language: 'Language',
    chooseLanguage: 'Choose the interface language',
    selectLanguage: 'Select language',
    portuguese: 'Português',
    english: 'English',
    manageData: 'Manage Data',
    clearHistory: 'Clear your conversation history',
    dangerZone: 'Danger Zone',
    clearHistoryWarning: 'This action cannot be undone. This will permanently delete all your conversations and messages.',
    clearing: 'Clearing...',
    clearAllHistory: 'Clear All History',
    areYouSure: 'Are you sure?',
    clearHistoryConfirmation: 'This action cannot be undone. This will permanently delete all your conversations and messages from the system.',
    cancel: 'Cancel',
    yesClearAll: 'Yes, clear everything',
    logoutAccount: 'Logout Account',
    saveChanges: 'Save Changes',
    profileUpdatedSuccess: 'Profile updated successfully!',
    informationSaved: 'Your information has been saved.',
    errorUpdatingProfile: 'Error updating profile',
    tryAgainLater: 'Please try again later.',
    historyCleared: 'History cleared successfully!',
    allConversationsRemoved: 'All conversations have been removed.',
    errorClearingHistory: 'Error clearing history'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<'pt' | 'en'>(() => {
    // Load language from localStorage or default to 'pt'
    const savedLanguage = localStorage.getItem('language') as 'pt' | 'en';
    return savedLanguage || 'pt';
  });

  const setLanguage = (lang: 'pt' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
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
