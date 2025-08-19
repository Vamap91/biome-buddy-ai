
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
    errorClearingHistory: 'Erro ao limpar histórico',
    processing: 'Processando...',
    aiThinking: 'Dr_C está pensando...',
    chatPlaceholder: 'Digite sua pergunta sobre biodiversidade...',
    enterToSend: 'Pressione Enter para enviar, Shift+Enter para nova linha',
    attachFile: 'Anexar arquivo',
    analyzing: 'Analisando',
    // Games translations
    games: 'Jogos',
    ecoGames: 'Jogos Ecológicos',
    ecoGamesSubtitle: 'Divirta-se aprendendo sobre meio ambiente! 🌱',
    ecoTicTacToe: 'Jogo da Velha Ecológico',
    speciesHunt: 'Caça às Espécies',
    playNow: 'Jogar Agora',
    gameTime23min: '2-3 minutos',
    gameTime34min: '3-4 minutos',
    cardsCount: '12 cartas',
    ticTacToeDescription: 'Desafie a IA em um jogo da velha especial! Use plantas 🌱 contra fábricas 🏭 e aprenda dicas ambientais quando vencer!',
    memoryGameDescription: 'Encontre pares de animais brasileiros escondidos! Cada par revela fatos curiosos sobre nossa biodiversidade.',
    goBack: 'Voltar',
    restart: 'Reiniciar',
    turnOf: 'Vez de',
    you: 'Você',
    ai: 'IA',
    youWon: 'Você venceu!',
    aiWon: 'IA venceu!',
    tie: 'Empate!',
    ecoTip: 'Dica Ambiental',
    youNature: 'Você (Natureza)',
    aiIndustry: 'IA (Indústria)',
    moves: 'Movimentos',
    congratulations: 'Parabéns!',
    foundAllSpecies: 'Você encontrou todas as espécies em {moves} movimentos!',
    discoveredSpecies: 'Espécies Descobertas',
    // Animal facts
    blueParrot: 'Arara-azul',
    blueParrotFact: 'Pode viver mais de 50 anos e é símbolo do Pantanal!',
    jaguar: 'Onça-pintada',
    jaguarFact: 'É o maior felino das Américas e excelente nadadora!',
    sloth: 'Preguiça',
    slothFact: 'Move-se tão devagar que algas crescem em seu pelo!',
    seaTurtle: 'Tartaruga-marinha',
    seaTurtleFact: 'Usa campos magnéticos da Terra para navegar!',
    blueButterfly: 'Borboleta-azul',
    blueButterflyFact: 'Algumas espécies migram milhares de quilômetros!',
    toad: 'Sapo-cururu',
    toadFact: 'Sua pele produz substâncias que podem virar remédios!',
    // Eco tips
    ecoTip1: '🌱 Plantar uma árvore pode absorver até 22kg de CO2 por ano!',
    ecoTip2: '💧 Fechar a torneira ao escovar os dentes economiza até 80 litros de água!',
    ecoTip3: '♻️ Reciclar uma lata de alumínio economiza energia suficiente para 3 horas de TV!',
    ecoTip4: '🚲 Usar bicicleta por 10km evita a emissão de 2,6kg de CO2!',
    ecoTip5: '🌞 Energia solar pode reduzir sua conta de luz em até 95%!',
    ecoTip6: '🌿 Compostagem doméstica reduz 30% do lixo orgânico!',
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
    errorClearingHistory: 'Error clearing history',
    processing: 'Processing...',
    aiThinking: 'Dr_C is thinking...',
    chatPlaceholder: 'Type your question about biodiversity...',
    enterToSend: 'Press Enter to send, Shift+Enter for new line',
    attachFile: 'Attach file',
    analyzing: 'Analyzing',
    // Games translations
    games: 'Games',
    ecoGames: 'Ecological Games',
    ecoGamesSubtitle: 'Have fun learning about the environment! 🌱',
    ecoTicTacToe: 'Ecological Tic Tac Toe',
    speciesHunt: 'Species Hunt',
    playNow: 'Play Now',
    gameTime23min: '2-3 minutes',
    gameTime34min: '3-4 minutes',
    cardsCount: '12 cards',
    ticTacToeDescription: 'Challenge the AI in a special tic-tac-toe game! Use plants 🌱 against factories 🏭 and learn environmental tips when you win!',
    memoryGameDescription: 'Find hidden pairs of Brazilian animals! Each pair reveals curious facts about our biodiversity.',
    goBack: 'Go Back',
    restart: 'Restart',
    turnOf: 'Turn of',
    you: 'You',
    ai: 'AI',
    youWon: 'You won!',
    aiWon: 'AI won!',
    tie: 'Tie!',
    ecoTip: 'Environmental Tip',
    youNature: 'You (Nature)',
    aiIndustry: 'AI (Industry)',
    moves: 'Moves',
    congratulations: 'Congratulations!',
    foundAllSpecies: 'You found all species in {moves} moves!',
    discoveredSpecies: 'Discovered Species',
    // Animal facts
    blueParrot: 'Blue Parrot',
    blueParrotFact: 'Can live over 50 years and is a symbol of the Pantanal!',
    jaguar: 'Jaguar',
    jaguarFact: 'Is the largest feline in the Americas and an excellent swimmer!',
    sloth: 'Sloth',
    slothFact: 'Moves so slowly that algae grow on its fur!',
    seaTurtle: 'Sea Turtle',
    seaTurtleFact: 'Uses Earth\'s magnetic fields to navigate!',
    blueButterfly: 'Blue Butterfly',
    blueButterflyFact: 'Some species migrate thousands of kilometers!',
    toad: 'Toad',
    toadFact: 'Its skin produces substances that can become medicines!',
    // Eco tips
    ecoTip1: '🌱 Planting a tree can absorb up to 22kg of CO2 per year!',
    ecoTip2: '💧 Turning off the tap while brushing teeth saves up to 80 liters of water!',
    ecoTip3: '♻️ Recycling an aluminum can saves enough energy for 3 hours of TV!',
    ecoTip4: '🚲 Using a bicycle for 10km prevents the emission of 2.6kg of CO2!',
    ecoTip5: '🌞 Solar energy can reduce your electricity bill by up to 95%!',
    ecoTip6: '🌿 Home composting reduces 30% of organic waste!',
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
