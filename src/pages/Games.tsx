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
  EyeOff
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const GamesPage = () => {
  const { t } = useLanguage();
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

  const handleTicTacToeClick = (index) => {
    if (ticBoard[index] || ticWinner || ticGameOver) return;
    
    const newBoard = [...ticBoard];
    newBoard[index] = ticIsPlayerTurn ? '🌱' : '🏭';
    setTicBoard(newBoard);
    
    const winner = checkTicTacToeWinner(newBoard);
    if (winner) {
      setTicWinner(winner);
      setTicGameOver(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setTicGameOver(true);
    } else {
      setTicIsPlayerTurn(!ticIsPlayerTurn);
    }
  };

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
    }
  }, [selectedGame]);

  const GameSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-nature-light to-nature-medium p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t('ecoGames')}</h1>
          </div>
          <p className="text-muted-foreground">{t('ecoGamesSubtitle')}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
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
          <h2 className="text-2xl font-bold text-primary">🌳 {t('ecoTicTacToe')}</h2>
          <Button onClick={resetTicTacToe} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('restart')}
          </Button>
        </header>

        <Card className="p-6">
          <div className="text-center mb-6">
            {!ticGameOver ? (
              <p className="text-lg">
                {t('turnOf')}: <span className="font-bold">{ticIsPlayerTurn ? `🌱 ${t('you')}` : `🏭 ${t('ai')}`}</span>
              </p>
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
                className="w-20 h-20 bg-card border-2 border-border rounded-lg text-3xl hover:bg-accent transition-colors flex items-center justify-center"
                disabled={ticGameOver}
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

  // Render principal
  if (selectedGame === 'tictactoe') {
    return <TicTacToeGame />;
  } else if (selectedGame === 'memory') {
    return <MemoryGame />;
  } else {
    return <GameSelection />;
  }
};

export default GamesPage;
