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

  // Recicla Hero States
  const [recycleGameState, setRecycleGameState] = useState('start');
  const [recycleScore, setRecycleScore] = useState(0);
  const [recycleLevel, setRecycleLevel] = useState(1);
  const [recycleLives, setRecycleLives] = useState(3);
  const [recycleTimeLeft, setRecycleTimeLeft] = useState(60);
  const [recycleCombo, setRecycleCombo] = useState(0);
  const [recycleMaxCombo, setRecycleMaxCombo] = useState(0);
  const [fallingTrash, setFallingTrash] = useState([]);
  const [recycleParticles, setRecycleParticles] = useState([]);
  const [recyclePowerUps, setRecyclePowerUps] = useState([]);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

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

  // Configurações do Recicla Hero
  const TRASH_TYPES = {
    plastic: {
      items: [
        { emoji: '🥤', name: 'Copo Plástico', points: 10 },
        { emoji: '🍶', name: 'Garrafa PET', points: 15 },
        { emoji: '🛍️', name: 'Sacola Plástica', points: 12 },
        { emoji: '🧴', name: 'Frasco de Shampoo', points: 18 }
      ],
      color: '#FF6B6B',
      binEmoji: '♻️'
    },
    paper: {
      items: [
        { emoji: '📄', name: 'Folha de Papel', points: 8 },
        { emoji: '📦', name: 'Caixa de Papelão', points: 12 },
        { emoji: '📰', name: 'Jornal', points: 10 },
        { emoji: '📚', name: 'Revista', points: 9 }
      ],
      color: '#4ECDC4',
      binEmoji: '📄'
    },
    glass: {
      items: [
        { emoji: '🍺', name: 'Garrafa de Vidro', points: 20 },
        { emoji: '🏺', name: 'Pote de Vidro', points: 18 },
        { emoji: '🥛', name: 'Copo de Vidro', points: 15 }
      ],
      color: '#45B7D1',
      binEmoji: '🗂️'
    },
    metal: {
      items: [
        { emoji: '🥫', name: 'Lata de Alumínio', points: 25 },
        { emoji: '🔧', name: 'Ferramenta Velha', points: 30 },
        { emoji: '📎', name: 'Clipe de Metal', points: 12 }
      ],
      color: '#96CEB4',
      binEmoji: '⚙️'
    },
    organic: {
      items: [
        { emoji: '🍌', name: 'Casca de Banana', points: 8 },
        { emoji: '🍎', name: 'Resto de Maçã', points: 7 },
        { emoji: '🥕', name: 'Cascas de Cenoura', points: 6 },
        { emoji: '🥔', name: 'Casca de Batata', points: 9 }
      ],
      color: '#F7DC6F',
      binEmoji: '🌱'
    }
  };

  const POWER_UPS = {
    slowTime: { name: 'Tempo Lento', icon: '⏰', duration: 5000 },
    doublePoints: { name: 'Pontos Duplos', icon: '⭐', duration: 8000 },
    magnetBin: { name: 'Ímã Mágico', icon: '🧲', duration: 6000 },
    trashStop: { name: 'Para-Lixo', icon: '🛑', duration: 3000 }
  };

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

  useEffect(() => {
    if (selectedGame === 'memory') {
      initializeMemoryGame();
    } else if (selectedGame === 'recycle') {
      initializeRecycleGame();
    }
  }, [selectedGame]);

  // Funções do Recicla Hero
  const initializeRecycleGame = () => {
    setRecycleGameState('playing');
    setRecycleScore(0);
    setRecycleLevel(1);
    setRecycleLives(3);
    setRecycleTimeLeft(60);
    setRecycleCombo(0);
    setRecycleMaxCombo(0);
    setFallingTrash([]);
    setRecycleParticles([]);
    setRecyclePowerUps([]);
    setActivePowerUp(null);
    setDraggedItem(null);
  };

  const resetRecycleGame = () => {
    initializeRecycleGame();
  };

  const spawnTrash = () => {
    const trashTypeKeys = Object.keys(TRASH_TYPES);
    const availableTypes = trashTypeKeys.slice(0, Math.min(2 + recycleLevel, trashTypeKeys.length));
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const typeData = TRASH_TYPES[randomType];
    const randomItem = typeData.items[Math.floor(Math.random() * typeData.items.length)];
    
    const newTrash = {
      id: Date.now() + Math.random(),
      type: randomType,
      ...randomItem,
      x: Math.random() * (window.innerWidth - 100),
      y: -60,
      speed: 2 + recycleLevel * 0.5,
      rotation: Math.random() * 360,
      isDragging: false
    };
    
    setFallingTrash(prev => [...prev, newTrash]);
  };

  const handleTrashDrop = (trashId, binType) => {
    const trashItem = fallingTrash.find(item => item.id === trashId);
    if (!trashItem) return;

    const isCorrect = trashItem.type === binType;
    
    if (isCorrect) {
      const basePoints = trashItem.points;
      const comboMultiplier = Math.min(1 + (recycleCombo * 0.5), 3);
      const finalPoints = Math.floor(basePoints * comboMultiplier * (activePowerUp?.type === 'doublePoints' ? 2 : 1));
      
      setRecycleScore(prev => prev + finalPoints);
      setRecycleCombo(prev => prev + 1);
      setRecycleMaxCombo(prev => Math.max(prev, recycleCombo + 1));
      
      // Criar efeito de partículas
      setRecycleParticles(prev => [...prev, {
        id: Date.now(),
        x: trashItem.x,
        y: trashItem.y,
        points: finalPoints,
        type: trashItem.type
      }]);
      
      // Remover partículas após animação
      setTimeout(() => {
        setRecycleParticles(prev => prev.filter(p => p.id !== Date.now()));
      }, 1000);
      
    } else {
      setRecycleCombo(0);
      setRecycleLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setRecycleGameState('gameOver');
        }
        return newLives;
      });
    }
    
    // Remover item do jogo
    setFallingTrash(prev => prev.filter(item => item.id !== trashId));
  };

  // Game loop do Recicla Hero - Movimento dos itens
  useEffect(() => {
    if (recycleGameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Mover lixos para baixo
      setFallingTrash(prev => {
        const updated = prev.map(item => ({
          ...item,
          y: item.y + (activePowerUp?.type === 'slowTime' ? item.speed * 0.5 : item.speed),
          rotation: item.rotation + 2
        })).filter(item => {
          // Remover itens que saíram da tela
          if (item.y > window.innerHeight) {
            if (!item.isDragging) {
              setRecycleLives(current => {
                const newLives = current - 1;
                if (newLives <= 0) {
                  setRecycleGameState('gameOver');
                }
                return newLives;
              });
              setRecycleCombo(0);
            }
            return false;
          }
          return true;
        });
        
        return updated;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [recycleGameState, activePowerUp]);

  // Timer do jogo - separado para contar segundos reais
  useEffect(() => {
    if (recycleGameState !== 'playing') return;

    const timerInterval = setInterval(() => {
      setRecycleTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setRecycleGameState('gameOver');
        }
        return newTime;
      });
    }, 1000); // 1000ms = 1 segundo real

    return () => clearInterval(timerInterval);
  }, [recycleGameState]);

  // Spawn de lixo
  useEffect(() => {
    if (recycleGameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      if (activePowerUp?.type !== 'trashStop') {
        spawnTrash();
      }
    }, Math.max(1000 - (recycleLevel * 100), 400));

    return () => clearInterval(spawnInterval);
  }, [recycleGameState, recycleLevel, activePowerUp]);

  // Spawn de power-ups
  useEffect(() => {
    if (recycleGameState !== 'playing') return;

    const powerUpInterval = setInterval(() => {
      if (Math.random() < 0.15 && recyclePowerUps.length < 2) {
        const powerUpTypes = Object.keys(POWER_UPS);
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        setRecyclePowerUps(prev => [...prev, {
          id: Date.now(),
          type: randomType,
          x: Math.random() * (window.innerWidth - 60),
          y: -40,
          speed: 1.5
        }]);
      }
    }, 5000);

    return () => clearInterval(powerUpInterval);
  }, [recycleGameState, recyclePowerUps]);

  const activatePowerUp = (powerUpId, powerUpType) => {
    setActivePowerUp({ type: powerUpType, timeLeft: POWER_UPS[powerUpType].duration });
    setRecyclePowerUps(prev => prev.filter(p => p.id !== powerUpId));
    
    // Timer do power-up
    setTimeout(() => {
      setActivePowerUp(null);
    }, POWER_UPS[powerUpType].duration);
  };

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

        <div className="grid md:grid-cols-3 gap-6">
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

          {/* Recicla Hero */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">♻️</div>
              <CardTitle className="text-xl text-primary">{t('recyclaHero')}</CardTitle>
              <p className="text-muted-foreground text-sm">{t('dragDrop')} • {t('gameTime25min')}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('recyclaHeroDescription')}
              </p>
              <Button 
                onClick={() => setSelectedGame('recycle')}
                className="w-full"
              >
                {t('playNow')}
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

  const ReciclaHeroGame = () => (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-200 to-green-200 p-4 relative overflow-hidden">
      {/* Header do jogo */}
      <header className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedGame(null)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('goBack')}</span>
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">♻️ {t('recyclaHero')}</h2>
          <p className="text-sm text-muted-foreground">{t('savePlanet')}</p>
        </div>
        
        <Button onClick={resetRecycleGame} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          {t('restart')}
        </Button>
      </header>

      {/* HUD do jogo */}
      <div className="flex justify-between items-center mb-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg font-bold px-3 py-1">
            🏆 {recycleScore}
          </Badge>
          {recycleCombo > 2 && (
            <Badge variant="outline" className="text-sm font-bold px-2 py-1 bg-yellow-100 border-yellow-300">
              🔥 {t('combo')} x{recycleCombo}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-2 py-1">
            ⏱️ {recycleTimeLeft}s
          </Badge>
          <Badge variant="outline" className="px-2 py-1">
            ❤️ {recycleLives}
          </Badge>
          <Badge variant="outline" className="px-2 py-1">
            {t('level')} {recycleLevel}
          </Badge>
        </div>
      </div>

      {/* Power-up ativo */}
      {activePowerUp && (
        <div className="fixed top-20 right-4 bg-purple-100 border-2 border-purple-300 rounded-lg p-3 shadow-lg z-50">
          <div className="text-center">
            <div className="text-2xl mb-1">{POWER_UPS[activePowerUp.type].icon}</div>
            <p className="text-sm font-bold text-purple-700">{POWER_UPS[activePowerUp.type].name}</p>
            <p className="text-xs text-purple-600">Ativo!</p>
          </div>
        </div>
      )}

      {/* Área de jogo */}
      <div className="relative h-96 border-2 border-dashed border-green-300 rounded-lg bg-gradient-to-b from-sky-100 to-green-100 overflow-hidden">
        {/* Lixos caindo */}
        {fallingTrash.map(trash => (
          <div
            key={trash.id}
            className="absolute cursor-grab active:cursor-grabbing transform transition-transform duration-200 hover:scale-110 select-none"
            style={{
              left: `${trash.x}px`,
              top: `${trash.y}px`,
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              transform: `rotate(${trash.rotation}deg)`,
              zIndex: draggedItem === trash.id ? 50 : 10
            }}
            draggable
            onDragStart={(e) => {
              setDraggedItem(trash.id);
              e.dataTransfer.setData('text/plain', trash.id.toString());
            }}
            onDragEnd={() => setDraggedItem(null)}
          >
            {trash.emoji}
            {draggedItem === trash.id && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                              bg-white px-2 py-1 rounded-lg shadow-lg text-xs font-bold whitespace-nowrap">
                {trash.name}
              </div>
            )}
          </div>
        ))}

        {/* Power-ups caindo */}
        {recyclePowerUps.map(powerUp => (
          <div
            key={powerUp.id}
            className="absolute cursor-pointer transform transition-transform duration-200 hover:scale-110 animate-pulse"
            style={{
              left: `${powerUp.x}px`,
              top: `${powerUp.y}px`,
              fontSize: '2rem',
              zIndex: 20
            }}
            onClick={() => activatePowerUp(powerUp.id, powerUp.type)}
          >
            <div className="bg-purple-200 border-2 border-purple-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              {POWER_UPS[powerUp.type].icon}
            </div>
          </div>
        ))}

        {/* Efeitos de partículas */}
        {recycleParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-bounce"
            style={{ left: particle.x, top: particle.y }}
          >
            <div className="text-2xl font-bold text-green-500 animate-pulse">
              +{particle.points}
            </div>
            <div className="flex justify-center space-x-1 mt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{
                    backgroundColor: TRASH_TYPES[particle.type].color,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lixeiras */}
      <div className="flex justify-center space-x-4 mt-6">
        {Object.entries(TRASH_TYPES).map(([type, config]) => (
          <div
            key={type}
            className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const trashId = e.dataTransfer.getData('text/plain');
              if (trashId) {
                handleTrashDrop(parseInt(trashId), type);
              }
            }}
          >
            <div 
              className="w-20 h-24 rounded-lg border-4 border-dashed flex flex-col items-center justify-center transition-colors duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
              style={{ borderColor: config.color }}
            >
              <div className="text-3xl mb-1">{config.binEmoji}</div>
              <div className="text-xs font-bold text-center px-1 capitalize">
                {type}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Over Screen */}
      {recycleGameState === 'gameOver' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {recycleScore > 500 ? '🏆' : recycleScore > 200 ? '🌟' : '🌱'}
              </div>
              <CardTitle className="text-2xl">
                {recycleScore > 500 ? t('ecoHeroLegendary') : recycleScore > 200 ? t('guardianOfNature') : t('goodTry')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-700">{recycleScore}</div>
                  <div className="text-sm text-green-600">{t('points')}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-yellow-700">{recycleMaxCombo}</div>
                  <div className="text-sm text-yellow-600">{t('bestCombo')}</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-medium">💡 {t('ecoTip')}:</p>
                <p className="text-blue-600 text-sm mt-1">
                  {recycleScore > 300 
                    ? t('recyclingTip1')
                    : t('recyclingTip2')
                  }
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={resetRecycleGame} className="flex-1">
                  {t('playAgain')}
                </Button>
                <Button onClick={() => setSelectedGame(null)} variant="outline" className="flex-1">
                  {t('mainMenu')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Render principal
  if (selectedGame === 'tictactoe') {
    return <TicTacToeGame />;
  } else if (selectedGame === 'memory') {
    return <MemoryGame />;
  } else if (selectedGame === 'recycle') {
    return <ReciclaHeroGame />;
  } else {
    return <GameSelection />;
  }
};

export default GamesPage;
