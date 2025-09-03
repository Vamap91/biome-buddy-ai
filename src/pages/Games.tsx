import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  RotateCcw, 
  Trophy, 
  Star,
  ArrowLeft,
  Factory,
  Sprout,
  Eye,
  EyeOff,
  LayoutDashboard,
  BookOpen,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const GamesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  
  // Jogo da Velha States
  const [ticBoard, setTicBoard] = useState(Array(9).fill(null));
  const [ticIsPlayerTurn, setTicIsPlayerTurn] = useState(true);
  const [ticWinner, setTicWinner] = useState(null);
  const [ticGameOver, setTicGameOver] = useState(false);

  // Memory Game States
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryGameWon, setMemoryGameWon] = useState(false);

  // Quiz Game States
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizGameEnded, setQuizGameEnded] = useState(false);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState(null);
  const [quizShowResult, setQuizShowResult] = useState(false);

  // Perguntas do Quiz Eco Kids - Adaptadas para crianças!
  const quizQuestions = [
    {
      id: 1,
      question: "🌳 Qual é o nome da maior floresta do Brasil?",
      options: ["Floresta Mágica", "Floresta Amazônica", "Floresta Encantada", "Floresta dos Sonhos"],
      correct: 1,
      explanation: "Isso mesmo! A Floresta Amazônica é gigantesca e cheia de vida! É como um mundo mágico cheio de animais e plantas incríveis! 🦜🐒"
    },
    {
      id: 2,
      question: "🦥 Qual animal da Amazônia gosta de se mover bem devagar?",
      options: ["Macaco", "Preguiça", "Borboleta", "Peixe"],
      correct: 1,
      explanation: "A preguiça é super fofa e se move devagarzinho para economizar energia! Ela passa a maior parte do tempo dormindo nas árvores! 😴"
    },
    {
      id: 3,
      question: "🌱 O que as plantas fazem que é muito importante para nós?",
      options: ["Produzem ar limpo", "Fazem barulho", "Comem pedras", "Dormem de dia"],
      correct: 0,
      explanation: "Perfeito! As plantas são como pequenas fábricas de ar limpo! Elas pegam o ar sujo e transformam em ar fresquinho para respirarmos! 🌬️"
    },
    {
      id: 4,
      question: "🐆 Qual é o maior felino que vive na Amazônia?",
      options: ["Gato doméstico", "Onça-pintada", "Leão", "Tigre"],
      correct: 1,
      explanation: "A onça-pintada é linda e poderosa! Suas manchinhas são únicas, como se fossem impressões digitais! Ela é a rainha da floresta! 👑"
    },
    {
      id: 5,
      question: "💧 Como você pode ajudar a economizar água?",
      options: ["Escovar os dentes com a torneira fechada", "Deixar a torneira sempre aberta", "Tomar banho de 2 horas", "Desperdiçar água"],
      correct: 0,
      explanation: "Você é um super herói da água! Fechar a torneira enquanto escova os dentes economiza muuuita água! 🦷✨"
    },
    {
      id: 6,
      question: "🦋 Qual processo as borboletas fazem que é mágico?",
      options: ["Voam para a lua", "Se transformam de lagarta em borboleta", "Comem flores", "Mudam de cor"],
      correct: 1,
      explanation: "Que incrível! A metamorfose é como mágica real! A lagartinha se transforma em uma linda borboleta colorida! 🐛➡️🦋"
    },
    {
      id: 7,
      question: "🌊 Qual é o rio mais famoso da Amazônia?",
      options: ["Rio Chocolate", "Rio Amazonas", "Rio Doce", "Rio Alegre"],
      correct: 1,
      explanation: "O Rio Amazonas é gigante! É como uma estrada de água que atravessa toda a floresta, cheia de peixes coloridos! 🐠🌈"
    },
    {
      id: 8,
      question: "♻️ O que significa reciclar?",
      options: ["Jogar lixo no chão", "Transformar lixo em coisas novas", "Quebrar brinquedos", "Sujar a natureza"],
      correct: 1,
      explanation: "Você entendeu! Reciclar é como fazer mágica com o lixo, transformando em coisas novas e úteis! É ser um herói do planeta! 🦸‍♀️"
    },
    {
      id: 9,
      question: "🐦 O que os pássaros da Amazônia adoram fazer?",
      options: ["Assistir TV", "Cantar e voar entre as árvores", "Dirigir carros", "Jogar videogame"],
      correct: 1,
      explanation: "Os passarinhos são os cantores da floresta! Eles fazem um show musical todos os dias e voam como pequenos aviões coloridos! 🎵"
    },
    {
      id: 10,
      question: "🌍 Como podemos ser amigos da natureza?",
      options: ["Plantar flores e árvores", "Poluir os rios", "Assustar os animais", "Cortar todas as plantas"],
      correct: 0,
      explanation: "Isso aí, pequeno jardineiro! Plantar é como dar presentes para a Terra! Cada plantinha que cresce deixa o mundo mais bonito e feliz! 🌺"
    },
    {
      id: 11,
      question: "🐸 Onde vivem os sapos da Amazônia?",
      options: ["Na lua", "Perto da água e nas árvores", "No deserto", "Na neve"],
      correct: 1,
      explanation: "Os sapinhos adoram lugares úmidos! Alguns vivem na água, outros nas árvores. Eles são pequenos guardiões da floresta! 🌿"
    },
    {
      id: 12,
      question: "🌙 O que acontece na floresta à noite?",
      options: ["Tudo para", "Os animais noturnos acordam", "As plantas dormem", "Fica silêncio total"],
      correct: 1,
      explanation: "A noite é quando os animais noturnos fazem festa! Corujas, morcegos e outros bichinhos saem para brincar na escuridão! 🦉"
    }
  ];

  // Dados dos animais brasileiros
  const animalFacts = [
    { id: 1, animal: '🦜', name: t('blueParrot'), fact: t('blueParrotFact') },
    { id: 2, animal: '🐆', name: t('jaguar'), fact: t('jaguarFact') },
    { id: 3, animal: '🦥', name: t('sloth'), fact: t('slothFact') },
    { id: 4, animal: '🐢', name: t('seaTurtle'), fact: t('seaTurtleFact') },
    { id: 5, animal: '🦋', name: t('blueButterfly'), fact: t('blueButterflyFact') },
    { id: 6, animal: '🐸', name: t('toad'), fact: t('toadFact') }
  ];

  const ecoTips = [
    t('ecoTip1'),
    t('ecoTip2'),
    t('ecoTip3'),
    t('ecoTip4'),
    t('ecoTip5'),
    t('ecoTip6')
  ];

  // Funções do Jogo da Velha
  const checkTicTacToeWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
      [0, 4, 8], [2, 4, 6] // diagonais
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // AI Logic for Tic Tac Toe
  const makeAIMove = (board) => {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board];
        testBoard[i] = '🏭';
        if (checkTicTacToeWinner(testBoard) === '🏭') {
          return i;
        }
      }
    }

    // Check if AI needs to block player
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board];
        testBoard[i] = '🌱';
        if (checkTicTacToeWinner(testBoard) === '🌱') {
          return i;
        }
      }
    }

    // Take center if available
    if (!board[4]) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => !board[corner]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available spot
    const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(spot => spot !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
  };

  const handleTicTacToeClick = (index) => {
    if (ticBoard[index] || ticWinner || ticGameOver || !ticIsPlayerTurn) return;
    
    const newBoard = [...ticBoard];
    newBoard[index] = '🌱'; // Player is always 🌱
    setTicBoard(newBoard);
    
    const winner = checkTicTacToeWinner(newBoard);
    if (winner) {
      setTicWinner(winner);
      setTicGameOver(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setTicGameOver(true);
    } else {
      setTicIsPlayerTurn(false); // Switch to AI turn
    }
  };

  // AI Move Effect
  useEffect(() => {
    if (!ticIsPlayerTurn && !ticWinner && !ticGameOver) {
      const timer = setTimeout(() => {
        const aiMoveIndex = makeAIMove(ticBoard);
        if (aiMoveIndex !== undefined) {
          const newBoard = [...ticBoard];
          newBoard[aiMoveIndex] = '🏭';
          setTicBoard(newBoard);
          
          const winner = checkTicTacToeWinner(newBoard);
          if (winner) {
            setTicWinner(winner);
            setTicGameOver(true);
          } else if (newBoard.every(cell => cell !== null)) {
            setTicGameOver(true);
          } else {
            setTicIsPlayerTurn(true); // Switch back to player
          }
        }
      }, 800); // AI thinks for 800ms

      return () => clearTimeout(timer);
    }
  }, [ticIsPlayerTurn, ticBoard, ticWinner, ticGameOver]);

  const resetTicTacToe = () => {
    setTicBoard(Array(9).fill(null));
    setTicIsPlayerTurn(true);
    setTicWinner(null);
    setTicGameOver(false);
  };

  // Funções do Jogo da Memória
  const initializeMemoryGame = () => {
    const shuffledAnimals = [...animalFacts, ...animalFacts]
      .map((item, index) => ({ ...item, uniqueId: index }))
      .sort(() => Math.random() - 0.5);
    
    setMemoryCards(shuffledAnimals);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
    setMemoryGameWon(false);
  };

  const handleMemoryCardClick = (cardIndex) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedPairs.includes(memoryCards[cardIndex].id)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      const [first, second] = newFlippedCards;
      
      if (memoryCards[first].id === memoryCards[second].id) {
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, memoryCards[first].id]);
          setFlippedCards([]);
          
          if (matchedPairs.length + 1 === animalFacts.length) {
            setMemoryGameWon(true);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  // Funções do Quiz
  const resetQuiz = () => {
    setQuizCurrentQuestion(0);
    setQuizScore(0);
    setQuizGameEnded(false);
    setQuizSelectedAnswer(null);
    setQuizShowResult(false);
  };

  const handleQuizAnswer = (answerIndex) => {
    if (quizSelectedAnswer !== null) return; // Prevent multiple clicks
    
    setQuizSelectedAnswer(answerIndex);
    setQuizShowResult(true);
    
    // Check if answer is correct
    const isCorrect = answerIndex === quizQuestions[quizCurrentQuestion].correct;
    if (isCorrect) {
      setQuizScore(quizScore + 10); // 10 points per correct answer
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (quizCurrentQuestion < quizQuestions.length - 1) {
        setQuizCurrentQuestion(quizCurrentQuestion + 1);
        setQuizSelectedAnswer(null);
        setQuizShowResult(false);
      } else {
        setQuizGameEnded(true);
      }
    }, 2500);
  };

  const getScoreBadge = (score) => {
    const maxScore = quizQuestions.length * 10;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return { 
      emoji: '🏆', 
      title: 'Super Especialista Eco!', 
      color: 'text-yellow-600',
      message: 'Uau! Você sabe tudo sobre a natureza! É um verdadeiro guardião da floresta! 🌳✨'
    };
    if (percentage >= 70) return { 
      emoji: '🌟', 
      title: 'Defensor da Amazônia!', 
      color: 'text-green-600',
      message: 'Fantástico! Você conhece muito bem nossos amigos da floresta! 🦜🐒'
    };
    if (percentage >= 50) return { 
      emoji: '🌱', 
      title: 'Pequeno Ecologista!', 
      color: 'text-green-500',
      message: 'Muito bem! Você já sabe bastante sobre como cuidar da natureza! 🌿💚'
    };
    return { 
      emoji: '🌿', 
      title: 'Explorador da Natureza!', 
      color: 'text-green-400',
      message: 'Que legal! Você está começando a descobrir os segredos da floresta! Continue explorando! 🔍🦋'
    };
  };

  useEffect(() => {
    if (selectedGame === 'memory') {
      initializeMemoryGame();
    } else if (selectedGame === 'quiz') {
      resetQuiz();
    }
  }, [selectedGame]);

  const GameSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-nature-light to-nature-medium p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('ecoGames')}</h1>
              <p className="text-muted-foreground">{t('ecoGamesSubtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => navigate('/blog')} variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Jogo da Velha */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🌳</div>
              <CardTitle className="text-xl text-primary">{t('ecoTicTacToe')}</CardTitle>
              <p className="text-muted-foreground text-sm">🌱 vs 🏭 • {t('gameTime23min')}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('ticTacToeDescription')}
              </p>
              <Button 
                onClick={() => setSelectedGame('tictactoe')}
                className="w-full"
              >
                {t('playNow')}
              </Button>
            </CardContent>
          </Card>

          {/* Caça às Espécies */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🦋</div>
              <CardTitle className="text-xl text-primary">{t('speciesHunt')}</CardTitle>
              <p className="text-muted-foreground text-sm">{t('cardsCount')} • {t('gameTime34min')}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('memoryGameDescription')}
              </p>
              <Button 
                onClick={() => setSelectedGame('memory')}
                className="w-full"
              >
                {t('playNow')}
              </Button>
            </CardContent>
          </Card>

          {/* Quiz Eco Kids */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🌱</div>
              <CardTitle className="text-xl text-primary">Quiz Eco Kids</CardTitle>
              <p className="text-muted-foreground text-sm">12 perguntas • 6-10 min</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                🌟 Aventura educativa pela Amazônia! Descubra curiosidades incríveis sobre nossos amiguinhos da floresta! 🦋🐒
              </p>
              <Button 
                onClick={() => setSelectedGame('quiz')}
                className="w-full"
              >
                Jogar Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const TicTacToeGame = () => (
    <div className="min-h-screen bg-gradient-to-br from-nature-light to-nature-medium p-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedGame(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('goBack')}</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => navigate('/blog')} variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-primary">🌳 {t('ecoTicTacToe')}</h2>
          <Button onClick={resetTicTacToe} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('restart')}
          </Button>
        </header>

        <Card className="p-6">
          <div className="text-center mb-6">
            {!ticGameOver ? (
              <div className="space-y-2">
                <p className="text-lg">
                  {t('turnOf')}: <span className="font-bold">{ticIsPlayerTurn ? `🌱 ${t('you')}` : `🏭 ${t('ai')}`}</span>
                </p>
                {!ticIsPlayerTurn && (
                  <p className="text-sm text-muted-foreground animate-pulse">
                    🤖 IA está pensando...
                  </p>
                )}
              </div>
            ) : ticWinner ? (
              <div className="space-y-4">
                <p className="text-xl font-bold text-success">
                  {ticWinner === '🌱' ? `🎉 ${t('youWon')}` : `🤖 ${t('aiWon')}`}
                </p>
                {ticWinner === '🌱' && (
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <p className="text-success font-medium">💡 {t('ecoTip')}:</p>
                    <p className="text-success/80">{ecoTips[Math.floor(Math.random() * ecoTips.length)]}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lg text-muted-foreground">{t('tie')} 🤝</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
            {ticBoard.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleTicTacToeClick(index)}
                className={`w-20 h-20 bg-card border-2 border-border rounded-lg text-3xl transition-colors flex items-center justify-center ${
                  ticGameOver || !ticIsPlayerTurn 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:bg-accent cursor-pointer'
                }`}
                disabled={ticGameOver || !ticIsPlayerTurn || cell !== null}
              >
                {cell}
              </button>
            ))}
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Sprout className="h-4 w-4 mr-1" />
                {t('youNature')}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Factory className="h-4 w-4 mr-1" />
                {t('aiIndustry')}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const MemoryGame = () => (
    <div className="min-h-screen bg-gradient-to-br from-nature-light to-nature-medium p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedGame(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('goBack')}</span>
          </Button>
          <h2 className="text-2xl font-bold text-primary">🦋 {t('speciesHunt')}</h2>
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              {t('moves')}: {memoryMoves}
            </Badge>
            <br />
            <Button onClick={initializeMemoryGame} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('restart')}
            </Button>
          </div>
        </header>

        {memoryGameWon && (
          <Card className="mb-6 bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-success mb-2">{t('congratulations')}</h3>
              <p className="text-success/80">{t('foundAllSpecies').replace('{moves}', memoryMoves.toString())}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
          {memoryCards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.id);
            const isMatched = matchedPairs.includes(card.id);
            
            return (
              <button
                key={card.uniqueId}
                onClick={() => handleMemoryCardClick(index)}
                className={`aspect-square bg-card border-2 rounded-lg text-4xl transition-all duration-300 flex items-center justify-center ${
                  isMatched 
                    ? 'border-success bg-success/10' 
                    : isFlipped 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary hover:bg-accent'
                }`}
                disabled={memoryGameWon}
              >
                {isFlipped ? card.animal : '❓'}
              </button>
            );
          })}
        </div>

        {/* Fatos dos animais encontrados */}
        {matchedPairs.length > 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center">
                <Star className="h-5 w-5 mr-2" />
                {t('discoveredSpecies')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {animalFacts
                  .filter(animal => matchedPairs.includes(animal.id))
                  .map(animal => (
                    <div key={animal.id} className="bg-success/10 p-3 rounded-lg border border-success/20">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{animal.animal}</span>
                        <div>
                          <h4 className="font-semibold text-success">{animal.name}</h4>
                          <p className="text-success/80 text-sm">{animal.fact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const QuizGame = () => {
    const currentQuestion = quizQuestions[quizCurrentQuestion];
    const scoreBadge = getScoreBadge(quizScore);
    
    if (quizGameEnded) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-nature-light to-nature-medium p-4">
          <div className="max-w-2xl mx-auto">
            <header className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedGame(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <h2 className="text-2xl font-bold text-primary">🌱 Quiz Eco Kids</h2>
              <Button onClick={resetQuiz} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Jogar Novamente
              </Button>
            </header>

            <Card className="p-8 text-center animate-in fade-in scale-in duration-500">
              <div className="space-y-6">
                <div className="text-6xl mb-4 animate-pulse">{scoreBadge.emoji}</div>
                <h3 className={`text-2xl font-bold ${scoreBadge.color} animate-in slide-in-from-bottom-2 duration-700`}>
                  {scoreBadge.title}
                </h3>
                <div className="space-y-2 animate-in slide-in-from-bottom-3 duration-700">
                  <p className="text-3xl font-bold text-primary">
                    {quizScore} / {quizQuestions.length * 10} pontos
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Você acertou {Math.round((quizScore / (quizQuestions.length * 10)) * 100)}% das perguntas!
                  </p>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 animate-in slide-in-from-bottom-4 duration-700">
                  <p className="text-primary font-medium">{scoreBadge.message}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 animate-in slide-in-from-bottom-5 duration-700">
                  <p className="text-blue-600 font-medium">🌍 Curiosidade Amazônica!</p>
                  <p className="text-blue-600/80 text-sm mt-2">
                    A Floresta Amazônica é tão grande que pode ser vista do espaço! Ela tem mais de 40.000 espécies de plantas e é lar de mais de 1.300 espécies de pássaros! 🦜✨
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetQuiz} size="lg">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Button onClick={() => setSelectedGame(null)} variant="outline" size="lg">
                    Outros Jogos
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-nature-light to-nature-medium p-4">
        <div className="max-w-2xl mx-auto">
          <header className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedGame(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <h2 className="text-2xl font-bold text-primary">🌱 Quiz Eco Kids</h2>
            <div className="text-right">
              <Badge variant="outline" className="mb-1">
                <Trophy className="h-3 w-3 mr-1" />
                {quizScore} pontos
              </Badge>
              <br />
              <Badge variant="secondary">
                {quizCurrentQuestion + 1} / {quizQuestions.length}
              </Badge>
            </div>
          </header>

          <Card className="p-6">
            <div className="space-y-6">
              {/* Progresso */}
              <div className="w-full bg-accent rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((quizCurrentQuestion + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Pergunta */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Opções de Resposta */}
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-300 hover-scale ";
                  let emoji = "";
                  
                  if (quizShowResult) {
                    if (index === currentQuestion.correct) {
                      buttonClass += "border-green-500 bg-green-50 text-green-700 animate-in scale-in duration-300";
                      emoji = "✅ ";
                    } else if (index === quizSelectedAnswer && index !== currentQuestion.correct) {
                      buttonClass += "border-red-500 bg-red-50 text-red-700 animate-in fade-in duration-300";
                      emoji = "❌ ";
                    } else {
                      buttonClass += "border-border bg-muted/50 text-muted-foreground opacity-60";
                    }
                  } else {
                    buttonClass += "border-border bg-card hover:border-primary hover:bg-primary/10 text-foreground hover:shadow-md";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      className={buttonClass}
                      disabled={quizShowResult}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold bg-white/50">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-base">
                          {emoji}{option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explicação da Resposta */}
              {quizShowResult && (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 animate-in slide-in-from-bottom-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-xl">
                      {quizSelectedAnswer === currentQuestion.correct ? '🎉' : '🤔'}
                    </span>
                    <div>
                      <p className="font-medium text-primary">
                        {quizSelectedAnswer === currentQuestion.correct ? 'Parabéns!' : 'Quase lá!'}
                      </p>
                      <p className="text-primary/80 text-sm">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Render principal
  if (selectedGame === 'tictactoe') {
    return <TicTacToeGame />;
  } else if (selectedGame === 'memory') {
    return <MemoryGame />;
  } else if (selectedGame === 'quiz') {
    return <QuizGame />;
  } else {
    return <GameSelection />;
  }
};

export default GamesPage;
